import { getBuildCatalog } from "@/modules/catalog/load"
import { jpegResponse } from "@/modules/share-images/render"
import { siteShareImage } from "@/modules/share-images/layouts"

// Drawn once at build time and served as a file until the next deploy (see getBuildCatalog)
export const dynamic = "force-static"

/** The general share image: for the home page and every page without its own image. */
export async function GET() {
  return jpegResponse(await siteShareImage(await getBuildCatalog()))
}
