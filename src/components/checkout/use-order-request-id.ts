"use client"

import { useCallback, useRef } from "react"

import type { RequestedLine } from "@/lib/checkout/orders"

/**
 * The id the checkout sends with an order (placeOrder's requestId). It stays the same for as long as
 * the cart does, so when the visitor confirms again because the answer never arrived, the server finds
 * the order it already saved instead of saving a second one. A cart that changed is another order,
 * with an id of its own.
 */
export function useOrderRequestId() {
  const last = useRef({ id: "", cart: "" })

  return useCallback((lines: RequestedLine[]) => {
    const cart = JSON.stringify(lines)
    if (last.current.cart !== cart) {
      last.current = { id: crypto.randomUUID(), cart }
    }
    return last.current.id
  }, [])
}
