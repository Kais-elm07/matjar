import type { VariantOptions } from "@/lib/catalog/options"
import type {
  CardImage,
  CartCatalog,
  SearchCardData,
} from "@/lib/catalog/types"
import {
  isArrayOf,
  isBoolean,
  isFiniteNumber,
  isNullOr,
  isRecord,
  isString,
} from "@/lib/guards"

/**
 * Checks for the two JSON files the browser downloads (search-index.json and cart-catalog.json).
 * The build writes them, but a broken deploy or an old cached copy shouldn't break the page.
 */

function isCardImage(value: unknown): value is CardImage {
  return isRecord(value) && isString(value.src) && isString(value.alt)
}

function isVariantOptions(value: unknown): value is VariantOptions {
  return isRecord(value) && Object.values(value).every(isString)
}

function isVariantSummary(
  value: unknown
): value is SearchCardData["variants"][number] {
  return (
    isRecord(value) &&
    isVariantOptions(value.options) &&
    isBoolean(value.inStock)
  )
}

function isQuickAdd(
  value: unknown
): value is NonNullable<SearchCardData["quickAdd"]> {
  return isRecord(value) && isString(value.sku) && isFiniteNumber(value.stock)
}

function isSearchCard(value: unknown): value is SearchCardData {
  return (
    isRecord(value) &&
    isString(value.slug) &&
    isString(value.name) &&
    isFiniteNumber(value.price) &&
    isNullOr(value.compareAtPrice, isFiniteNumber) &&
    isBoolean(value.priceVaries) &&
    isBoolean(value.inStock) &&
    isNullOr(value.image, isCardImage) &&
    isNullOr(value.categoryName, isString) &&
    isNullOr(value.quickAdd, isQuickAdd) &&
    isNullOr(value.saleEndsAt, isString) &&
    isArrayOf(value.categorySlugs, isString) &&
    isArrayOf(value.variants, isVariantSummary) &&
    isFiniteNumber(value.popularity) &&
    isString(value.createdAt) &&
    isString(value.searchText)
  )
}

/** The product cards in search-index.json. */
export function isSearchIndex(value: unknown): value is SearchCardData[] {
  return isArrayOf(value, isSearchCard)
}

function isCartCatalogEntry(value: unknown): value is CartCatalog[string] {
  return (
    isRecord(value) &&
    isFiniteNumber(value.price) &&
    isNullOr(value.compareAtPrice, isFiniteNumber) &&
    isFiniteNumber(value.stock) &&
    isString(value.options)
  )
}

/** The current price and stock of every variant in cart-catalog.json, by SKU. */
export function isCartCatalog(value: unknown): value is CartCatalog {
  return isRecord(value) && Object.values(value).every(isCartCatalogEntry)
}
