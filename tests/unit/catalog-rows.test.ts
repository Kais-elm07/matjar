import { describe, expect, it } from "vitest"

import { categories } from "@/data/categories"
import { products } from "@/data/products"
import { categoryRows, productRows } from "@/lib/catalog/rows"
import { categorySchema, productSchema } from "@/lib/catalog/schema"
import { validateCatalogData } from "@/lib/catalog/validate"

/**
 * The rows pnpm db:seed writes to the database (src/lib/catalog/rows.ts): prices in halalas, each photo's
 * tone and cut-out from the data or from image-meta.json, and the order the files are written in.
 */

const shirt = productSchema.parse({
  slug: "test-shirt",
  name: "قميص تجريبي",
  category: "men",
  images: [
    { src: "/images/products/test-shirt-1", color: "أبيض" },
    { src: "/images/products/test-shirt-2", tone: "#1d4ed8" },
    { src: "/images/products/test-shirt-3" },
  ],
  variants: [
    {
      sku: "T-1",
      options: { المقاس: "M", اللون: "أبيض" },
      price: 129.5,
      compareAtPrice: 149,
      stock: 5,
    },
    {
      sku: "T-2",
      options: { المقاس: "L", اللون: "أبيض" },
      price: 99,
      stock: 0,
    },
  ],
  createdAt: "2026-10-01",
  saleEndsAt: "2026-12-31",
})

const meta = {
  "/images/products/test-shirt-1": { color: "#c2410c", cutout: true },
  "/images/products/test-shirt-2": { color: "#15803d", cutout: false },
}

describe("product rows", () => {
  const [row] = productRows([shirt], meta)

  it("keeps prices in halalas and the deal's dates as written", () => {
    expect(row.variants.map((v) => [v.price, v.compareAtPrice])).toEqual([
      [12950, 14900],
      [9900, null],
    ])
    expect(row.createdAt).toBe("2026-10-01")
    expect(row.saleEndsAt).toBe("2026-12-31")
    expect(row.categorySlug).toBe("men")
  })

  it("gives each variant its options key and its place", () => {
    expect(row.variants[0]).toMatchObject({
      sku: "T-1",
      optionsKey: "اللون=أبيض|المقاس=M",
      position: 0,
    })
    expect(row.variants[1].position).toBe(1)
  })

  it("takes the tone set in the data, else the measured one, else none", () => {
    expect(
      row.images.map((image) => [image.position, image.tone, image.cutout])
    ).toEqual([
      [0, "#c2410c", true],
      [1, "#1d4ed8", false],
      [2, null, false],
    ])
    expect(row.images[0].color).toBe("أبيض")
    expect(row.images[0].alt).toBeNull()
  })
})

describe("category rows", () => {
  it("points to the parent by slug and keeps the file's order", () => {
    const rows = categoryRows([
      categorySchema.parse({ slug: "clothing", name: "ملابس" }),
      categorySchema.parse({
        slug: "men",
        name: "رجالي",
        parent: "clothing",
        description: "",
      }),
    ])
    expect(rows).toEqual([
      {
        slug: "clothing",
        name: "ملابس",
        description: null,
        imageSrc: null,
        parentSlug: null,
        position: 0,
      },
      {
        slug: "men",
        name: "رجالي",
        description: null,
        imageSrc: null,
        parentSlug: "clothing",
        position: 1,
      },
    ])
  })
})

it("turns every product and category in src/data into rows", () => {
  const parsed = validateCatalogData(categories, products)
  const rows = productRows(parsed.products, {})
  expect(rows).toHaveLength(products.length)
  expect(categoryRows(parsed.categories)).toHaveLength(categories.length)
  const skus = rows.flatMap((row) => row.variants.map((v) => v.sku))
  expect(new Set(skus).size).toBe(skus.length)
  for (const row of rows) {
    expect(row.variants.every((v) => Number.isInteger(v.price))).toBe(true)
  }
})
