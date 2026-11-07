import { getCartCatalog } from "@/lib/catalog/catalog"

// Prerendered at build time and served as a file
export const dynamic = "force-static"

/** Prices and stock of all variants; the cart saved in the browser is checked against them after each deploy. */
export function GET() {
  return Response.json(getCartCatalog())
}
