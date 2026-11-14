"use client"

import { useEffect, type RefObject } from "react"

import type { SimilarProducts } from "@/modules/catalog/types"
import { basketItem } from "@/lib/mascot/basket"
import { listenForAddedProducts } from "@/lib/mascot/events"
import type { MessageContent } from "@/lib/mascot/messages"
import type { MascotScene } from "@/lib/mascot/scene/mascot-scene"
import { loadSimilarProducts, pickSuggestions } from "@/lib/mascot/suggestions"
import { useCartStore } from "@/lib/state/cart"

/**
 * While Najm is on screen, he confirms every product added to the cart instead of the cart panel: he catches
 * it and throws it in his basket, then names it and suggests two similar products that aren't in the cart yet.
 */
export function useAddedProducts(
  sceneRef: RefObject<MascotScene | null>,
  say: (content: MessageContent) => void
) {
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    // Loaded now, so the suggestions are ready by the first add
    void loadSimilarProducts().catch(() => {})

    const stop = listenForAddedProducts((product) => {
      const item = basketItem(product.sku, product.image)
      const caught = item ? scene.receive(item, product.origin) : undefined
      const similar = loadSimilarProducts().catch((): SimilarProducts => ({}))
      void Promise.all([similar, caught]).then(([products]) => {
        const inCart = new Set(
          useCartStore.getState().lines.map((line) => line.slug)
        )
        say({
          kind: "added",
          productName: product.name,
          suggestions: pickSuggestions(products, product.slug, inCart),
        })
      })
    })

    // A sign for the browser tests that Najm now confirms adding to the cart
    const root = document.documentElement
    root.dataset.mascotReady = ""
    return () => {
      stop()
      delete root.dataset.mascotReady
    }
  }, [sceneRef, say])
}
