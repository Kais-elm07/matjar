import { describe, expect, it } from "vitest"

import { productResponse, productsResponse } from "@/modules/catalog/api"
import { getCategories, getProducts } from "@/modules/catalog/queries"
import { isProductsResponse } from "@/modules/catalog/guards"

async function listFor(query: string) {
  const response = await productsResponse(new URLSearchParams(query))
  const body: unknown = await response.json()
  if (!isProductsResponse(body)) throw new Error("Unexpected answer shape")
  return { status: response.status, body }
}

describe("GET /api/products/", () => {
  it("lists every product with its count", async () => {
    const { status, body } = await listFor("")
    expect(status).toBe(200)
    expect(body.total).toBe((await getProducts()).length)
    expect(body.items).toHaveLength(body.total)
  })

  it("finds a product by a word of its name", async () => {
    const [product] = await getProducts()
    const word = product.name.split(" ")[0]
    const { body } = await listFor(`q=${encodeURIComponent(word)}`)
    expect(body.items.map((card) => card.slug)).toContain(product.slug)
    expect(body.total).toBe(body.items.length)
  })

  it("keeps a category's products, including its subcategories", async () => {
    const category = (await getCategories()).find(
      (entry) => entry.childSlugs.length
    )
    if (!category) throw new Error("No category has subcategories")
    const { body } = await listFor(`category=${category.slug}`)
    expect(body.total).toBe(category.productCount)
    for (const card of body.items) {
      expect(card.categorySlugs).toContain(category.slug)
    }
  })

  it("answers 404 for an unknown category", async () => {
    const response = await productsResponse(
      new URLSearchParams("category=nope")
    )
    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: "الفئة غير موجودة" })
  })

  it("lets a cache keep the answer only while it checks with the server", async () => {
    expect(
      (await productsResponse(new URLSearchParams())).headers.get(
        "Cache-Control"
      )
    ).toBe("public, max-age=0, must-revalidate")
  })
})

describe("GET /api/products/<slug>/", () => {
  it("returns the full product", async () => {
    const [product] = await getProducts()
    const response = await productResponse(product.slug)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(product)))
  })

  it("answers 404 for an unknown slug", async () => {
    const response = await productResponse("no-such-product")
    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: "المنتج غير موجود" })
  })
})
