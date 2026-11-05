"use client"

import { useRestoreStores } from "@/lib/state/hydration"

/** Restores the cart and wishlist saved in the browser after the page's first render. */
export function CartWishlistRestorer() {
  useRestoreStores()
  return null
}
