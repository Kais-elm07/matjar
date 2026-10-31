import { getCategories, getCategory } from "@/lib/catalog/catalog"
import { categoryCard } from "@/lib/og/cards"
import { jpegResponse } from "@/lib/og/render"

// صورة مشاركة لكل فئة تُولَّد وقت البناء: out/og/category/<slug>.jpg
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return getCategories().map((category) => ({ file: `${category.slug}.jpg` }))
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/og/category/[file]">
) {
  const { file } = await params
  const category = getCategory(file.replace(/\.jpg$/, ""))
  if (!category) return new Response(null, { status: 404 })
  return jpegResponse(await categoryCard(category))
}
