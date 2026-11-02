import { describe, expect, it } from "vitest"

import {
  discountPercent,
  formatPrice,
  toMajorUnits,
  toMinorUnits,
  toSchemaPrice,
} from "@/lib/catalog/money"

// بين الرقم ورمز العملة مسافة غير قابلة للكسر، حتى لا ينفصلا على سطرين
const SAR = `${String.fromCharCode(0xa0)}ر.س`

describe("formatPrice", () => {
  it("يعرض الريالات دون كسور عندما لا توجد هللات", () => {
    expect(formatPrice(12900)).toBe(`129${SAR}`)
  })

  it("يفصل الآلاف بفاصلة ويعرض الهللات عند وجودها", () => {
    expect(formatPrice(129950)).toBe(`1,299.50${SAR}`)
    expect(formatPrice(123456789)).toBe(`1,234,567.89${SAR}`)
  })

  it("يعرض الصفر والمبالغ السالبة", () => {
    expect(formatPrice(0)).toBe(`0${SAR}`)
    expect(formatPrice(-2500)).toBe(`-25${SAR}`)
  })

  it("يقرّب أجزاء الهللة", () => {
    expect(formatPrice(1999.6)).toBe(`20${SAR}`)
  })
})

describe("تحويل الوحدات", () => {
  it("يحوّل الريال إلى هللات دون أخطاء الكسور العشرية", () => {
    expect(toMinorUnits(129.5)).toBe(12950)
    expect(toMinorUnits(19.99)).toBe(1999)
    expect(toMinorUnits(0.1 + 0.2)).toBe(30)
  })

  it("يحوّل الهللات إلى ريال", () => {
    expect(toMajorUnits(12950)).toBe(129.5)
  })

  it("يكتب السعر بصيغة schema.org بخانتين عشريتين", () => {
    expect(toSchemaPrice(12950)).toBe("129.50")
    expect(toSchemaPrice(12900)).toBe("129.00")
  })
})

describe("discountPercent", () => {
  it("يحسب نسبة الخصم مقرّبة", () => {
    expect(discountPercent(8000, 10000)).toBe(20)
    expect(discountPercent(39900, 49900)).toBe(20)
  })

  it("لا يعدّه خصماً إن لم يكن السعر السابق أعلى", () => {
    expect(discountPercent(10000, null)).toBeNull()
    expect(discountPercent(10000, undefined)).toBeNull()
    expect(discountPercent(10000, 10000)).toBeNull()
    expect(discountPercent(10000, 9000)).toBeNull()
  })
})
