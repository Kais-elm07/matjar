"use client"

import { useLayoutEffect } from "react"
import { useSearchParams } from "next/navigation"

import { setListingQuery } from "@/lib/listing/url-query"

/**
 * Watches URL changes from any source (Next.js links, the back button and the filters) and reports
 * them to the listing pages (src/lib/listing/url-query.ts). Mounted once in StoreShell, inside Suspense.
 */
export function ListingUrlListener() {
  const query = useSearchParams().toString()
  // Before paint, so the list does not show without filters for a moment during navigation
  useLayoutEffect(() => {
    setListingQuery(query ? `?${query}` : "")
  }, [query])
  return null
}
