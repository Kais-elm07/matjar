"use client"

import { useSyncExternalStore } from "react"

/**
 * The query string of the listing pages' URL (such as "?sale=1&sort=newest"), shared by the
 * product list, the filters and the heading.
 *
 * Why not use useSearchParams directly? On a page prepared at build time, useSearchParams makes the list
 * render only in the browser, so the products are missing from the HTML file and the images load late.
 * Here the list is prepared at build time without filters, then the URL filters apply as soon as the page loads.
 * ListingUrlListener (src/modules/listing/components/listing-url-listener.tsx) reports every URL change here.
 */

let current = typeof window === "undefined" ? "" : window.location.search
const listeners = new Set<() => void>()

/** Records the URL's new query string and notifies the lists. */
export function setListingQuery(next: string) {
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
export function useListingQuery() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => ""
  )
}

/** Updates the URL without reloading the page, and notifies the lists at once. */
export function updateListingUrl(href: string, push = false) {
  window.history[push ? "pushState" : "replaceState"](null, "", href)
  setListingQuery(window.location.search)
}
