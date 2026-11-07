import { buildCatalog, type Catalog } from "@/lib/catalog/build"
import { fileRows } from "@/lib/catalog/file-rows"
import { storeToday } from "@/lib/dates"

/**
 * Takes the place of src/lib/catalog/load.ts in the unit tests (vitest.config.mts): the catalog is
 * built from the src/data files instead of the database, with no photo colors (the stage's blue).
 * The files are read on the first call, so a test that mocks @/data/... sees its own data; the
 * validation errors in that data are thrown from the first catalog function the test awaits.
 */

let built: Catalog | undefined

export async function getCatalog(): Promise<Catalog> {
  built ??= buildCatalog(fileRows({}), storeToday())
  return built
}
