import { isSimilarProducts } from "@/lib/catalog/guards"
import type { SimilarProduct, SimilarProducts } from "@/lib/catalog/types"
import { jsonLoader } from "@/lib/json-loader"

/** The similar products of every product, loaded once per visit when Najm first appears. */
export const loadSimilarProducts = jsonLoader(
  "/similar-products.json",
  isSimilarProducts
)

/**
 * The products Najm suggests after `slug` is added to the cart: its similar products that are not
 * in the cart already, at most `limit` of them.
 */
export function pickSuggestions(
  similar: SimilarProducts,
  slug: string,
  inCart: ReadonlySet<string>,
  limit = 2
): SimilarProduct[] {
  return (similar[slug] ?? [])
    .filter((product) => !inCart.has(product.slug))
    .slice(0, limit)
}
