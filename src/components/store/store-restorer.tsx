"use client"

import { useRestoreStores } from "@/lib/store/hydration"

/** Restores the cart and wishlist saved in the browser after the page's first render. */
export function StoreRestorer() {
  useRestoreStores()
  return null
}
