"use client"

import { useEffect, useState } from "react"

import { isCartCatalog } from "@/lib/catalog/guards"
import type { CartCatalog } from "@/lib/catalog/types"
import { useCartStore, type CartNotice } from "@/lib/state/cart"
import { useCartRestored } from "@/lib/state/hydration"

let request: Promise<CartCatalog> | null = null

/** Loads the published site's prices and stock once per visit. */
function loadCartCatalog() {
  // Check the site's copy every time, so old prices do not stay in the browser cache after an update is published
  request ??= fetch("/cart-catalog.json", { cache: "no-cache" })
    .then(async (response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const catalog: unknown = await response.json()
      if (!isCartCatalog(catalog)) throw new Error("Invalid cart catalog")
      return catalog
    })
    .catch((error: unknown) => {
      request = null // Allow a retry next time
      throw error
    })
  return request
}

/**
 * Syncs the saved cart with the site's current data after it is restored: updates prices and stock,
 * removes what sold out or was deleted, and returns a list of the changes to show the visitor.
 */
export function useCartSync(enabled = true) {
  const restored = useCartRestored()
  const [notices, setNotices] = useState<CartNotice[]>([])

  useEffect(() => {
    if (!enabled || !restored) return
    let active = true
    loadCartCatalog().then(
      (catalog) => {
        if (!active) return
        const changes = useCartStore.getState().sync(catalog)
        if (changes.length > 0) setNotices(changes)
      },
      () => {} // Offline, the cart stays as it was saved
    )
    return () => {
      active = false
    }
  }, [enabled, restored])

  return { notices, dismiss: () => setNotices([]) }
}
