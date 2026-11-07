import type { CardImage } from "@/lib/catalog/types"
import { imageFile } from "@/lib/image-loader"

/** A product in Najm's basket: its SKU and the address of its small photo. */
export type BasketItem = { sku: string; photo: string }

/** The basket item for a product photo, or null for a product without a photo (it isn't drawn). */
export function basketItem(sku: string, image: CardImage | null) {
  return image ? { sku, photo: imageFile(image.src, 200) } : null
}

/** The basket items for the cart's lines. */
export function basketItems(
  lines: readonly { sku: string; image: CardImage | null }[]
): BasketItem[] {
  return lines.flatMap((line) => basketItem(line.sku, line.image) ?? [])
}
