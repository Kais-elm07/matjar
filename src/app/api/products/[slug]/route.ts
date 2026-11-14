import { productResponse } from "@/modules/catalog/api"
import { applyDemoSwitches } from "@/lib/demo-switches"

/**
 * One product by its slug: /api/products/classic-cotton-shirt/, or 404 with { error }.
 * Outside production it also obeys the demo switches ?delay= and ?fail= (?empty=1 is for lists).
 */
export async function GET(
  request: Request,
  { params }: RouteContext<"/api/products/[slug]">
) {
  const { failure } = await applyDemoSwitches(request)
  if (failure) return failure
  const { slug } = await params
  return productResponse(slug)
}
