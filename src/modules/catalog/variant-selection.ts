import type { VariantOptions } from "@/modules/catalog/options"
import type { Product, Variant } from "@/modules/catalog/types"

/**
 * Choosing a variant on the product page: which variant the chosen options make, whether each option
 * value can still be chosen, and which photo goes with the chosen color.
 * Plain functions without React, so they are easy to test; useVariantSelection keeps the state.
 */

/**
 * Only what the purchase panel needs, so the description and specs aren't sent
 * a second time with the page code.
 */
export type PurchasableProduct = Pick<
  Product,
  | "slug"
  | "name"
  | "images"
  | "variants"
  | "optionGroups"
  | "price"
  | "compareAtPrice"
>

/** Whether an option value can be chosen with the other chosen options. */
export type OptionState = "available" | "sold-out" | "unavailable"

/** The variant the page opens with: the first one in stock, or the first one. */
export function defaultVariant(product: PurchasableProduct): Variant {
  return (
    product.variants.find((variant) => variant.stock > 0) ?? product.variants[0]
  )
}

/** The variant that has exactly the chosen options, if there is one. */
export function findVariant(
  product: PurchasableProduct,
  selected: VariantOptions
): Variant | undefined {
  return product.variants.find((candidate) =>
    product.optionGroups.every(
      (group) => candidate.options[group.name] === selected[group.name]
    )
  )
}

/** The state of one option value, with the other chosen options as they are. */
export function optionState(
  product: PurchasableProduct,
  selected: VariantOptions,
  groupName: string,
  value: string
): OptionState {
  const candidates = product.variants.filter(
    (candidate) =>
      candidate.options[groupName] === value &&
      product.optionGroups.every(
        (group) =>
          group.name === groupName ||
          candidate.options[group.name] === selected[group.name]
      )
  )
  if (candidates.length === 0) return "unavailable"
  return candidates.some((candidate) => candidate.stock > 0)
    ? "available"
    : "sold-out"
}

/**
 * The chosen options after picking a value. When that combination doesn't exist, the closest
 * variant with this value is chosen instead (one in stock first).
 */
export function selectOption(
  product: PurchasableProduct,
  selected: VariantOptions,
  groupName: string,
  value: string
): VariantOptions {
  const next = { ...selected, [groupName]: value }
  if (findVariant(product, next)) return next
  const fallback =
    product.variants.find(
      (candidate) =>
        candidate.options[groupName] === value && candidate.stock > 0
    ) ??
    product.variants.find((candidate) => candidate.options[groupName] === value)
  return fallback ? fallback.options : next
}

/** The chosen color's photo if there is one; otherwise the current photo stays. */
export function imageIndexForOptions(
  product: PurchasableProduct,
  options: VariantOptions,
  current: number
) {
  const colorGroup = product.optionGroups.find((group) => group.isColor)
  if (!colorGroup) return current
  const index = product.images.findIndex(
    (image) => image.color === options[colorGroup.name]
  )
  return index >= 0 ? index : current
}
