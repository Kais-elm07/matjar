import { categories } from "@/data/categories"
import { products } from "@/data/products"
import {
  categoryRows,
  productRows,
  type CatalogRows,
} from "@/modules/catalog/rows"
import type { ImageMeta } from "@/modules/catalog/types"
import { validateCatalogData } from "@/modules/catalog/validate"

/**
 * The catalog rows from the src/data files, after validating them: what pnpm db:seed writes to the
 * database, and what the unit tests read instead of it. A mistake in the data throws here, with an
 * Arabic message that names every wrong field.
 */
export function fileRows(meta: ImageMeta): CatalogRows {
  const parsed = validateCatalogData(categories, products)
  return {
    categories: categoryRows(parsed.categories),
    products: productRows(parsed.products, meta),
  }
}
