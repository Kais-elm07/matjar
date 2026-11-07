import { getBuildCatalog } from "@/lib/catalog/load"
import { jpegResponse } from "@/lib/og/render"
import { productShareImage } from "@/lib/og/share-images"

// A share image for each product, drawn at build time and kept until the next deploy (see
// getBuildCatalog): /og/product/<slug>.jpg
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  return (await getBuildCatalog()).products.map((product) => ({
    file: `${product.slug}.jpg`,
  }))
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/og/product/[file]">
) {
  const { file } = await params
  const catalog = await getBuildCatalog()
  const product = catalog.productBySlug.get(file.replace(/\.jpg$/, ""))
  if (!product) return new Response(null, { status: 404 })
  return jpegResponse(await productShareImage(product))
}
