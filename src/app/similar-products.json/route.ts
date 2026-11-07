import { getSimilarProducts } from "@/lib/catalog/catalog"

// Generated as a static file at build time: out/similar-products.json
export const dynamic = "force-static"

/** The in-stock products similar to each product, loaded by Najm (the store's mascot) to suggest them after adding to the cart. */
export function GET() {
  return Response.json(getSimilarProducts())
}
