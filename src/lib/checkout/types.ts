// ---------------------------------------------------------------------------
// Shape of the settings as written in src/data/shipping.ts and src/data/coupons.ts (amounts in riyals)
// ---------------------------------------------------------------------------

export type ShippingCityInput = {
  name: string
  /** Standard delivery price in riyals */
  fee: number
  /** Standard delivery time in working days: [min, max] */
  days: [number, number]
  /** Whether express delivery is available in this city */
  express?: boolean
}

export type ShippingInput = {
  /** Standard shipping is free when the order subtotal after discount reaches this amount */
  freeShippingFrom: number
  cities: ShippingCityInput[]
  /** Express delivery: an amount added to the standard delivery price */
  express: { extraFee: number; label: string }
}

export type CouponInput = {
  /** The code in uppercase English letters and digits, such as WELCOME10 */
  code: string
  /** percent: a percentage, fixed: a fixed amount in riyals, free-shipping: free shipping */
  type: "percent" | "fixed" | "free-shipping"
  /** The percentage or the amount. Not written for free shipping */
  value?: number
  /** Minimum order subtotal in riyals for the coupon to work */
  minSubtotal?: number
  /** Maximum discount in riyals for percentage coupons */
  maxDiscount?: number
  description: string
}

// ---------------------------------------------------------------------------
// The unified shape after validation (amounts in the smallest unit: halala)
// ---------------------------------------------------------------------------

export type ShippingCity = {
  name: string
  fee: number
  days: [number, number]
  express: boolean
}

export type Coupon = {
  code: string
  type: CouponInput["type"]
  /** The percentage, or the amount in the smallest unit */
  value: number
  minSubtotal: number
  maxDiscount: number | null
  description: string
}

export type CheckoutConfig = {
  freeShippingFrom: number
  cities: ShippingCity[]
  express: { extraFee: number; label: string }
  coupons: Coupon[]
}

export type ShippingMethod = "standard" | "express"

export type OrderTotals = {
  subtotal: number
  discount: number
  /** null: no city chosen yet */
  shipping: number | null
  total: number
  /** Amount left to reach free shipping, or null if that is no longer possible or it is already free */
  freeShippingRemaining: number | null
}
