"use client"

import type { ExternalToast } from "sonner"

/**
 * Short notification messages (toasts) without loading their library (sonner) with the page.
 * The first message asks LazyToaster (src/components/layout/lazy-toaster.tsx) to load the toast list, and waits for it to mount,
 * because sonner does not show messages sent before its component mounted.
 */

let requested = false
const listeners = new Set<() => void>()
let resolveMounted = () => {}
const mounted = new Promise<void>((resolve) => {
  resolveMounted = resolve
})

/** Whether a message requested the toaster before its scheduled load */
export const toasterRequest = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  get: () => requested,
}

/** Called by the toaster once it has mounted and subscribed to messages */
export function markToasterMounted() {
  resolveMounted()
}

function show(
  kind: "message" | "error",
  message: string,
  options?: ExternalToast
) {
  if (!requested) {
    requested = true
    for (const listener of listeners) listener()
  }
  void Promise.all([import("sonner"), mounted]).then(([{ toast }]) => {
    if (kind === "error") toast.error(message, options)
    else toast(message, options)
  })
}

export const toast = Object.assign(
  (message: string, options?: ExternalToast) =>
    show("message", message, options),
  {
    error: (message: string, options?: ExternalToast) =>
      show("error", message, options),
  }
)
