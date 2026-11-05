import { describe, expect, it } from "vitest"

import { buildOrder } from "@/lib/checkout/order"
import {
  checkoutSchema,
  normalizePhone,
  type CheckoutValues,
} from "@/lib/checkout/schema"
import {
  calculateTotals,
  couponProblem,
  findCoupon,
  shippingFee,
} from "@/lib/checkout/totals"
import type {
  CheckoutConfig,
  Coupon,
  ShippingCity,
  ShippingMethod,
} from "@/lib/checkout/types"

// Amounts here are in halalas, as the functions compute them: 30000 means 300 SAR
const riyadh: ShippingCity = {
  name: "الرياض",
  fee: 2500,
  days: [1, 2],
  express: true,
}
const abha: ShippingCity = {
  name: "أبها",
  fee: 3500,
  days: [3, 5],
  express: false,
}

const coupon = (
  fields: Partial<Coupon> & Pick<Coupon, "code" | "type">
): Coupon => ({
  value: 0,
  minSubtotal: 0,
  maxDiscount: null,
  description: "",
  ...fields,
})
const WELCOME10 = coupon({
  code: "WELCOME10",
  type: "percent",
  value: 10,
  maxDiscount: 10000,
})
const SAVE50 = coupon({
  code: "SAVE50",
  type: "fixed",
  value: 5000,
  minSubtotal: 40000,
})
const FREESHIP = coupon({ code: "FREESHIP", type: "free-shipping" })

const config: CheckoutConfig = {
  freeShippingFrom: 30000,
  cities: [riyadh, abha],
  express: { extraFee: 2000, label: "في اليوم التالي" },
  coupons: [WELCOME10, SAVE50, FREESHIP],
}

function totals(
  subtotal: number,
  {
    city,
    method = "standard",
    coupon = null,
  }: {
    city?: ShippingCity
    method?: ShippingMethod
    coupon?: Coupon | null
  } = {}
) {
  return calculateTotals({ subtotal, city, method, coupon, config })
}

describe("numbers and coupons", () => {
  it("finds the coupon regardless of letter case, spaces and Arabic-Indic digits", () => {
    expect(findCoupon(config, " welcome10 ")).toBe(WELCOME10)
    expect(findCoupon(config, "WELCOME١٠")).toBe(WELCOME10)
    expect(findCoupon(config, "NOPE")).toBeUndefined()
  })

  it("rejects the coupon below the minimum order", () => {
    expect(couponProblem(SAVE50, 39999)).toBe("minimum")
    expect(couponProblem(SAVE50, 40000)).toBeNull()
  })
})

describe("calculateTotals", () => {
  it("does not calculate shipping before a city is chosen", () => {
    expect(totals(20000)).toEqual({
      subtotal: 20000,
      discount: 0,
      shipping: null,
      total: 20000,
      freeShippingRemaining: 10000,
    })
  })

  it("adds the city's rate below the free shipping threshold", () => {
    expect(totals(20000, { city: riyadh })).toMatchObject({
      shipping: 2500,
      total: 22500,
      freeShippingRemaining: 10000,
    })
  })

  it("makes standard shipping free once the threshold is reached", () => {
    expect(totals(30000, { city: riyadh })).toMatchObject({
      shipping: 0,
      total: 30000,
      freeShippingRemaining: null,
    })
  })

  it("applies the free shipping threshold after the discount", () => {
    expect(totals(32000, { city: riyadh, coupon: WELCOME10 })).toEqual({
      subtotal: 32000,
      discount: 3200,
      shipping: 2500,
      total: 31300,
      freeShippingRemaining: 1200,
    })
  })

  it("caps a percentage discount at its maximum", () => {
    // 1,327 SAR with WELCOME10 and express delivery: 1,327 − 100 + 25 + 20 = 1,272 SAR
    expect(
      totals(132700, { city: riyadh, method: "express", coupon: WELCOME10 })
    ).toMatchObject({ discount: 10000, shipping: 4500, total: 127200 })
  })

  it("requires the minimum for a fixed discount and never discounts more than the subtotal", () => {
    expect(totals(39999, { city: riyadh, coupon: SAVE50 }).discount).toBe(0)
    expect(totals(40000, { city: riyadh, coupon: SAVE50 })).toMatchObject({
      discount: 5000,
      shipping: 0,
      total: 35000,
    })
    const big = coupon({ code: "BIG", type: "fixed", value: 5000 })
    expect(totals(3000, { city: riyadh, coupon: big })).toMatchObject({
      discount: 3000,
      shipping: 2500,
      total: 2500,
    })
  })

  it("applies the free shipping coupon to express delivery too", () => {
    expect(
      totals(10000, { city: riyadh, method: "express", coupon: FREESHIP })
    ).toMatchObject({
      discount: 0,
      shipping: 0,
      total: 10000,
      freeShippingRemaining: null,
    })
  })

  it("never makes express delivery free because of the order value", () => {
    expect(totals(50000, { city: riyadh, method: "express" })).toMatchObject({
      shipping: 4500,
      total: 54500,
      freeShippingRemaining: null,
    })
    expect(shippingFee(riyadh, "express", config)).toBe(4500)
  })
})

describe("normalizePhone", () => {
  it.each([
    ["+966 50 123 4567", "0501234567"],
    ["00966501234567", "0501234567"],
    ["966501234567", "0501234567"],
    ["+966 0501234567", "0501234567"],
    ["009660501234567", "0501234567"],
    ["٠٥٠١٢٣٤٥٦٧", "0501234567"],
    ["(050) 123-4567", "0501234567"],
  ])("%s → %s", (input, expected) => {
    expect(normalizePhone(input)).toBe(expected)
  })
})

describe("checkoutSchema", () => {
  const schema = checkoutSchema([riyadh, abha])
  const valid = {
    fullName: "  أحمد محمد  ",
    phone: "٠٥٠١٢٣٤٥٦٧",
    email: "",
    city: "الرياض",
    district: "النرجس",
    street: "شارع الملك فهد 12",
    notes: "",
    shippingMethod: "express",
  }

  /** The error message for each field, as it appears under the field in the form. */
  function errorsFor(input: Record<string, unknown>) {
    const result = schema.safeParse(input)
    if (result.success) return {}
    return Object.fromEntries(
      result.error.issues.map((issue) => [issue.path.join("."), issue.message])
    )
  }

  it("accepts a valid form and normalizes the phone number", () => {
    const result = schema.safeParse(valid)
    expect(result.success).toBe(true)
    expect(result.data).toMatchObject({
      fullName: "أحمد محمد",
      phone: "0501234567",
    })
  })

  it("shows an Arabic message under every invalid field", () => {
    expect(
      errorsFor({
        ...valid,
        fullName: "أح",
        phone: "12345",
        email: "abc",
        city: "دبي",
        district: "",
        street: "شارع",
        shippingMethod: "standard",
      })
    ).toEqual({
      fullName: "اكتب اسمك الكامل",
      phone: "رقم الجوال يبدأ بـ 05 ويتكون من 10 أرقام",
      email: "البريد الإلكتروني غير صحيح",
      city: "اختر مدينتك",
      district: "اكتب اسم الحي",
      street: "اكتب اسم الشارع ورقم المبنى",
    })
  })

  it("rejects express delivery in a city that doesn't offer it", () => {
    expect(errorsFor({ ...valid, city: "أبها" })).toEqual({
      shippingMethod: "التوصيل السريع غير متاح في هذه المدينة",
    })
  })
})

describe("buildOrder", () => {
  const values: CheckoutValues = {
    fullName: "أحمد محمد",
    phone: "0501234567",
    email: "",
    city: "الرياض",
    district: "النرجس",
    street: "شارع الملك فهد 12",
    notes: "",
    shippingMethod: "standard",
  }
  const line = {
    sku: "SHIRT-01",
    slug: "classic-cotton-shirt",
    name: "قميص قطني كلاسيكي",
    image: null,
    options: { المقاس: "M" },
    price: 12900,
    compareAtPrice: null,
    stock: 5,
    quantity: 2,
  }
  const now = new Date("2026-11-04T10:00:00Z")

  it("builds the order with the amounts the visitor saw before confirming", () => {
    const order = buildOrder({
      values,
      lines: [line],
      coupon: WELCOME10,
      config,
      now,
    })
    expect(order).not.toBeNull()
    expect(order?.number).toMatch(/^261104-\d{4}$/)
    expect(order?.customer).toEqual({
      name: "أحمد محمد",
      phone: "0501234567",
      city: "الرياض",
      address: "النرجس، شارع الملك فهد 12",
    })
    expect(order?.couponCode).toBe("WELCOME10")
    expect(order?.shipping).toEqual({
      label: "توصيل عادي",
      days: "خلال يوم إلى يومين",
    })
    expect(order?.totals).toEqual(
      totals(25800, { city: riyadh, coupon: WELCOME10 })
    )
  })

  it("does not record a coupon that no longer applies, and rejects a city outside the shipping cities", () => {
    expect(
      buildOrder({ values, lines: [line], coupon: SAVE50, config, now })
        ?.couponCode
    ).toBeNull()
    expect(
      buildOrder({
        values: { ...values, city: "دبي" },
        lines: [line],
        coupon: null,
        config,
        now,
      })
    ).toBeNull()
  })
})
