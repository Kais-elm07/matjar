import { API_HEADERS } from "@/modules/catalog/api"
import { getCartCatalog } from "@/modules/catalog/queries"

// Computed on every request from the cached catalog (src/modules/catalog/load.ts), which is cheap: a file
// prepared at build time is not refreshed by the catalog's tag on Netlify, and the stock changes with
// every order
export const dynamic = "force-dynamic"

/** Prices and stock of all variants; the cart saved in the browser is checked against them. */
export async function GET() {
  return Response.json(await getCartCatalog(), { headers: API_HEADERS })
}
