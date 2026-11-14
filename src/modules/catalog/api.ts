import "server-only"

import {
  getCategory,
  getProduct,
  getSearchIndex,
} from "@/modules/catalog/queries"
import type { ProductsResponse } from "@/modules/catalog/types"
import { searchCards } from "@/modules/search/match"

/**
 * The answers of the products API (src/app/api/products). The catalog comes from the server's cache
 * (src/modules/catalog/load.ts), so every request is computed again in a few milliseconds, and a cache may
 * keep an answer only while it asks the server whether it is still current.
 */
export const API_HEADERS = {
  "Cache-Control": "public, max-age=0, must-revalidate",
}

function apiError(status: number, message: string) {
  return Response.json({ error: message }, { status, headers: API_HEADERS })
}

/**
 * GET /api/products/: every product card with its search text, or only the ones that match.
 * - q: words to search for, matched the same way as the store's search box
 * - category: a category slug; its subcategories are included
 * `empty` answers with no products, for the demo switch ?empty=1 (src/lib/demo-switches.ts).
 */
export async function productsResponse(
  params: URLSearchParams,
  { empty = false }: { empty?: boolean } = {}
) {
  const category = params.get("category")
  if (category !== null && !(await getCategory(category))) {
    return apiError(404, "الفئة غير موجودة")
  }

  let items = empty ? [] : await getSearchIndex()
  if (category !== null) {
    items = items.filter((card) => card.categorySlugs.includes(category))
  }
  const query = params.get("q")?.trim()
  if (query) items = searchCards(items, query)

  return Response.json(
    { items, total: items.length } satisfies ProductsResponse,
    { headers: API_HEADERS }
  )
}

/** GET /api/products/<slug>/: the full product, with its description, specs, photos and every variant. */
export async function productResponse(slug: string) {
  const product = await getProduct(slug)
  if (!product) return apiError(404, "المنتج غير موجود")
  return Response.json(product, { headers: API_HEADERS })
}
