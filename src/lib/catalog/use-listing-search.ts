"use client"

import { useLayoutEffect, useSyncExternalStore } from "react"
import { useSearchParams } from "next/navigation"

/**
 * URL parameters for the listing pages (such as "?sale=1&sort=newest").
 *
 * Why not use useSearchParams directly? On a static site, useSearchParams makes the list
 * render only in the browser, so the products are missing from the HTML file and the images load late.
 * Here the list is prepared at build time without filters, then the URL filters apply as soon as the page loads.
 */

let current = typeof window === "undefined" ? "" : window.location.search
const listeners = new Set<() => void>()

function emit(next: string) {
  if (next === current) return
  current = next
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** The current URL's query string. Empty during the build and the first render in the browser. */
export function useListingSearch() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => ""
  )
}

/** Updates the URL without reloading the page, and notifies the lists at once. */
export function updateListingUrl(href: string, push = false) {
  window.history[push ? "pushState" : "replaceState"](null, "", href)
  emit(window.location.search)
}

/**
 * Watches URL changes from any source: Next.js links, the back button, and filter updates.
 * Placed once in the store layout, inside Suspense.
 */
export function SearchParamsListener() {
  const value = useSearchParams().toString()
  // Before paint, so the list does not show without filters for a moment during navigation
  useLayoutEffect(() => {
    emit(value ? `?${value}` : "")
  }, [value])
  return null
}
