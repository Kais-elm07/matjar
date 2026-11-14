import type { NextRequest } from "next/server"

import { productsResponse } from "@/modules/catalog/api"
import { applyDemoSwitches } from "@/lib/demo-switches"

/**
 * The product list: /api/products/, /api/products/?q=قميص and /api/products/?category=men.
 * It reads the request's query, so the server answers every request (it is not prepared at build time).
 * Outside production it also obeys the demo switches ?delay=, ?fail= and ?empty=1.
 */
export async function GET(request: NextRequest) {
  const { failure, empty } = await applyDemoSwitches(request)
  if (failure) return failure
  return productsResponse(request.nextUrl.searchParams, { empty })
}
