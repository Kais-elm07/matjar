import { describe, expect, it } from "vitest"

import type { VariantOptions } from "@/lib/catalog/options"
import type { Variant } from "@/lib/catalog/types"
import {
  defaultVariant,
  findVariant,
  imageIndexForOptions,
  optionState,
  selectOption,
  type PurchasableProduct,
} from "@/lib/catalog/variant-selection"
import { BRAND_TONE } from "@/lib/tone"

/** The look of a cut-out photo, which these rules don't depend on */
const look = { tone: BRAND_TONE, cutout: true }

const variant = (
  sku: string,
  options: VariantOptions,
  stock: number
): Variant => ({ sku, options, price: 10000, compareAtPrice: null, stock })

/** A shirt in two sizes and two colors: small white, medium white (sold out) and medium blue. */
const shirt: PurchasableProduct = {
  slug: "shirt",
  name: "قميص",
  price: 10000,
  compareAtPrice: null,
  optionGroups: [
    { name: "المقاس", values: ["S", "M"], isColor: false },
    { name: "اللون", values: ["أبيض", "أزرق"], isColor: true },
  ],
  variants: [
    variant("S-WHITE", { المقاس: "S", اللون: "أبيض" }, 2),
    variant("M-WHITE", { المقاس: "M", اللون: "أبيض" }, 0),
    variant("M-BLUE", { المقاس: "M", اللون: "أزرق" }, 5),
  ],
  images: [
    { src: "/images/white", alt: "قميص أبيض", color: "أبيض", ...look },
    { src: "/images/blue", alt: "قميص أزرق", color: "أزرق", ...look },
  ],
}

describe("choosing a variant", () => {
  it("opens with the first variant in stock", () => {
    expect(defaultVariant(shirt).sku).toBe("S-WHITE")
  })

  it("finds the variant that has exactly the chosen options", () => {
    expect(findVariant(shirt, { المقاس: "M", اللون: "أزرق" })?.sku).toBe(
      "M-BLUE"
    )
    expect(findVariant(shirt, { المقاس: "S", اللون: "أزرق" })).toBeUndefined()
  })

  it("marks each value as available, sold out or unavailable with the other choices", () => {
    const smallWhite = { المقاس: "S", اللون: "أبيض" }
    expect(optionState(shirt, smallWhite, "المقاس", "S")).toBe("available")
    expect(optionState(shirt, smallWhite, "المقاس", "M")).toBe("sold-out")
    expect(optionState(shirt, smallWhite, "اللون", "أزرق")).toBe("unavailable")
  })

  it("moves to the closest variant in stock when the combination does not exist", () => {
    // There is no small blue shirt, so choosing blue picks the medium blue one
    expect(
      selectOption(shirt, { المقاس: "S", اللون: "أبيض" }, "اللون", "أزرق")
    ).toEqual({ المقاس: "M", اللون: "أزرق" })
    expect(
      selectOption(shirt, { المقاس: "M", اللون: "أزرق" }, "اللون", "أبيض")
    ).toEqual({ المقاس: "M", اللون: "أبيض" })
  })

  it("shows the chosen color's photo, and keeps the current one otherwise", () => {
    expect(imageIndexForOptions(shirt, { اللون: "أزرق" }, 0)).toBe(1)
    expect(imageIndexForOptions(shirt, { اللون: "أحمر" }, 1)).toBe(1)
  })
})
