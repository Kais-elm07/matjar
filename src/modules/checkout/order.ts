import type { VariantOptions } from "@/modules/catalog/options"
import type { CardImage } from "@/modules/catalog/types"
import { deliveryTime } from "@/modules/checkout/delivery"
import type { CheckoutValues } from "@/modules/checkout/schema"
import {
  calculateTotals,
  cartSubtotal,
  couponProblem,
} from "@/modules/checkout/totals"
import type {
  Coupon,
  ShippingConfig,
  ShippingMethod,
} from "@/modules/checkout/types"
import { storeToday } from "@/lib/dates"

/** One product of an order, with the catalog's name, photo and price when it was ordered. */
export type OrderLine = {
  sku: string
  slug: string
  name: string
  options: VariantOptions
  quantity: number
  price: number
  image: CardImage | null
}

/** An order before it is saved: what the server writes to the database. Amounts are in halalas. */
export type OrderDraft = {
  customerName: string
  phone: string
  email: string | null
  city: string
  address: string
  notes: string | null
  shippingMethod: ShippingMethod
  deliveryTime: string
  couponCode: string | null
  subtotal: number
  discount: number
  shippingFee: number
  total: number
  lines: OrderLine[]
}

/** A saved order, as its confirmation page shows it. */
export type PlacedOrder = OrderDraft & { id: string; number: string }

const SHIPPING_LABELS: Record<ShippingMethod, string> = {
  standard: "توصيل عادي",
  express: "توصيل سريع",
}

/** The shipping method's name, as the checkout shows it. */
export const shippingLabel = (method: ShippingMethod) => SHIPPING_LABELS[method]

/**
 * The order from the checked form values, the lines the server priced, and the coupon, with the same
 * amounts as the checkout's summary. null if the city is not among the shipping cities.
 */
export function buildOrder({
  values,
  lines,
  coupon,
  config,
}: {
  values: CheckoutValues
  lines: OrderLine[]
  coupon: Coupon | null
  config: ShippingConfig
}): OrderDraft | null {
  const city = config.cities.find((item) => item.name === values.city)
  if (!city) return null
  const subtotal = cartSubtotal(lines)
  const totals = calculateTotals({
    subtotal,
    city,
    method: values.shippingMethod,
    coupon,
    config,
  })
  return {
    customerName: values.fullName,
    phone: values.phone,
    email: values.email || null,
    city: values.city,
    address: `${values.district}، ${values.street}`,
    notes: values.notes || null,
    shippingMethod: values.shippingMethod,
    deliveryTime:
      values.shippingMethod === "express"
        ? config.express.deliveryTime
        : deliveryTime(city.days),
    // A coupon that no longer applies (subtotal below its minimum) is not recorded in the order
    couponCode: coupon && !couponProblem(coupon, subtotal) ? coupon.code : null,
    subtotal,
    discount: totals.discount,
    shippingFee: totals.shipping ?? 0,
    total: totals.total,
    lines,
  }
}

/**
 * The short number the customer quotes: the date in store time and four digits, such as 261107-4827.
 * `random` is a whole number from 0 to 9999; the database refuses a number that is already taken.
 */
export function orderNumber(now: Date, random: number) {
  const day = storeToday(now.getTime()).slice(2).replaceAll("-", "")
  return `${day}-${random.toString().padStart(4, "0")}`
}
