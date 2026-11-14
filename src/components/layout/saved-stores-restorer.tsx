"use client"

import { useRestoreStores } from "@/lib/saved-stores"
import { useCartStore } from "@/modules/cart/store"
import { useMascotPreferences } from "@/modules/mascot/store"
import { useWishlistStore } from "@/modules/wishlist/store"

/** Every store saved in the browser */
const SAVED_STORES = [useCartStore, useWishlistStore, useMascotPreferences]

/** Restores the cart, the wishlist and the choice to hide Najm, saved in the browser, after the page's first render. */
export function SavedStoresRestorer() {
  useRestoreStores(SAVED_STORES)
  return null
}
