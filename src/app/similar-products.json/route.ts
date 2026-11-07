import { getSimilarProducts } from "@/lib/catalog/catalog"

// Prerendered at build time and served as a file, then drawn again when the catalog changes
// (its tag "catalog", see src/lib/catalog/load.ts)
export const dynamic = "force-static"

/** The in-stock products similar to each product, loaded by Najm (the store's mascot) to suggest them after adding to the cart. */
export async function GET() {
  return Response.json(await getSimilarProducts())
}
