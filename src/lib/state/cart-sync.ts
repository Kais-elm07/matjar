"use client"

import { useEffect, useState } from "react"

import { isCartCatalog } from "@/modules/catalog/guards"
import { useCartStore, type CartNotice } from "@/lib/state/cart"
import { useCartRestored } from "@/lib/state/hydration"
import { jsonLoader } from "@/lib/json-loader"

/**
 * Loads the published site's prices and stock once per visit. no-cache asks the site for its copy every
 * time, so old prices do not stay in the browser cache after an update is published.
 */
const loadCartCatalog = jsonLoader("/cart-catalog.json", isCartCatalog, {
  cache: "no-cache",
})

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
