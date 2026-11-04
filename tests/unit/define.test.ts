import { describe, expect, it } from "vitest"

import {
  optionMatrix,
  productImages,
  singleVariant,
} from "@/lib/catalog/define"

/** أدوات كتابة المنتجات في src/data/products.ts كما يستخدمها صاحب المتجر. */
describe("optionMatrix", () => {
  const options = { المقاس: ["S", "M", "L"], اللون: ["أبيض", "أزرق"] }
  const base = { sku: "SHIRT", price: 129, stock: 10 }

  it("يولّد متغيراً لكل تركيبة برموز مرقمة بالترتيب", () => {
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

  it("تعديل التركيبة الكاملة يتقدم على تعديل القيمة الواحدة", () => {
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

  it("يوقف البناء عند مفتاح تعديل لا يطابق أي قيمة أو تركيبة", () => {
    expect(() =>
      optionMatrix(options, base, { XL: { stock: 0 }, "M/ازرق": { stock: 0 } })
    ).toThrow(/مفاتيح تعديل لا تطابق أي قيمة أو تركيبة: XL، M\/ازرق/)
  })
})

describe("productImages وsingleVariant", () => {
  it("يرتب مسارات الصور ويربط كل صورة بلونها", () => {
    expect(productImages("watch", 2)).toEqual([
      { src: "/images/products/watch-1" },
      { src: "/images/products/watch-2" },
    ])
    expect(productImages("watch", ["فضي", null])).toEqual([
      { src: "/images/products/watch-1", color: "فضي" },
      { src: "/images/products/watch-2" },
    ])
  })

  it("ينشئ متغيراً واحداً لمنتج بلا خيارات", () => {
    expect(
      singleVariant({ sku: "WALLET", price: 89, compareAtPrice: 99, stock: 3 })
    ).toEqual([{ sku: "WALLET", price: 89, compareAtPrice: 99, stock: 3 }])
  })
})
