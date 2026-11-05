"use client"

import { useSyncExternalStore } from "react"

import type { VariantOptions } from "@/lib/catalog/options"
import type { CardImage } from "@/lib/catalog/types"
import { isRecord } from "@/lib/guards"
import { cartSubtotal, type CartLine } from "@/lib/store/cart"

import { deliveryTime } from "./delivery"
import type { CheckoutValues } from "./schema"
import { calculateTotals, couponProblem } from "./totals"
import type { CheckoutConfig, Coupon, OrderTotals } from "./types"

/** The demo order as the confirmation page shows it. It is not sent anywhere. */
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

// sessionStorage: the order stays only to show the confirmation page, and is cleared when the tab closes
const KEY = "matjar-last-order"

/** A nearly unique demo order number from the date on the visitor's device, such as 261031-4827. */
function createOrderNumber(date = new Date()) {
  const pad = (value: number) => value.toString().padStart(2, "0")
  const stamp = `${pad(date.getFullYear() % 100)}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
  const random = crypto.getRandomValues(new Uint16Array(1))[0] % 10000
  return `${stamp}-${random.toString().padStart(4, "0")}`
}

/**
 * The demo order from the form values and the cart, with the same amounts the visitor saw before confirming.
 * null if the city is not among the shipping cities (this does not happen after the form is validated).
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
    // A coupon that no longer applies (subtotal below its minimum) is not recorded in the order
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
    // Storage is blocked in some private browsing modes, so the page shows a general message
  }
}

const readRaw = () => {
  try {
    return sessionStorage.getItem(KEY)
  } catch {
    return null
  }
}

/** A saved order in the shape the confirmation page shows. Anything else is treated as no order. */
function isPlacedOrder(value: unknown): value is PlacedOrder {
  return (
    isRecord(value) &&
    typeof value.number === "string" &&
    isRecord(value.customer) &&
    typeof value.customer.name === "string" &&
    isRecord(value.shipping) &&
    typeof value.shipping.label === "string" &&
    Array.isArray(value.lines) &&
    isRecord(value.totals) &&
    typeof value.totals.total === "number"
  )
}

/**
 * The last demo order in this tab: "pending" during the build and the first render,
 * then the order, or null if there is no recent order.
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
