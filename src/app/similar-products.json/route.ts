import { API_HEADERS } from "@/modules/catalog/api"
import { getSimilarProducts } from "@/modules/catalog/queries"
import { applyDemoSwitches } from "@/lib/demo-switches"

// Computed on every request from the cached catalog (src/modules/catalog/load.ts), which is cheap: a file
// prepared at build time is not refreshed by the catalog's tag on Netlify, and the stock changes with
// every order
export const dynamic = "force-dynamic"

/**
 * The in-stock products similar to each product, loaded by Najm (the store's mascot) to suggest them
 * after adding to the cart. Outside production it also obeys the demo switches ?delay=, ?fail= and
 * ?empty=1 (no suggestions).
 */
export async function GET(request: Request) {
  const { failure, empty } = await applyDemoSwitches(request)
  if (failure) return failure
  return Response.json(empty ? {} : await getSimilarProducts(), {
    headers: API_HEADERS,
  })
}
