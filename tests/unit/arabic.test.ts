import { describe, expect, it } from "vitest"

import { toWesternDigits } from "@/lib/arabic-digits"
import { PIECE_FORMS, PRODUCT_FORMS, pluralize } from "@/lib/arabic-plural"
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
