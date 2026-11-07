"use client"

import { usePathname } from "next/navigation"
import { useEffect, type RefObject } from "react"

import { basketItems } from "@/lib/mascot/basket"
import { mascotPhrases, type MessageContent } from "@/lib/mascot/messages"
import { personaFor, showsCart } from "@/lib/mascot/persona"
import type { MascotScene } from "@/lib/mascot/scene/mascot-scene"
import { firstTimeThisVisit } from "@/lib/mascot/visit"
import { useCartStore } from "@/lib/state/cart"

/**
 * Najm's behavior on each page (personaFor): on every page change he shows or hides his cart and fills its
 * basket with what is in the cart, greets the visitor on the home page once per visit, says what the cart
 * holds on the cart page, and celebrates once per order on the confirmation page.
 */
export function useMascotPersona(
  sceneRef: RefObject<MascotScene | null>,
  say: (content: MessageContent) => void
) {
  const pathname = usePathname()

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    const persona = personaFor(pathname)

    // The cart was emptied when the order was placed: he sends it off with the products still in his basket,
    // once per order (each order has its own address)
    if (persona === "order-placed" && firstTimeThisVisit(pathname)) {
      void scene
        .celebrate()
        .then(() => say({ kind: "note", text: mascotPhrases.orderPlaced }))
      return
    }

    const { lines } = useCartStore.getState()
    void scene.showCart(showsCart(persona))
    const filled = scene.syncBasket(basketItems(lines))

    if (persona === "welcome" && firstTimeThisVisit("greeting")) {
      void scene.greet().then(() => say({ kind: "greeting" }))
    } else if (persona === "shopping" && firstTimeThisVisit("shopping-hint")) {
      void filled.then(() =>
        say({ kind: "note", text: mascotPhrases.shoppingHint })
      )
    } else if (persona === "cart") {
      const pieces = lines.reduce((sum, line) => sum + line.quantity, 0)
      void filled.then(() =>
        say({ kind: "note", text: mascotPhrases.cart(pieces) })
      )
    }
  }, [pathname, sceneRef, say])
}
