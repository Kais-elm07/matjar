import type { VariantOptions } from "@/lib/catalog/options"
import type {
  CardImage,
  CardPhoto,
  CartCatalog,
  ImageMeta,
  ProductsResponse,
  SearchCardData,
  SimilarProduct,
  SimilarProducts,
} from "@/lib/catalog/types"
import {
  isArrayOf,
  isBoolean,
  isFiniteNumber,
  isNullOr,
  isRecord,
  isString,
} from "@/lib/guards"
import type { Tone } from "@/lib/tone"

/**
 * Checks for the catalog's shapes in data read at runtime: what the browser downloads
 * (the products API, cart-catalog.json and similar-products.json), the product parts kept in the saved cart and order,
 * and the photo colors that pnpm images writes (image-meta.json).
 * The general checks they build on are in src/lib/guards.ts.
 */

export function isCardImage(value: unknown): value is CardImage {
  return isRecord(value) && isString(value.src) && isString(value.alt)
}

function isTone(value: unknown): value is Tone {
  return (
    isRecord(value) && isFiniteNumber(value.hue) && isFiniteNumber(value.chroma)
  )
}

function isCardPhoto(value: unknown): value is CardPhoto {
  return (
    isRecord(value) &&
    isString(value.src) &&
    isString(value.alt) &&
    isTone(value.tone) &&
    isBoolean(value.cutout)
  )
}

function isImageMetaEntry(value: unknown): value is ImageMeta[string] {
  return (
    isRecord(value) &&
    isNullOr(value.color, isString) &&
    isBoolean(value.cutout)
  )
}

/** The photo colors in public/images/image-meta.json, by the photo's path in the data files. */
export function isImageMeta(value: unknown): value is ImageMeta {
  return isRecord(value) && Object.values(value).every(isImageMetaEntry)
}

export function isVariantOptions(value: unknown): value is VariantOptions {
  return isRecord(value) && Object.values(value).every(isString)
}

function isSpec(value: unknown): value is { label: string; value: string } {
  return isRecord(value) && isString(value.label) && isString(value.value)
}

/** A product's specifications table, as the products table keeps it (a JSON column). */
export function isSpecs(
  value: unknown
): value is { label: string; value: string }[] {
  return isArrayOf(value, isSpec)
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
    isNullOr(value.image, isCardPhoto) &&
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

/** The answer of the products API: the product cards and their count. */
export function isProductsResponse(value: unknown): value is ProductsResponse {
  return (
    isRecord(value) &&
    isArrayOf(value.items, isSearchCard) &&
    isFiniteNumber(value.total)
  )
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

function isSimilarProduct(value: unknown): value is SimilarProduct {
  return (
    isRecord(value) &&
    isString(value.slug) &&
    isString(value.name) &&
    isFiniteNumber(value.price) &&
    isNullOr(value.compareAtPrice, isFiniteNumber) &&
    isBoolean(value.priceVaries) &&
    isNullOr(value.quickAdd, isQuickAdd) &&
    isNullOr(value.image, isCardImage)
  )
}

/** The similar products of every product in similar-products.json, by its slug. */
export function isSimilarProducts(value: unknown): value is SimilarProducts {
  return (
    isRecord(value) &&
    Object.values(value).every((list) => isArrayOf(list, isSimilarProduct))
  )
}
