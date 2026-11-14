import type { CardImage } from "@/modules/catalog/types"

/** A product that was just added to the cart, and where on the screen the visitor pressed to add it. */
type AddedProduct = {
  sku: string
  slug: string
  name: string
  image: CardImage | null
  /** The pressed button, so the photo flies to Najm from there; null when there is none */
  origin: DOMRect | null
}

type AddedListener = (product: AddedProduct) => void

/** Najm's listener while he is on screen. There is only one Najm, so one listener is enough. */
let listener: AddedListener | null = null

/**
 * Najm listens here while he is on screen, and stops when he leaves. Kept out of the mascot's own
 * code so the add-to-cart buttons don't load three.js.
 */
export function listenForAddedProducts(next: AddedListener) {
  listener = next
  return () => {
    if (listener === next) listener = null
  }
}

/**
 * Tells Najm that a product was added. Returns false when Najm isn't on screen (not loaded yet, hidden by the
 * visitor, or the browser can't draw him), so the caller confirms the add another way: the cart panel.
 */
export function announceAddedProduct(product: AddedProduct) {
  if (!listener) return false
  listener(product)
  return true
}
