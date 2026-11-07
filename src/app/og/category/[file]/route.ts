import { getBuildCatalog } from "@/lib/catalog/load"
import { jpegResponse } from "@/lib/og/render"
import { categoryShareImage } from "@/lib/og/share-images"

// A share image for each category, drawn at build time and kept until the next deploy (see
// getBuildCatalog): /og/category/<slug>.jpg
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  return (await getBuildCatalog()).categories.map((category) => ({
    file: `${category.slug}.jpg`,
  }))
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/og/category/[file]">
) {
  const { file } = await params
  const catalog = await getBuildCatalog()
  const category = catalog.categoryBySlug.get(file.replace(/\.jpg$/, ""))
  if (!category) return new Response(null, { status: 404 })
  return jpegResponse(await categoryShareImage(category))
}
