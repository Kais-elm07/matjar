"use client"

import { useSyncExternalStore } from "react"

import { isCardImage, isVariantOptions } from "@/lib/catalog/guards"
import type { PlacedOrder } from "@/lib/checkout/order"
import type { OrderTotals } from "@/lib/checkout/types"
import {
  isArrayOf,
  isFiniteNumber,
  isNullOr,
  isRecord,
  isString,
} from "@/lib/guards"

// sessionStorage: the order stays only to show the confirmation page, and is cleared when the tab closes
const KEY = "matjar-last-order"

/** Saves the order for the confirmation page, which reads it with useLastOrder. */
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

function isOrderLine(value: unknown): value is PlacedOrder["lines"][number] {
  return (
    isRecord(value) &&
    isString(value.sku) &&
    isString(value.name) &&
    isVariantOptions(value.options) &&
    isFiniteNumber(value.quantity) &&
    isFiniteNumber(value.price) &&
    isNullOr(value.image, isCardImage)
  )
}

function isOrderTotals(value: unknown): value is OrderTotals {
  return (
    isRecord(value) &&
    isFiniteNumber(value.subtotal) &&
    isFiniteNumber(value.discount) &&
    isNullOr(value.shipping, isFiniteNumber) &&
    isFiniteNumber(value.total) &&
    isNullOr(value.freeShippingRemaining, isFiniteNumber)
  )
}

/** A saved order in the shape the confirmation page shows. Anything else is treated as no order. */
function isPlacedOrder(value: unknown): value is PlacedOrder {
  return (
    isRecord(value) &&
    isString(value.number) &&
    isString(value.placedAt) &&
    isRecord(value.customer) &&
    isString(value.customer.name) &&
    isString(value.customer.phone) &&
    isString(value.customer.city) &&
    isString(value.customer.address) &&
    isRecord(value.shipping) &&
    isString(value.shipping.label) &&
    isString(value.shipping.days) &&
    isNullOr(value.couponCode, isString) &&
    isArrayOf(value.lines, isOrderLine) &&
    isOrderTotals(value.totals)
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
