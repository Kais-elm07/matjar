import type { NextRequest } from "next/server"

import { productsResponse } from "@/modules/catalog/api"

/**
 * The product list: /api/products/, /api/products/?q=قميص and /api/products/?category=men.
 * It reads the request's query, so the server answers every request (it is not prepared at build time).
 */
export function GET(request: NextRequest) {
  return productsResponse(request.nextUrl.searchParams)
}
