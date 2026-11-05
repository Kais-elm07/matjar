import { getSearchIndex } from "@/lib/catalog/catalog"

// Generated as a static file at build time: out/search-index.json
export const dynamic = "force-static"

/** The search index: every product card, loaded by the browser the first time search is used. */
export function GET() {
  return Response.json(getSearchIndex())
}
