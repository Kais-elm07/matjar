import { productResponse } from "@/lib/api/products"

/** One product by its slug: /api/products/classic-cotton-shirt/, or 404 with { error }. */
export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/products/[slug]">
) {
  const { slug } = await params
  return productResponse(slug)
}
