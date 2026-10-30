// ---------------------------------------------------------------------------
// شكل الإعدادات كما تُكتب في src/data/shipping.ts وsrc/data/coupons.ts (المبالغ بالريال)
// ---------------------------------------------------------------------------

export type ShippingCityInput = {
  name: string
  /** سعر التوصيل العادي بالريال */
  fee: number
  /** مدة التوصيل العادي بأيام العمل: [الأقل، الأكثر] */
  days: [number, number]
  /** هل يتوفر التوصيل السريع في هذه المدينة؟ */
  express?: boolean
}

export type ShippingInput = {
  /** الشحن العادي مجاني عندما يصل مجموع الطلب بعد الخصم إلى هذا المبلغ */
  freeShippingFrom: number
  cities: ShippingCityInput[]
  /** التوصيل السريع: مبلغ يُضاف إلى سعر التوصيل العادي */
  express: { extraFee: number; label: string }
}

export type CouponInput = {
  /** الرمز بأحرف إنجليزية كبيرة وأرقام، مثل WELCOME10 */
  code: string
  /** percent: نسبة مئوية، fixed: مبلغ ثابت بالريال، free-shipping: شحن مجاني */
  type: "percent" | "fixed" | "free-shipping"
  /** النسبة أو المبلغ. لا يُكتب للشحن المجاني */
  value?: number
  /** أقل مجموع للطلب بالريال حتى يعمل الكوبون */
  minSubtotal?: number
  /** أقصى خصم بالريال للكوبونات النسبية */
  maxDiscount?: number
  description: string
}

// ---------------------------------------------------------------------------
// الشكل الموحّد بعد التحقق (المبالغ بأصغر وحدة: هللة)
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
  /** النسبة المئوية، أو المبلغ بأصغر وحدة */
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
  /** null: لم تُختر المدينة بعد */
  shipping: number | null
  total: number
  /** المبلغ الناقص للحصول على شحن مجاني، أو null إن لم يعد ذلك ممكناً أو كان مجانياً */
  freeShippingRemaining: number | null
}
