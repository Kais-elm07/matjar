"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { VariantOptions } from "@/lib/catalog/options"
import type { CartCatalog } from "@/lib/catalog/types"

/** أقصى كمية من المتغير الواحد في السلة، حتى لو كان المخزون أكبر. */
export const MAX_LINE_QUANTITY = 10

/** سطر في السلة: المتغير المختار مع نسخة من بياناته وقت الإضافة، لعرضه فوراً دون تحميل. */
export type CartLine = {
  sku: string
  slug: string
  name: string
  image: { src: string; alt: string } | null
  options: VariantOptions
  /** السعر بأصغر وحدة (هللة)، ويُحدَّث عند مطابقة السلة مع بيانات الموقع */
  price: number
  compareAtPrice: number | null
  stock: number
  quantity: number
}

/** ما تغيّر في السلة بعد مطابقتها مع بيانات الموقع المنشورة. */
export type CartNotice = {
  name: string
  kind: "removed" | "sold-out" | "reduced" | "price-up" | "price-down"
}

type CartState = {
  lines: CartLine[]
  /** يضيف الكمية دون تجاوز المخزون، ويعيد عدد القطع التي أُضيفت فعلاً. */
  add: (line: Omit<CartLine, "quantity">, quantity: number) => number
  setQuantity: (sku: string, quantity: number) => void
  remove: (sku: string) => void
  clear: () => void
  /** يطبّق الأسعار والمخزون الحالية على السلة، ويعيد قائمة بما تغيّر. */
  sync: (catalog: CartCatalog) => CartNotice[]
}

/** أقصى كمية مسموحة لسطر حسب مخزونه. */
export function lineLimit(stock: number) {
  return Math.max(0, Math.min(stock, MAX_LINE_QUANTITY))
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],

      add(line, quantity) {
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
        set((state) => ({
          lines: state.lines.map((item) =>
            item.sku === sku
              ? {
                  ...item,
                  quantity: Math.max(
                    1,
                    Math.min(quantity, lineLimit(item.stock))
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

      sync(catalog) {
        const notices: CartNotice[] = []
        const lines: CartLine[] = []
        for (const line of get().lines) {
          const current = catalog[line.sku]
          if (!current) {
            notices.push({ name: line.name, kind: "removed" })
            continue
          }
          if (current.stock === 0) {
            notices.push({ name: line.name, kind: "sold-out" })
            continue
          }
          const quantity = Math.min(line.quantity, lineLimit(current.stock))
          if (quantity < line.quantity) {
            notices.push({ name: line.name, kind: "reduced" })
          }
          if (current.price !== line.price) {
            notices.push({
              name: line.name,
              kind: current.price > line.price ? "price-up" : "price-down",
            })
          }
          lines.push({
            ...line,
            price: current.price,
            compareAtPrice: current.compareAtPrice,
            stock: current.stock,
            quantity,
          })
        }
        set({ lines })
        return notices
      },
    }),
    {
      name: "matjar-cart",
      // ارفع الرقم عند تغيير شكل CartLine، وأضف migrate لتحويل السلال المحفوظة
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
      // الاستعادة من المتصفح بعد أول عرض فقط، حتى يطابق HTML المبني مسبقاً
      skipHydration: true,
    }
  )
)

/** عدد القطع في السلة. */
export function useCartCount() {
  return useCartStore((state) =>
    state.lines.reduce((sum, line) => sum + line.quantity, 0)
  )
}

/** مجموع أسعار السلة بأصغر وحدة. */
export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + line.price * line.quantity, 0)
}
