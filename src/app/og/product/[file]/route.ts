import { getProduct, getProducts } from "@/lib/catalog/catalog"
import { productCard } from "@/lib/og/cards"
import { jpegResponse } from "@/lib/og/render"

// صورة مشاركة لكل منتج تُولَّد وقت البناء: out/og/product/<slug>.jpg
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return getProducts().map((product) => ({ file: `${product.slug}.jpg` }))
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/og/product/[file]">
) {
  const { file } = await params
  const product = getProduct(file.replace(/\.jpg$/, ""))
  if (!product) return new Response(null, { status: 404 })
  return jpegResponse(await productCard(product))
}
