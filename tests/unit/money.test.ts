import { describe, expect, it } from "vitest"

import {
  discountPercent,
  fitsCurrency,
  formatPrice,
  toMajorUnits,
  toMinorUnits,
  toSchemaPrice,
} from "@/lib/catalog/money"

// A non-breaking space separates the number and the currency symbol, so they never split across two lines
const SAR = `${String.fromCharCode(0xa0)}ر.س`

describe("formatPrice", () => {
  it("shows riyals without decimals when there are no halalas", () => {
    expect(formatPrice(12900)).toBe(`129${SAR}`)
  })

  it("separates thousands with a comma and shows halalas when there are any", () => {
    expect(formatPrice(129950)).toBe(`1,299.50${SAR}`)
    expect(formatPrice(123456789)).toBe(`1,234,567.89${SAR}`)
  })

  it("shows zero and negative amounts", () => {
    expect(formatPrice(0)).toBe(`0${SAR}`)
    expect(formatPrice(-2500)).toBe(`-25${SAR}`)
  })

  it("rounds fractions of a halala", () => {
    expect(formatPrice(1999.6)).toBe(`20${SAR}`)
  })

  it("shows zero for an invalid amount and never writes -0", () => {
    expect(formatPrice(Number.NaN)).toBe(`0${SAR}`)
    expect(formatPrice(Number.POSITIVE_INFINITY)).toBe(`0${SAR}`)
    expect(formatPrice(-0.4)).toBe(`0${SAR}`)
  })
})

describe("unit conversion", () => {
  it("converts riyals to halalas without floating-point errors", () => {
    expect(toMinorUnits(129.5)).toBe(12950)
    expect(toMinorUnits(19.99)).toBe(1999)
    expect(toMinorUnits(0.1 + 0.2)).toBe(30)
  })

  it("accepts a price with at most two decimal places", () => {
    expect(fitsCurrency(129)).toBe(true)
    expect(fitsCurrency(129.5)).toBe(true)
    expect(fitsCurrency(19.99)).toBe(true)
    expect(fitsCurrency(129.555)).toBe(false)
  })

  it("converts halalas to riyals", () => {
    expect(toMajorUnits(12950)).toBe(129.5)
  })

  it("writes the price in the schema.org format with two decimal places", () => {
    expect(toSchemaPrice(12950)).toBe("129.50")
    expect(toSchemaPrice(12900)).toBe("129.00")
  })
})

describe("discountPercent", () => {
  it("computes the rounded discount percentage", () => {
    expect(discountPercent(8000, 10000)).toBe(20)
    expect(discountPercent(39900, 49900)).toBe(20)
  })

  it("does not count it as a discount unless the previous price is higher", () => {
    expect(discountPercent(10000, null)).toBeNull()
    expect(discountPercent(10000, undefined)).toBeNull()
    expect(discountPercent(10000, 10000)).toBeNull()
    expect(discountPercent(10000, 9000)).toBeNull()
  })
})
