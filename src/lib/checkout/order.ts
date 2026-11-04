"use client"

import { useSyncExternalStore } from "react"

import type { VariantOptions } from "@/lib/catalog/options"
import type { CardImage } from "@/lib/catalog/types"
import { cartSubtotal, type CartLine } from "@/lib/store/cart"

import { deliveryTime } from "./delivery"
import type { CheckoutValues } from "./schema"
import { calculateTotals, couponProblem } from "./totals"
import type { CheckoutConfig, Coupon, OrderTotals } from "./types"

/** الطلب التجريبي كما تعرضه صفحة التأكيد. لا يُرسل لأي جهة. */
export type PlacedOrder = {
  number: string
  placedAt: string
  customer: { name: string; phone: string; city: string; address: string }
  shipping: { label: string; days: string }
  couponCode: string | null
  lines: {
    sku: string
    name: string
    options: VariantOptions
    quantity: number
    price: number
    image: CardImage | null
  }[]
  totals: OrderTotals
}

// sessionStorage: يبقى الطلب لعرض صفحة التأكيد فقط، ويُمحى عند إغلاق التبويب
const KEY = "matjar-last-order"

/** رقم طلب تجريبي فريد تقريباً بتاريخ جهاز الزائر، مثل 261031-4827. */
function createOrderNumber(date = new Date()) {
  const pad = (value: number) => value.toString().padStart(2, "0")
  const stamp = `${pad(date.getFullYear() % 100)}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
  const random = crypto.getRandomValues(new Uint16Array(1))[0] % 10000
  return `${stamp}-${random.toString().padStart(4, "0")}`
}

/**
 * الطلب التجريبي من قيم النموذج والسلة، بالمبالغ نفسها التي رآها الزائر قبل التأكيد.
 * null إن لم تكن المدينة ضمن مدن الشحن (لا يحدث بعد التحقق من النموذج).
 */
export function buildOrder({
  values,
  lines,
  coupon,
  config,
  now = new Date(),
}: {
  values: CheckoutValues
  lines: CartLine[]
  coupon: Coupon | null
  config: CheckoutConfig
  now?: Date
}): PlacedOrder | null {
  const city = config.cities.find((item) => item.name === values.city)
  if (!city) return null
  const subtotal = cartSubtotal(lines)
  return {
    number: createOrderNumber(now),
    placedAt: now.toISOString(),
    customer: {
      name: values.fullName,
      phone: values.phone,
      city: values.city,
      address: `${values.district}، ${values.street}`,
    },
    shipping:
      values.shippingMethod === "express"
        ? { label: "توصيل سريع", days: config.express.label }
        : { label: "توصيل عادي", days: deliveryTime(city.days) },
    // كوبون لم يعد ينطبق (المجموع تحت حده) لا يُسجَّل في الطلب
    couponCode: coupon && !couponProblem(coupon, subtotal) ? coupon.code : null,
    lines: lines.map(({ sku, name, options, quantity, price, image }) => ({
      sku,
      name,
      options,
      quantity,
      price,
      image,
    })),
    totals: calculateTotals({
      subtotal,
      city,
      method: values.shippingMethod,
      coupon,
      config,
    }),
  }
}

export function saveLastOrder(order: PlacedOrder) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order))
  } catch {
    // التخزين ممنوع في بعض أوضاع التصفح الخاص، فتعرض الصفحة رسالة عامة
  }
}

const readRaw = () => {
  try {
    return sessionStorage.getItem(KEY)
  } catch {
    return null
  }
}

/** طلب محفوظ بالشكل الذي تعرضه صفحة التأكيد. ما عداه يُعامل كأن لا طلب. */
function isPlacedOrder(value: unknown): value is PlacedOrder {
  if (typeof value !== "object" || value === null) return false
  const order = value as Partial<PlacedOrder>
  return (
    typeof order.number === "string" &&
    typeof order.customer?.name === "string" &&
    typeof order.shipping?.label === "string" &&
    Array.isArray(order.lines) &&
    typeof order.totals?.total === "number"
  )
}

/**
 * آخر طلب تجريبي في هذا التبويب: "pending" أثناء البناء وأول عرض،
 * ثم الطلب، أو null إن لم يوجد طلب حديث.
 */
export function useLastOrder(): PlacedOrder | null | "pending" {
  const raw = useSyncExternalStore(
    () => () => {},
    readRaw,
    () => "pending"
  )
  if (raw === "pending" || raw === null) return raw
  try {
    const order: unknown = JSON.parse(raw)
    return isPlacedOrder(order) ? order : null
  } catch {
    return null
  }
}
