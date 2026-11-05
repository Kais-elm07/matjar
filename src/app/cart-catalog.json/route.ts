import { getCartCatalog } from "@/lib/catalog/catalog"

// Generated as a static file at build time: out/cart-catalog.json
export const dynamic = "force-static"

/** Prices and stock of all variants; the cart saved in the browser is checked against them after each deploy. */
export function GET() {
  return Response.json(getCartCatalog())
}
