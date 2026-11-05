"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

import { isRecord } from "@/lib/guards"

import { safeStorage } from "./storage"

type WishlistState = {
  /** Slugs of the saved products, newest first */
  slugs: string[]
  /** Adds or removes the product, and returns true if it is now in the wishlist. */
  toggle: (slug: string) => boolean
  remove: (slug: string) => void
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
            ? [
                ...new Set(
                  slugs.filter(
                    (slug): slug is string => typeof slug === "string"
                  )
                ),
              ]
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
