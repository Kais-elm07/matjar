"use client"

import { useEffect, useSyncExternalStore } from "react"

import { useCartStore } from "@/lib/state/cart"
import { useMascotPreferences } from "@/lib/state/mascot"
import { useWishlistStore } from "@/lib/state/wishlist"

const stores = [useCartStore, useWishlistStore, useMascotPreferences]

/** What useRestored needs from a store saved in the browser with zustand's persist. */
type SavedStore = {
  persist: {
    hasHydrated: () => boolean
    onFinishHydration: (listener: () => void) => () => void
  }
}

/** Whether a saved store has been restored from the browser. False in prerendered HTML. */
function useRestored(store: SavedStore) {
  return useSyncExternalStore(
    (onChange) => store.persist.onFinishHydration(onChange),
    () => store.persist.hasHydrated(),
    () => false
  )
}

/**
 * Restores the cart, the wishlist and the mascot setting from the browser after the page's first render,
 * and updates them when another tab changes them. Called once, by CartWishlistRestorer in StoreShell.
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
  return useRestored(useCartStore)
}

/** Whether the wishlist has been restored from the browser. */
export function useWishlistRestored() {
  return useRestored(useWishlistStore)
}

/** Whether the visitor's choice to show or hide Najm has been restored from the browser. */
export function useMascotRestored() {
  return useRestored(useMascotPreferences)
}
