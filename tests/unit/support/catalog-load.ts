import { buildCatalog, type Catalog } from "@/lib/catalog/build"
import { fileRows } from "@/lib/catalog/file-rows"
import type { Product } from "@/lib/catalog/types"
import { storeToday } from "@/lib/dates"

/**
 * Takes the place of src/lib/catalog/load.ts in the unit tests (vitest.config.mts): the catalog is
 * built from the src/data files instead of the database, with no photo colors (the stage's blue).
 * The files are read on the first call, so a test that mocks @/data/... sees its own data; the
 * validation errors in that data are thrown from the first catalog function the test awaits.
 */

export const CATALOG_TAG = "catalog"

let built: Catalog | undefined

export async function getCatalog(): Promise<Catalog> {
  built ??= buildCatalog(fileRows({}), storeToday())
  return built
}

/** The products that own these SKUs, as the orders read them from the database */
export async function readLiveProducts(skus: string[]): Promise<Product[]> {
  const { products } = await getCatalog()
  return products.filter((product) =>
    product.variants.some((variant) => skus.includes(variant.sku))
  )
}
