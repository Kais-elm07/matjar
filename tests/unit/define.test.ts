import { describe, expect, it } from "vitest"

import {
  optionMatrix,
  productImages,
  singleVariant,
} from "@/modules/catalog/define"

/** The helpers for writing products in src/data/products.ts, as the store owner uses them. */
describe("optionMatrix", () => {
  const options = { المقاس: ["S", "M", "L"], اللون: ["أبيض", "أزرق"] }
  const base = { sku: "SHIRT", price: 129, stock: 10 }

  it("generates a variant for every combination, with SKUs numbered in order", () => {
    const variants = optionMatrix(options, base)
    expect(variants).toHaveLength(6)
    expect(variants.map((variant) => variant.sku)).toEqual([
      "SHIRT-01",
      "SHIRT-02",
      "SHIRT-03",
      "SHIRT-04",
      "SHIRT-05",
      "SHIRT-06",
    ])
    expect(variants[1].options).toEqual({ المقاس: "S", اللون: "أزرق" })
  })

  it("gives a full-combination override precedence over a single-value override", () => {
    const variants = optionMatrix(options, base, {
      L: { price: 139 },
      "L/أزرق": { price: 149, stock: 0 },
    })
    const find = (size: string, color: string) =>
      variants.find(
        (variant) =>
          variant.options?.["المقاس"] === size &&
          variant.options?.["اللون"] === color
      )
    expect(find("L", "أبيض")).toMatchObject({ price: 139, stock: 10 })
    expect(find("L", "أزرق")).toMatchObject({ price: 149, stock: 0 })
    expect(find("M", "أبيض")).toMatchObject({ price: 129, stock: 10 })
  })

  it("stops the build on an override key that matches no value or combination", () => {
    expect(() =>
      optionMatrix(options, base, { XL: { stock: 0 }, "M/ازرق": { stock: 0 } })
    ).toThrow(/مفاتيح تعديل لا تطابق أي قيمة أو تركيبة: XL، M\/ازرق/)
  })
})

describe("productImages and singleVariant", () => {
  it("lists the image paths in order and links each image to its color", () => {
    expect(productImages("watch", 2)).toEqual([
      { src: "/images/products/watch-1" },
      { src: "/images/products/watch-2" },
    ])
    expect(productImages("watch", ["فضي", null])).toEqual([
      { src: "/images/products/watch-1", color: "فضي" },
      { src: "/images/products/watch-2" },
    ])
  })

  it("creates a single variant for a product without options", () => {
    expect(
      singleVariant({ sku: "WALLET", price: 89, compareAtPrice: 99, stock: 3 })
    ).toEqual([{ sku: "WALLET", price: 89, compareAtPrice: 99, stock: 3 }])
  })
})
