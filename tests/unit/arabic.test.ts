import { describe, expect, it } from "vitest"

import { toWesternDigits } from "@/lib/arabic-digits"
import { PIECE_FORMS, PRODUCT_FORMS, pluralize } from "@/lib/arabic-plural"
import {
  getColorHex,
  isColorOption,
  sortOptionValues,
} from "@/lib/catalog/options"
import { deliveryTime } from "@/lib/checkout/delivery"
import { normalizeForSearch, toSearchTerms } from "@/lib/search/normalize"

describe("normalizeForSearch", () => {
  it("removes diacritics and tatweel", () => {
    expect(normalizeForSearch("أَحْمَر")).toBe("احمر")
    expect(normalizeForSearch("مـتـجـر")).toBe("متجر")
  })

  it("unifies the forms of alef, yaa, taa marbuta and hamza", () => {
    expect(normalizeForSearch("إبريق")).toBe("ابريق")
    expect(normalizeForSearch("آلة")).toBe("اله")
    expect(normalizeForSearch("مستشفى")).toBe("مستشفي")
    expect(normalizeForSearch("مؤتمر")).toBe("موتمر")
    expect(normalizeForSearch("شاطئ")).toBe("شاطي")
  })

  it("converts Arabic-Indic digits, lowercases English letters and replaces symbols with spaces", () => {
    expect(normalizeForSearch("شاحن ٦٥ واط")).toBe("شاحن 65 واط")
    expect(normalizeForSearch("USB-C")).toBe("usb c")
    expect(normalizeForSearch("  قميص،  أزرق!  ")).toBe("قميص ازرق")
  })
})

describe("toSearchTerms", () => {
  it("removes the definite article (ال) from long words", () => {
    expect(toSearchTerms("القميص الأزرق")).toEqual(["قميص", "ازرق"])
  })

  it("keeps short words that start with ال as they are", () => {
    expect(toSearchTerms("الم")).toEqual(["الم"])
  })

  it("removes duplicates and keeps at most six words", () => {
    expect(toSearchTerms("ساعة ساعه")).toEqual(["ساعه"])
    expect(toSearchTerms("أ ب ت ث ج ح خ د")).toHaveLength(6)
  })

  it("returns an empty list for text without letters", () => {
    expect(toSearchTerms("  ؟!  ")).toEqual([])
  })
})

describe("letters from different keyboard layouts", () => {
  it("unifies the Persian yaa and kaf with the Arabic ones", () => {
    expect(normalizeForSearch("کیس")).toBe(normalizeForSearch("كيس"))
    expect(normalizeForSearch("ساعی")).toBe("ساعي")
  })

  it("converts presentation forms copied from PDF files to regular letters", () => {
    // "ﻗﻤﻴﺺ" in Arabic presentation forms
    expect(normalizeForSearch("ﻗﻤﻴﺺ")).toBe("قميص")
  })

  it("converts Arabic-Indic and Persian digits to 0-9", () => {
    expect(toWesternDigits("٠٥٠١٢٣٤٥٦٧")).toBe("0501234567")
    expect(toWesternDigits("۰۵۰۱")).toBe("0501")
    expect(toWesternDigits("رقم 12")).toBe("رقم 12")
  })
})

describe("pluralize", () => {
  it.each([
    [0, "لا توجد منتجات"],
    [1, "منتج واحد"],
    [2, "منتجان"],
    [3, "3 منتجات"],
    [10, "10 منتجات"],
    [11, "11 منتجاً"],
    [99, "99 منتجاً"],
    [100, "100 منتج"],
    [103, "103 منتجات"],
  ])("%i → %s", (count, expected) => {
    expect(pluralize(count, PRODUCT_FORMS)).toBe(expected)
  })

  it("inflects pieces the same way", () => {
    expect(pluralize(1, PIECE_FORMS)).toBe("قطعة واحدة")
    expect(pluralize(2, PIECE_FORMS)).toBe("قطعتان")
    expect(pluralize(5, PIECE_FORMS)).toBe("5 قطع")
    expect(pluralize(12, PIECE_FORMS)).toBe("12 قطعة")
  })
})

describe("deliveryTime", () => {
  const cases: [[number, number], string][] = [
    [[1, 2], "خلال يوم إلى يومين"],
    [[1, 1], "خلال يوم عمل واحد"],
    [[0, 0], "خلال يوم عمل واحد"],
    [[2, 2], "خلال يومي عمل"],
    [[3, 3], "خلال 3 أيام عمل"],
    [[2, 4], "خلال 2 إلى 4 أيام عمل"],
    [[4, 7], "خلال 4 إلى 7 أيام عمل"],
    [[7, 14], "خلال 7 إلى 14 يوم عمل"],
  ]

  it.each(cases)("%j → %s", (days, expected) => {
    expect(deliveryTime(days)).toBe(expected)
  })
})

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
})
