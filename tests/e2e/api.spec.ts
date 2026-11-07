import { expect, test } from "@playwright/test"

import { isProductsResponse } from "../../src/lib/catalog/guards"
import { productApiPath, productsApiPath } from "../../src/lib/routes"
import { loadProducts } from "./helpers"

// The API answers the same on every device, so it is checked once
test.skip(
  ({ browserName, isMobile }) => browserName !== "chromium" || isMobile,
  "The products API is checked on desktop Chrome only"
)

test("The products API lists, searches and returns one product", async ({
  request,
}) => {
  const products = await loadProducts(request)
  expect(products.length).toBeGreaterThan(0)

  const [product] = products
  const word = product.name.split(" ")[0]
  const search = await request.get(
    `${productsApiPath}?q=${encodeURIComponent(word)}`
  )
  expect(search.ok()).toBe(true)
  const found: unknown = await search.json()
  if (!isProductsResponse(found))
    throw new Error("Unexpected products API answer")
  expect(found.items.map((card) => card.slug)).toContain(product.slug)

  const one = await request.get(productApiPath(product.slug))
  expect(one.ok()).toBe(true)
  expect(await one.json()).toMatchObject({
    slug: product.slug,
    name: product.name,
  })
})

test("The products API answers 404 for an unknown product, and redirects an address without the slash", async ({
  request,
}) => {
  const missing = await request.get(productApiPath("no-such-product"))
  expect(missing.status()).toBe(404)
  expect(await missing.json()).toEqual({ error: "المنتج غير موجود" })

  const withoutSlash = await request.get("/api/products", { maxRedirects: 0 })
  expect(withoutSlash.status()).toBe(308)
  expect(withoutSlash.headers().location).toBe(productsApiPath)
})
