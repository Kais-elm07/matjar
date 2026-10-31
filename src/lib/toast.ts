"use client"

import type { ExternalToast } from "sonner"

/**
 * رسائل التنبيه القصيرة دون تحميل مكتبتها (sonner) مع الصفحة.
 * أول رسالة تطلب مكوّن الرسائل المؤجل (src/components/store/lazy-toaster.tsx) وتنتظر ظهوره،
 * لأن sonner لا يعرض الرسائل التي سبقت ظهور مكوّنه.
 */

let requested = false
const listeners = new Set<() => void>()
let resolveMounted = () => {}
const mounted = new Promise<void>((resolve) => {
  resolveMounted = resolve
})

/** هل طلبت رسالةٌ مكوّن الرسائل قبل موعد تحميله */
export const toasterRequest = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  get: () => requested,
}

/** يستدعيه مكوّن الرسائل بعد ظهوره واشتراكه في الرسائل */
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
