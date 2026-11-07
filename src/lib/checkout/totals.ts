import { toWesternDigits } from "@/lib/arabic-digits"
import type {
  Coupon,
  OrderTotals,
  ShippingCity,
  ShippingConfig,
  ShippingMethod,
} from "@/lib/checkout/types"
import { formatPrice } from "@/lib/money"

/** Sum of the lines' prices in the smallest unit. */
export function cartSubtotal(lines: { price: number; quantity: number }[]) {
  return lines.reduce((sum, line) => sum + line.price * line.quantity, 0)
}

/** Finds a coupon by its code, ignoring letter case, spaces and Arabic-Indic digits. */
export function findCoupon(coupons: Coupon[], code: string) {
  const wanted = toWesternDigits(code).trim().toUpperCase()
  return coupons.find((coupon) => coupon.code === wanted)
}

/** Why the coupon does not apply to the order, or null if it is valid. */
export function couponProblem(coupon: Coupon, subtotal: number) {
  return subtotal < coupon.minSubtotal ? "minimum" : null
}

/** What the visitor reads when the subtotal is below the coupon's minimum. */
export function couponMinimumMessage(coupon: Coupon) {
  return `هذا الكوبون للطلبات من ${formatPrice(coupon.minSubtotal)} فأكثر`
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

/** Delivery price for the city and method, before free shipping. */
export function shippingFee(
  city: ShippingCity,
  method: ShippingMethod,
  config: ShippingConfig
) {
  return city.fee + (method === "express" ? config.express.extraFee : 0)
}

/**
 * The order amounts: subtotal, discount, shipping and total.
 * Standard shipping is free above the threshold set in the settings, or with a free-shipping coupon.
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
  config: ShippingConfig
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
