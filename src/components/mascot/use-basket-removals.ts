"use client"

import { useEffect, type RefObject } from "react"

import { mascotPhrases, type MessageContent } from "@/lib/mascot/messages"
import { personaFor } from "@/lib/mascot/persona"
import type { MascotScene } from "@/lib/mascot/scene/mascot-scene"
import { useCartStore } from "@/lib/state/cart"

/**
 * When a product leaves the cart (its delete button, or the cart sync after it sold out), Najm takes it out
 * of his basket, throws it away and says so. Emptying the cart when an order is placed isn't a removal: the
 * products leave with the order on the confirmation page (useMascotPersona).
 */
export function useBasketRemovals(
  sceneRef: RefObject<MascotScene | null>,
  say: (content: MessageContent) => void
) {
  useEffect(
    () =>
      useCartStore.subscribe((state, previous) => {
        const scene = sceneRef.current
        if (!scene || state.lines === previous.lines) return
        if (personaFor(window.location.pathname) === "checkout") return
        const kept = new Set(state.lines.map((line) => line.sku))
        for (const line of previous.lines) {
          if (kept.has(line.sku)) continue
          void scene
            .discard(line.sku)
            .then(() =>
              say({ kind: "note", text: mascotPhrases.removed(line.name) })
            )
        }
      }),
    [sceneRef, say]
  )
}
