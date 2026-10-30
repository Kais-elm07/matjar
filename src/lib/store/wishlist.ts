"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type WishlistState = {
  /** روابط المنتجات المحفوظة، الأحدث أولاً */
  slugs: string[]
  /** يضيف المنتج أو يزيله، ويعيد true إن أصبح في المفضلة. */
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
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ slugs: state.slugs }),
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
