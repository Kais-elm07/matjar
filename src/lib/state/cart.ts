"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { VariantOptions } from "@/lib/catalog/options"
import type {
  CardImage,
  CartCatalog,
  ProductCardData,
} from "@/lib/catalog/types"
import { isCardImage, isVariantOptions } from "@/lib/catalog/guards"
import { optionsKey } from "@/lib/catalog/variant-key"
import { lineLimit } from "@/lib/checkout/quantity"
import { isFiniteNumber, isNullOr, isRecord, isString } from "@/lib/guards"
import { safeStorage } from "@/lib/state/storage"

/** A cart line: the chosen variant with a copy of its data when added, to show it at once without loading. */
export type CartLine = {
  sku: string
  slug: string
  name: string
  image: CardImage | null
  options: VariantOptions
  /** Price in the smallest unit (halala), updated when the cart is synced with the site's data */
  price: number
  compareAtPrice: number | null
  stock: number
  quantity: number
}

/** What changed in the cart after syncing it with the published site's data. */
export type CartNotice = {
  /** The line's SKU: with `kind`, it tells notices apart */
  sku: string
  name: string
  kind: "removed" | "sold-out" | "reduced" | "price-up" | "price-down"
}

type CartState = {
  lines: CartLine[]
  /** Adds the quantity without exceeding the stock, and returns the number of pieces actually added. */
  add: (line: Omit<CartLine, "quantity">, quantity: number) => number
  setQuantity: (sku: string, quantity: number) => void
  remove: (sku: string) => void
  clear: () => void
  /** Applies the current prices and stock to the cart, and returns a list of what changed. */
  sync: (cartCatalog: CartCatalog) => CartNotice[]
}

/** What a product needs to be added to the cart in one click, from a card or from Najm's suggestions. */
export type QuickAddSource = Pick<
  ProductCardData,
  "slug" | "name" | "price" | "compareAtPrice" | "quickAdd"
> & { image: CardImage | null }

/** The cart line of a single-variant product, or null when it has options to choose on its page. */
export function quickAddLine(
  product: QuickAddSource
): Omit<CartLine, "quantity"> | null {
  if (!product.quickAdd) return null
  return {
    sku: product.quickAdd.sku,
    slug: product.slug,
    name: product.name,
    image: product.image,
    options: {},
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    stock: product.quickAdd.stock,
  }
}

/** A well-formed saved line. Others are ignored so old or hand-edited data cannot break the cart. */
function isCartLine(value: unknown): value is CartLine {
  return (
    isRecord(value) &&
    isString(value.sku) &&
    isString(value.slug) &&
    isString(value.name) &&
    isNullOr(value.image, isCardImage) &&
    isVariantOptions(value.options) &&
    isFiniteNumber(value.price) &&
    isNullOr(value.compareAtPrice, isFiniteNumber) &&
    Number.isInteger(value.stock) &&
    isFiniteNumber(value.quantity) &&
    Number.isInteger(value.quantity) &&
    value.quantity > 0
  )
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],

      add(line, quantity) {
        if (!Number.isInteger(quantity) || quantity <= 0) return 0
        const existing = get().lines.find((item) => item.sku === line.sku)
        const current = existing?.quantity ?? 0
        const next = Math.min(current + quantity, lineLimit(line.stock))
        const added = Math.max(0, next - current)
        if (added === 0) return 0
        set((state) => ({
          lines: existing
            ? state.lines.map((item) =>
                item.sku === line.sku
                  ? { ...item, ...line, quantity: next }
                  : item
              )
            : [...state.lines, { ...line, quantity: next }],
        }))
        return added
      },

      setQuantity(sku, quantity) {
        if (!Number.isFinite(quantity)) return
        set((state) => ({
          lines: state.lines.map((item) =>
            item.sku === sku
              ? {
                  ...item,
                  quantity: Math.max(
                    1,
                    Math.min(Math.round(quantity), lineLimit(item.stock))
                  ),
                }
              : item
          ),
        }))
      },

      remove(sku) {
        set((state) => ({
          lines: state.lines.filter((item) => item.sku !== sku),
        }))
      },

      clear() {
        set({ lines: [] })
      },

      sync(cartCatalog) {
        const notices: CartNotice[] = []
        const current = get().lines
        const lines: CartLine[] = []
        for (const line of current) {
          const variant = cartCatalog[line.sku]
          // A SKU that was deleted, or now points to other options after the product was edited
          const notice = { sku: line.sku, name: line.name }
          if (!variant || variant.options !== optionsKey(line.options)) {
            notices.push({ ...notice, kind: "removed" })
            continue
          }
          if (variant.stock === 0) {
            notices.push({ ...notice, kind: "sold-out" })
            continue
          }
          const quantity = Math.min(line.quantity, lineLimit(variant.stock))
          if (quantity < line.quantity) {
            notices.push({ ...notice, kind: "reduced" })
          }
          if (variant.price !== line.price) {
            notices.push({
              ...notice,
              kind: variant.price > line.price ? "price-up" : "price-down",
            })
          }
          const unchanged =
            quantity === line.quantity &&
            variant.price === line.price &&
            variant.compareAtPrice === line.compareAtPrice &&
            variant.stock === line.stock
          lines.push(
            unchanged
              ? line
              : {
                  ...line,
                  price: variant.price,
                  compareAtPrice: variant.compareAtPrice,
                  stock: variant.stock,
                  quantity,
                }
          )
        }
        // No storage write and no re-render if nothing changed
        const changed =
          lines.length !== current.length ||
          lines.some((line, index) => line !== current[index])
        if (changed) set({ lines })
        return notices
      },
    }),
    {
      name: "matjar-cart",
      // Bump the number when the shape of CartLine changes, and add migrate to convert saved carts
      version: 1,
      storage: safeStorage(),
      partialize: (state) => ({ lines: state.lines }),
      // The saved state is accepted after its shape is checked, and any corrupt line is ignored
      merge: (persisted, current) => {
        const lines = isRecord(persisted) ? persisted.lines : undefined
        return {
          ...current,
          lines: Array.isArray(lines) ? lines.filter(isCartLine) : [],
        }
      },
      // Restore from the browser only after the first render, so it matches the prebuilt HTML
      skipHydration: true,
    }
  )
)

/** Number of pieces in the cart. */
export function useCartCount() {
  return useCartStore((state) =>
    state.lines.reduce((sum, line) => sum + line.quantity, 0)
  )
}
