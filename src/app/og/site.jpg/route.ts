import { getBuildCatalog } from "@/lib/catalog/load"
import { jpegResponse } from "@/lib/og/render"
import { siteShareImage } from "@/lib/og/share-images"

// Drawn once at build time and served as a file until the next deploy (see getBuildCatalog)
export const dynamic = "force-static"

/** The general share image: for the home page and every page without its own image. */
export async function GET() {
  return jpegResponse(await siteShareImage(await getBuildCatalog()))
}
