"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

import { safeStorage } from "./storage"

type WishlistState = {
  /** روابط المنتجات المحفوظة، الأحدث أولاً */
  slugs: string[]
  /** يضيف المنتج أو يزيله، ويعيد true إن أصبح في المفضلة. */
  toggle: (slug: string) => boolean
  remove: (slug: string) => void
}

type PersistedWishlist = Pick<WishlistState, "slugs">

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
      storage: safeStorage<PersistedWishlist>(),
      partialize: (state) => ({ slugs: state.slugs }),
      // المحفوظ يُقبل بعد التحقق من شكله: روابط نصية دون تكرار
      merge: (persisted, current) => {
        const slugs =
          typeof persisted === "object" && persisted !== null
            ? (persisted as { slugs?: unknown }).slugs
            : undefined
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
