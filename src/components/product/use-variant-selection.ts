"use client"

import { useState } from "react"

import type { VariantOptions } from "@/lib/catalog/options"
import {
  defaultVariant,
  findVariant,
  imageIndexForOptions,
  optionState,
  selectOption,
  type PurchasableProduct,
} from "@/lib/catalog/variant-selection"
import { lineLimit } from "@/lib/checkout/quantity"

/**
 * The choice on the product page: the chosen options and the variant they make, the quantity (kept
 * within the stock), and the photo shown in the gallery, which follows the chosen color.
 * The rules themselves are in src/lib/catalog/variant-selection.ts.
 */
export function useVariantSelection(product: PurchasableProduct) {
  const [selected, setSelected] = useState<VariantOptions>(
    () => defaultVariant(product).options
  )
  const [imageIndex, setImageIndex] = useState(() =>
    imageIndexForOptions(product, defaultVariant(product).options, 0)
  )
  const [quantity, setQuantity] = useState(1)

  const variant = findVariant(product, selected)
  const stock = variant?.stock ?? 0
  const maxQuantity = Math.max(1, lineLimit(stock))

  function select(groupName: string, value: string) {
    const next = selectOption(product, selected, groupName, value)
    setSelected(next)
    setQuantity(1)
    setImageIndex((current) => imageIndexForOptions(product, next, current))
  }

  return {
    selected,
    variant,
    stock,
    quantity: Math.min(quantity, maxQuantity),
    maxQuantity,
    canBuy: Boolean(variant) && stock > 0,
    imageIndex,
    setImageIndex,
    setQuantity,
    select,
    stateOf: (groupName: string, value: string) =>
      optionState(product, selected, groupName, value),
  }
}
