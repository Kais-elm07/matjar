import { getCartCatalog } from "@/lib/catalog/catalog"

// Prerendered at build time and served as a file, then drawn again when the catalog changes
// (its tag "catalog", see src/lib/catalog/load.ts)
export const dynamic = "force-static"

/** Prices and stock of all variants; the cart saved in the browser is checked against them after each deploy. */
export async function GET() {
  return Response.json(await getCartCatalog())
}
