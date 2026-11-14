import { describe, expect, it } from "vitest"

import {
  emptyProductForm,
  fieldLabel,
  productFormFrom,
  toProductInput,
  type ProductFormValues,
} from "@/lib/admin/product-form"
import { productSchema } from "@/modules/catalog/schema"
import { productProblems } from "@/modules/catalog/validate"

/** The admin panel's product form: from the owner's text to the shape of src/data, and back. */

const form: ProductFormValues = {
  ...emptyProductForm("2026-11-07"),
  name: " قميص تجريبي ",
  slug: "test-shirt",
  category: "men",
  specs: "الخامة: قطن\n\nالقصّة: مريحة",
  popularity: "١٢",
  saleEndsAt: "2026-12-31",
  images: [
    { src: "/images/products/test-shirt-1", color: "أبيض", alt: "" },
    { src: "", color: "", alt: "" },
  ],
  variants: [
    {
      sku: "T-1",
      options: "المقاس: M، اللون: أبيض",
      price: "129.5",
      compareAtPrice: "149",
      stock: "٥",
    },
    {
      sku: "T-2",
      options: "المقاس: L, اللون: أبيض",
      price: "99",
      compareAtPrice: "",
      stock: "0",
    },
  ],
}

describe("the product form", () => {
  it("becomes a product the data rules accept, with Arabic digits read as numbers", () => {
    const parsed = productSchema.parse(toProductInput(form))
    expect(parsed.name).toBe("قميص تجريبي")
    expect(parsed.popularity).toBe(12)
    expect(parsed.specs).toEqual([
      { label: "الخامة", value: "قطن" },
      { label: "القصّة", value: "مريحة" },
    ])
    // The empty photo row is left out
    expect(parsed.images).toEqual([
      { src: "/images/products/test-shirt-1", color: "أبيض" },
    ])
    expect(parsed.variants.map((v) => [v.options, v.price, v.stock])).toEqual([
      [{ المقاس: "M", اللون: "أبيض" }, 129.5, 5],
      [{ المقاس: "L", اللون: "أبيض" }, 99, 0],
    ])
    expect(parsed.variants[1].compareAtPrice).toBeUndefined()
    expect(productProblems(parsed)).toEqual([])
  })

  it("names the wrong fields as the owner sees them", () => {
    const result = productSchema.safeParse(
      toProductInput({
        ...form,
        slug: "Not A Slug",
        variants: [{ ...form.variants[0], price: "سعر" }],
      })
    )
    expect(result.success).toBe(false)
    const fields = result.error?.issues.map((issue) => fieldLabel(issue.path))
    expect(fields).toContain("الرابط")
    expect(fields).toContain("المتغير 1، السعر")
  })

  it("comes back from a saved product with the prices in riyals", () => {
    const back = productFormFrom({
      name: "قميص",
      slug: "test-shirt",
      category: "men",
      description: "",
      specs: [{ label: "الخامة", value: "قطن" }],
      popularity: 3,
      createdAt: "2026-10-01",
      saleEndsAt: null,
      hidden: true,
      images: [{ src: "/images/products/x-1", color: null, alt: null }],
      variants: [
        {
          sku: "T-1",
          options: { المقاس: "M" },
          price: 12950,
          compareAtPrice: null,
          stock: 4,
        },
      ],
    })
    expect(back.specs).toBe("الخامة: قطن")
    expect(back.saleEndsAt).toBe("")
    expect(back.images[0]).toEqual({
      src: "/images/products/x-1",
      color: "",
      alt: "",
    })
    expect(back.variants[0]).toEqual({
      sku: "T-1",
      options: "المقاس: M",
      price: "129.5",
      compareAtPrice: "",
      stock: "4",
    })
  })
})
