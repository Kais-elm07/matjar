import { getSearchIndex } from "@/lib/catalog/catalog"

// Prerendered at build time and served as a file
export const dynamic = "force-static"

/** The search index: every product card, loaded by the browser the first time search is used. */
export function GET() {
  return Response.json(getSearchIndex())
}
