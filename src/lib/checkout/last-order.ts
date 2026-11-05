"use client"

import { useSyncExternalStore } from "react"

import type { PlacedOrder } from "@/lib/checkout/order"
import { isRecord } from "@/lib/guards"

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
