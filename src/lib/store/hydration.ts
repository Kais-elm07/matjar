"use client"

import { useEffect, useSyncExternalStore } from "react"

import { useCartStore } from "./cart"
import { useWishlistStore } from "./wishlist"

const stores = [useCartStore, useWishlistStore]

/**
 * يستعيد السلة والمفضلة من المتصفح بعد أول عرض للصفحة، ويحدّثهما عند تغييرهما من تبويب آخر.
 * يُستدعى مرة واحدة في تخطيط المتجر.
 */
export function useRestoreStores() {
  useEffect(() => {
    for (const store of stores) void store.persist.rehydrate()

    function onStorage(event: StorageEvent) {
      for (const store of stores) {
        if (event.key === store.persist.getOptions().name) {
          void store.persist.rehydrate()
        }
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])
}

/** هل استُعيدت السلة من المتصفح؟ قبلها تُعرض هياكل التحميل بدل "السلة فارغة". */
export function useCartRestored() {
  return useSyncExternalStore(
    (onChange) => useCartStore.persist.onFinishHydration(onChange),
    () => useCartStore.persist.hasHydrated(),
    () => false
  )
}

/** هل استُعيدت المفضلة من المتصفح؟ */
export function useWishlistRestored() {
  return useSyncExternalStore(
    (onChange) => useWishlistStore.persist.onFinishHydration(onChange),
    () => useWishlistStore.persist.hasHydrated(),
    () => false
  )
}
