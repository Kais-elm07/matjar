"use client"

import { useEffect, useState } from "react"

import { useIdle } from "@/hooks/use-idle"

const INTERACTIONS: readonly (keyof WindowEventMap)[] = [
  "pointermove",
  "pointerdown",
  "keydown",
  "scroll",
  "touchstart",
]

/**
 * Becomes true the first time the visitor moves the mouse, touches, scrolls or types, once the page has loaded
 * and the browser is idle. Najm's code (three.js) waits for it, so it never competes with the page while it
 * loads; a visitor reaches for the page within a second, and he appears then.
 */
export function useFirstInteraction() {
  const idle = useIdle()
  const [interacted, setInteracted] = useState(false)

  useEffect(() => {
    if (!idle || interacted) return
    const onInteraction = () => setInteracted(true)
    for (const type of INTERACTIONS) {
      window.addEventListener(type, onInteraction, {
        passive: true,
        once: true,
      })
    }
    return () => {
      for (const type of INTERACTIONS) {
        window.removeEventListener(type, onInteraction)
      }
    }
  }, [idle, interacted])

  return interacted
}
