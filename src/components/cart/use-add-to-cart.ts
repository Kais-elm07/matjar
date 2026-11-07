"use client"

import { useCallback } from "react"

import { announceAddedProduct } from "@/lib/mascot/events"
import { useCartStore, type CartLine } from "@/lib/state/cart"
import { useUiStore } from "@/lib/state/ui"
import { toast } from "@/lib/toast"

type AddOptions = {
  /**
   * Confirm the add at once: Najm catches the product when he is on screen, otherwise the cart panel opens.
   * Off for "اشترِ الآن" (Buy now), which goes straight to the cart page.
   */
  confirm?: boolean
  /** The pressed button, so the product's photo flies to Najm from there */
  origin?: Element | null
}

/**
 * Adds to the cart with instant confirmation (Najm, or the cart panel), and warns the visitor when there
 * is not enough stock for the requested quantity.
 */
export function useAddToCart() {
  const add = useCartStore((state) => state.add)
  const setCartOpen = useUiStore((state) => state.setCartOpen)

  return useCallback(
    (
      line: Omit<CartLine, "quantity">,
      quantity: number,
      { confirm = true, origin = null }: AddOptions = {}
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
      if (confirm) {
        const caught = announceAddedProduct({
          sku: line.sku,
          slug: line.slug,
          name: line.name,
          image: line.image,
          origin: origin?.getBoundingClientRect() ?? null,
        })
        if (!caught) setCartOpen(true)
      }
      return added
    },
    [add, setCartOpen]
  )
}
