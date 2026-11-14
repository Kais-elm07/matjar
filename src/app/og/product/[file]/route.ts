import { getBuildCatalog } from "@/modules/catalog/load"
import {
  jpegResponse,
  shareImageOutsideBuild,
} from "@/modules/share-images/render"
import { productShareImage } from "@/modules/share-images/layouts"

// A share image for each product, drawn at build time and kept until the next deploy (see
// getBuildCatalog): /og/product/<slug>.jpg. A product added later gets the site's image until then.
export const dynamic = "force-static"
export const dynamicParams = true

export async function generateStaticParams() {
  return (await getBuildCatalog()).products.map((product) => ({
    file: `${product.slug}.jpg`,
  }))
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/og/product/[file]">
) {
  const outsideBuild = shareImageOutsideBuild()
  if (outsideBuild) return outsideBuild
  const { file } = await params
  const catalog = await getBuildCatalog()
  const product = catalog.productBySlug.get(file.replace(/\.jpg$/, ""))
  if (!product) return new Response(null, { status: 404 })
  return jpegResponse(await productShareImage(product))
}
