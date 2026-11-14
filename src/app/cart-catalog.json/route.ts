import { API_HEADERS } from "@/modules/catalog/api"
import { getCartCatalog } from "@/modules/catalog/queries"
import { applyDemoSwitches } from "@/lib/demo-switches"

// Computed on every request from the cached catalog (src/modules/catalog/load.ts), which is cheap: a file
// prepared at build time is not refreshed by the catalog's tag on Netlify, and the stock changes with
// every order
export const dynamic = "force-dynamic"

/**
 * Prices and stock of all variants; the cart saved in the browser is checked against them.
 * Outside production it also obeys the demo switches ?delay= and ?fail=, but not ?empty=1: an empty
 * answer would take every line out of the visitor's cart.
 */
export async function GET(request: Request) {
  const { failure } = await applyDemoSwitches(request)
  if (failure) return failure
  return Response.json(await getCartCatalog(), { headers: API_HEADERS })
}
