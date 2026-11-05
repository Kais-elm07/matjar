"use client"

import { useEffect, useState } from "react"

/**
 * Becomes true once the page has finished loading and the browser is idle.
 * Pop-ups (the cart, the menu, the image zoom and the filters) use it to load their code
 * after the content appears, not before, so they are ready to open at once without delaying the page.
 */
export function useIdle() {
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    let cancel = () => {}
    const schedule = () => {
      // Safari does not support requestIdleCallback, so wait one and a half seconds after load
      if ("requestIdleCallback" in window) {
        const id = window.requestIdleCallback(() => setIdle(true), {
          timeout: 3000,
        })
        cancel = () => window.cancelIdleCallback(id)
      } else {
        const id = setTimeout(() => setIdle(true), 1500)
        cancel = () => clearTimeout(id)
      }
    }
    if (document.readyState === "complete") schedule()
    else window.addEventListener("load", schedule, { once: true })
    return () => {
      window.removeEventListener("load", schedule)
      cancel()
    }
  }, [])

  return idle
}
