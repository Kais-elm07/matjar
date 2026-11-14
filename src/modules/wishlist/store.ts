"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

import { isRecord, isString } from "@/lib/guards"
import { safeStorage } from "@/lib/state/storage"

type WishlistState = {
  /** Slugs of the saved products, newest first */
  slugs: string[]
  /** Adds or removes the product, and returns true if it is now in the wishlist. */
  toggle: (slug: string) => boolean
  remove: (slug: string) => void
  /** Drops the saved products that are no longer in the store, and returns how many were dropped. */
  prune: (inStore: ReadonlySet<string>) => number
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      slugs: [],

      toggle(slug) {
        const saved = get().slugs.includes(slug)
        set((state) => ({
          slugs: saved
            ? state.slugs.filter((item) => item !== slug)
            : [slug, ...state.slugs],
        }))
        return !saved
      },

      remove(slug) {
        set((state) => ({
          slugs: state.slugs.filter((item) => item !== slug),
        }))
      },

      prune(inStore) {
        const { slugs } = get()
        const kept = slugs.filter((slug) => inStore.has(slug))
        // No storage write and no re-render if every saved product is still in the store
        if (kept.length < slugs.length) set({ slugs: kept })
        return slugs.length - kept.length
      },
    }),
    {
      name: "matjar-wishlist",
      version: 1,
      storage: safeStorage(),
      partialize: (state) => ({ slugs: state.slugs }),
      // The saved state is accepted after its shape is checked: string slugs without duplicates
      merge: (persisted, current) => {
        const slugs = isRecord(persisted) ? persisted.slugs : undefined
        return {
          ...current,
          slugs: Array.isArray(slugs)
            ? [...new Set(slugs.filter(isString))]
            : [],
        }
      },
      skipHydration: true,
    }
  )
)

export function useWishlistCount() {
  return useWishlistStore((state) => state.slugs.length)
}

export function useIsWishlisted(slug: string) {
  return useWishlistStore((state) => state.slugs.includes(slug))
}
