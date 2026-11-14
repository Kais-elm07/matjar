import {
  getColorHex,
  isColorOption,
  sortOptionValues,
} from "@/modules/catalog/options"
import type { ProductCardData } from "@/modules/catalog/types"
import type { ListingParams, SortValue } from "@/lib/listing/params"
import { toMajorUnits, toMinorUnits } from "@/lib/money"

/**
 * Filtering, sorting and pages for the product lists, in the browser.
 * Simple stateless functions that work on product cards only. Text search is in src/lib/search.
 */

function matchesOptions(
  card: ProductCardData,
  selected: Record<string, string[]>,
  inStockOnly: boolean
) {
  const entries = Object.entries(selected).filter(([, values]) => values.length)
  if (entries.length === 0) return true
  // A single variant must match all the chosen options together (for example: size M in blue)
  return card.variants.some(
    (variant) =>
      (!inStockOnly || variant.inStock) &&
      entries.every(([name, values]) =>
        values.includes(variant.options[name] ?? "")
      )
  )
}

/** Applies the filters (without search and sorting). */
export function filterCards<T extends ProductCardData>(
  cards: T[],
  params: ListingParams
): T[] {
  const min = params.minPrice === null ? null : toMinorUnits(params.minPrice)
  const max = params.maxPrice === null ? null : toMinorUnits(params.maxPrice)

  return cards.filter(
    (card) =>
      (!params.category || card.categorySlugs.includes(params.category)) &&
      (min === null || card.price >= min) &&
      (max === null || card.price <= max) &&
      (!params.inStock || card.inStock) &&
      (!params.onSale || card.compareAtPrice !== null) &&
      matchesOptions(card, params.options, params.inStock)
  )
}

/** Sorting. "الأكثر صلة" (most relevant) keeps the search results in their order. */
export function sortCards<T extends ProductCardData>(
  cards: T[],
  sort: SortValue
): T[] {
  const sorted = [...cards]
  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price)
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price)
    case "popular":
      return sorted.sort((a, b) => b.popularity - a.popularity)
    case "relevance":
      return sorted
  }
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const pageCount = Math.max(1, Math.ceil(items.length / perPage))
  const current = Math.min(Math.max(1, page), pageCount)
  return {
    items: items.slice((current - 1) * perPage, current * perPage),
    page: current,
    pageCount,
    total: items.length,
  }
}

export type OptionFacet = {
  name: string
  isColor: boolean
  values: { value: string; count: number; color: string | null }[]
}

export type Facets = {
  /** The price range in the major unit (riyal), rounded to whole numbers */
  priceRange: { min: number; max: number } | null
  options: OptionFacet[]
  /** Number of products in each category (parent categories included) */
  categoryCounts: Record<string, number>
}

/** The filter values available for a set of products: price range, options and categories. */
export function computeFacets(cards: ProductCardData[]): Facets {
  if (cards.length === 0) {
    return { priceRange: null, options: [], categoryCounts: {} }
  }

  const prices = cards.map((card) => card.price)
  const optionProducts = new Map<string, Map<string, Set<string>>>()
  const categoryCounts: Record<string, number> = {}

  for (const card of cards) {
    for (const slug of card.categorySlugs) {
      categoryCounts[slug] = (categoryCounts[slug] ?? 0) + 1
    }
    for (const variant of card.variants) {
      for (const [name, value] of Object.entries(variant.options)) {
        const values =
          optionProducts.get(name) ?? new Map<string, Set<string>>()
        const products = values.get(value) ?? new Set<string>()
        products.add(card.slug)
        values.set(value, products)
        optionProducts.set(name, values)
      }
    }
  }

  const options: OptionFacet[] = [...optionProducts].map(([name, values]) => {
    const color = isColorOption(name)
    return {
      name,
      isColor: color,
      values: sortOptionValues([...values.keys()]).map((value) => ({
        value,
        count: values.get(value)?.size ?? 0,
        color: color ? getColorHex(value) : null,
      })),
    }
  })

  return {
    priceRange: {
      min: Math.floor(toMajorUnits(Math.min(...prices))),
      max: Math.ceil(toMajorUnits(Math.max(...prices))),
    },
    // Colors go last because sizes usually matter more when choosing
    options: options.sort((a, b) => Number(a.isColor) - Number(b.isColor)),
    categoryCounts,
  }
}
