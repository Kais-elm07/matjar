"use client"

import { fromURLSearchParams, parseListingParams } from "@/lib/listing/params"
import { useListingQuery } from "@/lib/listing/url-query"

/**
 * The products page title, based on the URL: "العروض" (Offers), "وصل حديثاً" (New arrivals)
 * or "كل المنتجات" (All products), the names of the shop links in src/config/site.ts.
 * The URL is read with the same rules as the product list.
 */
export function ProductsHeading() {
  const { onSale, sort } = parseListingParams(
    fromURLSearchParams(new URLSearchParams(useListingQuery()))
  )
  const title = onSale
    ? "العروض"
    : sort === "newest"
      ? "وصل حديثاً"
      : "كل المنتجات"

  return <h1 className="mb-6 text-2xl font-bold md:text-3xl">{title}</h1>
}
