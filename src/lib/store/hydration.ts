"use client"

import { useEffect, useSyncExternalStore } from "react"

import { useCartStore } from "./cart"
import { useWishlistStore } from "./wishlist"

const stores = [useCartStore, useWishlistStore]

/**
 * Restores the cart and wishlist from the browser after the page's first render, and updates them when another tab changes them.
 * Called once in the store layout.
 */
export function useRestoreStores() {
  useEffect(() => {
    void Promise.all(stores.map((store) => store.persist.rehydrate())).then(
      () => {
        // A sign that the page is interactive and the cart and wishlist are restored;
        // the Playwright tests wait for it before clicking any button
        document.documentElement.dataset.storesReady = ""
      }
    )

    function onStorage(event: StorageEvent) {
      for (const store of stores) {
        // An empty key means another tab cleared the whole storage
        if (
          event.key === null ||
          event.key === store.persist.getOptions().name
        ) {
          void store.persist.rehydrate()
        }
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])
}

/**
 * Whether the cart has been restored from the browser.
 * Until then, loading skeletons show instead of "السلة فارغة" (the cart is empty).
 */
export function useCartRestored() {
  return useSyncExternalStore(
    (onChange) => useCartStore.persist.onFinishHydration(onChange),
    () => useCartStore.persist.hasHydrated(),
    () => false
  )
}

/** Whether the wishlist has been restored from the browser. */
export function useWishlistRestored() {
  return useSyncExternalStore(
    (onChange) => useWishlistStore.persist.onFinishHydration(onChange),
    () => useWishlistStore.persist.hasHydrated(),
    () => false
  )
}
