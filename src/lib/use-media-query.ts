"use client"

import { useCallback, useSyncExternalStore } from "react"

/** هل تطابق الشاشة استعلام CSS، مثل "(min-width: 64rem)". في HTML المولّد مسبقاً تكون false. */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener("change", onChange)
      return () => list.removeEventListener("change", onChange)
    },
    [query]
  )
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  )
}
