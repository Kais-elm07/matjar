"use client"

import { useEffect, useSyncExternalStore } from "react"

/** What these hooks need from a store saved in the browser with zustand's persist. */
type SavedStore = {
  persist: {
    hasHydrated: () => boolean
    onFinishHydration: (listener: () => void) => () => void
    rehydrate: () => Promise<void> | void
    getOptions: () => { name?: string }
  }
}

/**
 * Whether a saved store has been restored from the browser. False in prerendered HTML.
 * Each store has its own hook built on it, such as useCartRestored in src/modules/cart/store.ts.
 */
export function useRestored(store: SavedStore) {
  return useSyncExternalStore(
    (onChange) => store.persist.onFinishHydration(onChange),
    () => store.persist.hasHydrated(),
    () => false
  )
}

/**
 * Restores the saved stores from the browser after the page's first render, and updates them when
 * another tab changes them. Called once, by SavedStoresRestorer in StoreShell, with every saved store.
 */
export function useRestoreStores(stores: readonly SavedStore[]) {
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
  }, [stores])
}
