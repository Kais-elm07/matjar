"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { VariantOptions } from "@/lib/catalog/options"
import type { CardImage, CartCatalog } from "@/lib/catalog/types"
import { optionsKey } from "@/lib/catalog/variant-key"

import { safeStorage } from "./storage"

/** أقصى كمية من المتغير الواحد في السلة، حتى لو كان المخزون أكبر. */
export const MAX_LINE_QUANTITY = 10

/** سطر في السلة: المتغير المختار مع نسخة من بياناته وقت الإضافة، لعرضه فوراً دون تحميل. */
export type CartLine = {
  sku: string
  slug: string
  name: string
  image: CardImage | null
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

type PersistedCart = Pick<CartState, "lines">

/** أقصى كمية مسموحة لسطر حسب مخزونه. */
export function lineLimit(stock: number) {
  return Math.max(0, Math.min(stock, MAX_LINE_QUANTITY))
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

/** سطر محفوظ سليم الشكل. ما عداه يُتجاهل حتى لا تتعطل السلة ببيانات قديمة أو معدّلة يدوياً. */
function isCartLine(value: unknown): value is CartLine {
  if (!isRecord(value)) return false
  const { sku, slug, name, image, options, price, compareAtPrice, stock } =
    value
  return (
    typeof sku === "string" &&
    typeof slug === "string" &&
    typeof name === "string" &&
    (image === null ||
      (isRecord(image) &&
        typeof image.src === "string" &&
        typeof image.alt === "string")) &&
    isRecord(options) &&
    Object.values(options).every((option) => typeof option === "string") &&
    Number.isFinite(price) &&
    (compareAtPrice === null || Number.isFinite(compareAtPrice)) &&
    Number.isInteger(stock) &&
    Number.isInteger(value.quantity) &&
    (value.quantity as number) > 0
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

      sync(catalog) {
        const notices: CartNotice[] = []
        const current = get().lines
        const lines: CartLine[] = []
        for (const line of current) {
          const variant = catalog[line.sku]
          // رمز حُذف، أو صار يدل على خيارات أخرى بعد تعديل المنتج
          if (!variant || variant.options !== optionsKey(line.options)) {
            notices.push({ name: line.name, kind: "removed" })
            continue
          }
          if (variant.stock === 0) {
            notices.push({ name: line.name, kind: "sold-out" })
            continue
          }
          const quantity = Math.min(line.quantity, lineLimit(variant.stock))
          if (quantity < line.quantity) {
            notices.push({ name: line.name, kind: "reduced" })
          }
          if (variant.price !== line.price) {
            notices.push({
              name: line.name,
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
        // لا كتابة في التخزين ولا إعادة عرض إن لم يتغير شيء
        const changed =
          lines.length !== current.length ||
          lines.some((line, index) => line !== current[index])
        if (changed) set({ lines })
        return notices
      },
    }),
    {
      name: "matjar-cart",
      // ارفع الرقم عند تغيير شكل CartLine، وأضف migrate لتحويل السلال المحفوظة
      version: 1,
      storage: safeStorage<PersistedCart>(),
      partialize: (state) => ({ lines: state.lines }),
      // المحفوظ يُقبل بعد التحقق من شكله، وأي سطر تالف يُتجاهل
      merge: (persisted, current) => {
        const lines = isRecord(persisted) ? persisted.lines : undefined
        return {
          ...current,
          lines: Array.isArray(lines) ? lines.filter(isCartLine) : [],
        }
      },
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
