"use client"

import { useListingQuery } from "@/lib/listing/url-query"

/**
 * The products page title, based on the URL: "العروض" (Offers), "وصل حديثاً" (New arrivals)
 * or "كل المنتجات" (All products).
 */
export function ProductsHeading() {
  const params = new URLSearchParams(useListingQuery())
  const title =
    params.get("sale") === "1"
      ? "العروض"
      : params.get("sort") === "newest"
        ? "وصل حديثاً"
        : "كل المنتجات"

  return <h1 className="mb-6 text-2xl font-bold md:text-3xl">{title}</h1>
}
