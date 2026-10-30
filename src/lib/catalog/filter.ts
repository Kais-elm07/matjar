import { normalizeForSearch, toSearchTerms } from "./arabic"
import type { ListingParams, SortValue } from "./listing"
import { toMajorUnits, toMinorUnits } from "./money"
import { getColorHex, isColorOption, sortOptionValues } from "./options"
import type { ProductCard } from "./types"

/**
 * البحث والفلترة والترتيب داخل المتصفح.
 * دوال بسيطة بلا حالة، تعمل على بطاقات المنتجات فقط.
 */

/** نتائج البحث مرتبة حسب الصلة: التطابق في الاسم أولاً، ثم الأكثر مبيعاً. */
export function searchCards(cards: ProductCard[], query: string) {
  const terms = toSearchTerms(query)
  if (terms.length === 0) return []
  const phrase = terms.join(" ")

  return cards
    .filter((card) => terms.every((term) => card.searchText.includes(term)))
    .map((card) => {
      const name = normalizeForSearch(card.name)
      const score =
        (name.startsWith(phrase) ? 6 : 0) +
        (name.includes(phrase) ? 3 : 0) +
        terms.filter((term) => name.includes(term)).length
      return { card, score }
    })
    .sort((a, b) => b.score - a.score || b.card.popularity - a.card.popularity)
    .map(({ card }) => card)
}

function matchesOptions(
  card: ProductCard,
  selected: Record<string, string[]>,
  inStockOnly: boolean
) {
  const entries = Object.entries(selected).filter(([, values]) => values.length)
  if (entries.length === 0) return true
  // متغير واحد يجب أن يحقق كل الخيارات المختارة معاً (مثلاً: مقاس M باللون الأزرق)
  return card.variants.some(
    (variant) =>
      (!inStockOnly || variant.inStock) &&
      entries.every(([name, values]) =>
        values.includes(variant.options[name] ?? "")
      )
  )
}

/** تطبيق الفلاتر (دون البحث والترتيب). */
export function filterCards(cards: ProductCard[], params: ListingParams) {
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

/** الترتيب. "الأكثر صلة" يُبقي ترتيب نتائج البحث كما هو. */
export function sortCards(cards: ProductCard[], sort: SortValue) {
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
  /** نطاق الأسعار بالوحدة الكبرى (ريال)، مقرّب لأعداد صحيحة */
  priceRange: { min: number; max: number } | null
  options: OptionFacet[]
  /** عدد المنتجات في كل فئة (بما فيها الفئات الأم) */
  categoryCounts: Record<string, number>
}

/** قيم الفلاتر المتاحة من مجموعة منتجات: نطاق السعر، والخيارات، والفئات. */
export function computeFacets(cards: ProductCard[]): Facets {
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
    // الألوان في النهاية لأن المقاسات أهم في الاختيار عادةً
    options: options.sort((a, b) => Number(a.isColor) - Number(b.isColor)),
    categoryCounts,
  }
}
