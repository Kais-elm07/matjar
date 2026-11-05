"use client"

import { useCallback } from "react"

import { useCartStore, type CartLine } from "@/lib/store/cart"
import { useUiStore } from "@/lib/store/ui"
import { toast } from "@/lib/toast"

/**
 * Adds to the cart with instant confirmation: opens the cart panel on success,
 * and warns the visitor when there is not enough stock for the requested quantity.
 */
export function useAddToCart() {
  const add = useCartStore((state) => state.add)
  const setCartOpen = useUiStore((state) => state.setCartOpen)

  return useCallback(
    (
      line: Omit<CartLine, "quantity">,
      quantity: number,
      { openCart = true }: { openCart?: boolean } = {}
    ) => {
      const added = add(line, quantity)
      if (added === 0) {
        toast.error("لا يمكن إضافة المزيد", {
          description: "وصلت إلى أقصى كمية متوفرة من هذا المنتج في سلتك.",
        })
        return 0
      }
      if (added < quantity) {
        toast("أُضيفت الكمية المتوفرة فقط", {
          description: `أضفنا ${added} من ${quantity}، لأن المخزون لا يكفي.`,
        })
      }
      if (openCart) setCartOpen(true)
      return added
    },
    [add, setCartOpen]
  )
}
