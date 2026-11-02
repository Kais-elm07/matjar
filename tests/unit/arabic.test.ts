import { describe, expect, it } from "vitest"

import { PIECE_FORMS, PRODUCT_FORMS, pluralize } from "@/lib/arabic-plural"
import {
  decodeSlug,
  normalizeForSearch,
  slugify,
  toSearchTerms,
} from "@/lib/catalog/arabic"
import {
  getColorHex,
  isColorOption,
  sortOptionValues,
} from "@/lib/catalog/options"
import { deliveryTime } from "@/lib/checkout/delivery"

describe("normalizeForSearch", () => {
  it("يزيل التشكيل والتطويل", () => {
    expect(normalizeForSearch("أَحْمَر")).toBe("احمر")
    expect(normalizeForSearch("مـتـجـر")).toBe("متجر")
  })

  it("يوحّد أشكال الألف والياء والتاء المربوطة والهمزات", () => {
    expect(normalizeForSearch("إبريق")).toBe("ابريق")
    expect(normalizeForSearch("آلة")).toBe("اله")
    expect(normalizeForSearch("مستشفى")).toBe("مستشفي")
    expect(normalizeForSearch("مؤتمر")).toBe("موتمر")
    expect(normalizeForSearch("شاطئ")).toBe("شاطي")
  })

  it("يحوّل الأرقام العربية ويصغّر الحروف الإنجليزية ويستبدل الرموز بمسافات", () => {
    expect(normalizeForSearch("شاحن ٦٥ واط")).toBe("شاحن 65 واط")
    expect(normalizeForSearch("USB-C")).toBe("usb c")
    expect(normalizeForSearch("  قميص،  أزرق!  ")).toBe("قميص ازرق")
  })
})

describe("toSearchTerms", () => {
  it("يحذف ال التعريف من الكلمات الطويلة", () => {
    expect(toSearchTerms("القميص الأزرق")).toEqual(["قميص", "ازرق"])
  })

  it("يُبقي الكلمات القصيرة التي تبدأ بـ ال كما هي", () => {
    expect(toSearchTerms("الم")).toEqual(["الم"])
  })

  it("يحذف التكرار ويكتفي بست كلمات", () => {
    expect(toSearchTerms("ساعة ساعه")).toEqual(["ساعه"])
    expect(toSearchTerms("أ ب ت ث ج ح خ د")).toHaveLength(6)
  })

  it("يعيد قائمة فارغة لنص بلا حروف", () => {
    expect(toSearchTerms("  ؟!  ")).toEqual([])
  })
})

describe("الروابط", () => {
  it("ينشئ رابطاً مقروءاً من الاسم", () => {
    expect(slugify("قميص قطني أزرق")).toBe("قميص-قطني-أزرق")
    expect(slugify("  Hello, World!! ")).toBe("hello-world")
  })

  it("يفك ترميز الروابط العربية ويترك الترميز التالف كما هو", () => {
    expect(decodeSlug("%D9%82%D9%85%D9%8A%D8%B5")).toBe("قميص")
    expect(decodeSlug("%E0%A4%A")).toBe("%E0%A4%A")
    expect(decodeSlug("classic-shirt")).toBe("classic-shirt")
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
  ])("%i ← %s", (count, expected) => {
    expect(pluralize(count, PRODUCT_FORMS)).toBe(expected)
  })

  it("يصرّف القطع كذلك", () => {
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

  it.each(cases)("%j ← %s", (days, expected) => {
    expect(deliveryTime(days)).toBe(expected)
  })
})

describe("خيارات المتغيرات", () => {
  it("يتعرف على خيار اللون بأشكال كتابته", () => {
    expect(isColorOption("اللون")).toBe(true)
    expect(isColorOption("الألوان")).toBe(true)
    expect(isColorOption("Color")).toBe(true)
    expect(isColorOption("المقاس")).toBe(false)
  })

  it("يعطي درجة اللون المعروف أو null", () => {
    expect(getColorHex("أزرق")).toBe("#2563eb")
    expect(getColorHex("ازرق")).toBe("#2563eb")
    expect(getColorHex("#abc")).toBe("#abc")
    expect(getColorHex("قوس قزح")).toBeNull()
  })

  it("يرتب المقاسات من الأصغر والأرقام تصاعدياً قبل بقية القيم", () => {
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
