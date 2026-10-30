import type {
  CheckoutConfig,
  Coupon,
  OrderTotals,
  ShippingCity,
  ShippingMethod,
} from "./types"

/** يحوّل الأرقام العربية والفارسية إلى 0-9، فيقبل الحقل ما يكتبه الزائر بأي لوحة مفاتيح. */
export function normalizeDigits(value: string) {
  return value
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x660))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x6f0))
}

/** يبحث عن كوبون برمزه، دون اعتبار لحالة الأحرف أو المسافات. */
export function findCoupon(config: CheckoutConfig, code: string) {
  const wanted = normalizeDigits(code).trim().toUpperCase()
  return config.coupons.find((coupon) => coupon.code === wanted)
}

/** سبب عدم انطباق الكوبون على الطلب، أو null إن كان صالحاً. */
export function couponProblem(coupon: Coupon, subtotal: number) {
  return subtotal < coupon.minSubtotal ? "minimum" : null
}

function couponDiscount(coupon: Coupon | null, subtotal: number) {
  if (!coupon || couponProblem(coupon, subtotal)) return 0
  if (coupon.type === "fixed") return Math.min(coupon.value, subtotal)
  if (coupon.type === "percent") {
    const discount = Math.round((subtotal * coupon.value) / 100)
    return Math.min(discount, coupon.maxDiscount ?? discount)
  }
  return 0
}

/** سعر التوصيل للمدينة والطريقة، قبل الشحن المجاني. */
export function shippingFee(
  city: ShippingCity,
  method: ShippingMethod,
  config: CheckoutConfig
) {
  return city.fee + (method === "express" ? config.express.extraFee : 0)
}

/**
 * مبالغ الطلب: المجموع، والخصم، والشحن، والإجمالي.
 * الشحن العادي مجاني فوق الحد المكتوب في الإعدادات، أو بكوبون الشحن المجاني.
 */
export function calculateTotals({
  subtotal,
  city,
  method,
  coupon,
  config,
}: {
  subtotal: number
  city: ShippingCity | undefined
  method: ShippingMethod
  coupon: Coupon | null
  config: CheckoutConfig
}): OrderTotals {
  const discount = couponDiscount(coupon, subtotal)
  const afterDiscount = subtotal - discount
  const freeByCoupon =
    coupon?.type === "free-shipping" && !couponProblem(coupon, subtotal)
  const freeByAmount =
    method === "standard" && afterDiscount >= config.freeShippingFrom

  let shipping: number | null = null
  if (freeByCoupon || freeByAmount) shipping = 0
  else if (city) shipping = shippingFee(city, method, config)

  return {
    subtotal,
    discount,
    shipping,
    total: afterDiscount + (shipping ?? 0),
    freeShippingRemaining:
      method === "standard" && !freeByCoupon && !freeByAmount
        ? config.freeShippingFrom - afterDiscount
        : null,
  }
}
