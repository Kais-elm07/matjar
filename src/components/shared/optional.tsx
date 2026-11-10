"use client"

import { catchError } from "next/error"

interface OptionalProps {
  /** What takes the part's place when it fails; nothing by default */
  fallback?: React.ReactNode
}

/**
 * A part of the page the visitor can do without: Najm, the cart panel, the zoom dialog, the search
 * suggestions and every other part whose code is downloaded apart from the page (next/dynamic).
 * When that code doesn't arrive, on a weak connection or after a new version of the site is published,
 * or the part fails while it draws, it is left out and the page around it keeps working. Without this
 * the error climbs to the nearest error page, which replaces everything the visitor was doing.
 * The part stays out until the page is loaded again, because a failed download is not asked for twice.
 */
export const Optional = catchError(function OptionalFallback({
  fallback = null,
}: OptionalProps) {
  return fallback
})
