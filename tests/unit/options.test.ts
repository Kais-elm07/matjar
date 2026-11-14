import { describe, expect, it } from "vitest"

import {
  formatOptions,
  getColorHex,
  isColorOption,
  sortOptionValues,
} from "@/modules/catalog/options"

describe("variant options", () => {
  it("recognizes the color option in its different spellings", () => {
    expect(isColorOption("اللون")).toBe(true)
    expect(isColorOption("الألوان")).toBe(true)
    expect(isColorOption("Color")).toBe(true)
    expect(isColorOption("المقاس")).toBe(false)
  })

  it("returns the shade of a known color, or null", () => {
    expect(getColorHex("أزرق")).toBe("#2563eb")
    expect(getColorHex("ازرق")).toBe("#2563eb")
    expect(getColorHex("#abc")).toBe("#abc")
    expect(getColorHex("قوس قزح")).toBeNull()
  })

  it("sorts sizes from the smallest and numbers in ascending order, before the other values", () => {
    expect(sortOptionValues(["XL", "S", "L", "M"])).toEqual([
      "S",
      "M",
      "L",
      "XL",
    ])
    expect(sortOptionValues(["42", "40", "41"])).toEqual(["40", "41", "42"])
    expect(sortOptionValues(["أزرق", "M", "أبيض"])).toEqual([
      "M",
      "أبيض",
      "أزرق",
    ])
  })

  it("writes a variant's options as one line of text", () => {
    expect(formatOptions({ المقاس: "M", اللون: "أزرق" })).toBe(
      "المقاس: M، اللون: أزرق"
    )
    expect(formatOptions({})).toBe("")
  })
})
