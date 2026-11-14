import { getBuildCatalog } from "@/modules/catalog/load"
import {
  jpegResponse,
  shareImageOutsideBuild,
} from "@/modules/share-images/render"
import { categoryShareImage } from "@/modules/share-images/layouts"

// A share image for each category, drawn at build time and kept until the next deploy (see
// getBuildCatalog): /og/category/<slug>.jpg. A category added later gets the site's image until then.
export const dynamic = "force-static"
export const dynamicParams = true

export async function generateStaticParams() {
  return (await getBuildCatalog()).categories.map((category) => ({
    file: `${category.slug}.jpg`,
  }))
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/og/category/[file]">
) {
  const outsideBuild = shareImageOutsideBuild()
  if (outsideBuild) return outsideBuild
  const { file } = await params
  const catalog = await getBuildCatalog()
  const category = catalog.categoryBySlug.get(file.replace(/\.jpg$/, ""))
  if (!category) return new Response(null, { status: 404 })
  return jpegResponse(await categoryShareImage(category))
}
