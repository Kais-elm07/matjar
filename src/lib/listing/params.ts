export type SortValue =
  "relevance" | "popular" | "newest" | "price-asc" | "price-desc"

interface SortOption {
  value: SortValue
  label: string
}

const SORT_OPTIONS: readonly SortOption[] = [
  { value: "relevance", label: "الأكثر صلة" },
  { value: "popular", label: "الأكثر مبيعاً" },
  { value: "newest", label: "الأحدث" },
  { value: "price-asc", label: "السعر: من الأقل" },
  { value: "price-desc", label: "السعر: من الأعلى" },
]

/** Whether a value read from the URL or a select box is one of the sort options. */
export function isSortValue(value: string): value is SortValue {
  return SORT_OPTIONS.some((option) => option.value === value)
}

/** The default sort: most relevant when searching, best selling otherwise. */
function defaultSort(q: string): SortValue {
  return q ? "relevance" : "popular"
}

/** The sort options shown: "الأكثر صلة" (most relevant) appears only with a search. */
export function sortOptionsFor(q: string) {
  return SORT_OPTIONS.filter((option) => q || option.value !== "relevance")
}

/** Listing page parameters as read from the URL. Prices here are in the major unit (riyal). */
export type ListingParams = {
  q: string
  category: string | null
  minPrice: number | null
  maxPrice: number | null
  /** The chosen options: { "المقاس": ["M", "L"], "اللون": ["أزرق"] } (size M or L, color blue) */
  options: Record<string, string[]>
  inStock: boolean
  onSale: boolean
  sort: SortValue
  page: number
}

type RawSearchParams = Record<string, string | string[] | undefined>

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

const all = (value: string | string[] | undefined) =>
  value === undefined ? [] : Array.isArray(value) ? value : [value]

/** A non-negative whole-number price, or null for any other value. */
function parsePrice(value: string | undefined) {
  if (!value) return null
  const number = Number(value)
  return Number.isInteger(number) && number >= 0 && number <= 10_000_000
    ? number
    : null
}

/** A whole page number from 1 to 1000, otherwise the first page. */
function parsePage(value: string | undefined) {
  const number = Number(value)
  return Number.isInteger(number) && number >= 1 && number <= 1000 ? number : 1
}

/**
 * Reads the URL parameters safely: any invalid value is replaced with the default instead of showing an error.
 * Options come as o=name:value and can repeat.
 */
export function parseListingParams(
  searchParams: RawSearchParams
): ListingParams {
  const q = (first(searchParams.q) ?? "").trim().slice(0, 100)
  const category = first(searchParams.category)?.trim() ?? ""
  const sortParam = first(searchParams.sort) ?? ""

  const options: Record<string, string[]> = {}
  for (const entry of all(searchParams.o).slice(0, 30)) {
    const separator = entry.indexOf(":")
    if (separator <= 0) continue
    const name = entry.slice(0, separator).trim()
    const value = entry.slice(separator + 1).trim()
    if (!name || !value || name.length > 60 || value.length > 60) continue
    options[name] = [...new Set([...(options[name] ?? []), value])]
  }

  let minPrice = parsePrice(first(searchParams.min))
  let maxPrice = parsePrice(first(searchParams.max))
  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    ;[minPrice, maxPrice] = [maxPrice, minPrice]
  }

  const sort =
    isSortValue(sortParam) && (sortParam !== "relevance" || q)
      ? sortParam
      : defaultSort(q)

  return {
    q,
    category: /^[a-z0-9-]{1,120}$/.test(category) ? category : null,
    minPrice,
    maxPrice,
    options,
    inStock: first(searchParams.stock) === "1",
    onSale: first(searchParams.sale) === "1",
    sort,
    page: parsePage(first(searchParams.page)),
  }
}

/** Converts URLSearchParams to an object that accepts repeated values (such as o). */
export function fromURLSearchParams(search: URLSearchParams): RawSearchParams {
  const raw: RawSearchParams = {}
  for (const key of new Set(search.keys())) {
    const values = search.getAll(key)
    raw[key] = values.length > 1 ? values : values[0]
  }
  return raw
}

/** Builds the URL parameters from the state, leaving out default values so the URL stays short. */
export function toSearchParams(params: ListingParams) {
  const search = new URLSearchParams()
  if (params.q) search.set("q", params.q)
  if (params.category) search.set("category", params.category)
  if (params.minPrice !== null) search.set("min", String(params.minPrice))
  if (params.maxPrice !== null) search.set("max", String(params.maxPrice))
  for (const [name, values] of Object.entries(params.options)) {
    for (const value of values) search.append("o", `${name}:${value}`)
  }
  if (params.inStock) search.set("stock", "1")
  if (params.onSale) search.set("sale", "1")
  if (params.sort !== defaultSort(params.q)) search.set("sort", params.sort)
  if (params.page > 1) search.set("page", String(params.page))
  return search
}

/** The listing URL after some parameters change. Any change but the page number returns to page one. */
export function listingHref(
  pathname: string,
  params: ListingParams,
  changes: Partial<ListingParams> = {}
) {
  const next: ListingParams = { ...params, page: 1, ...changes }
  const query = toSearchParams(next).toString()
  return query ? `${pathname}?${query}` : pathname
}

/** Number of active filters, shown on the filter button on mobile. */
export function countActiveFilters(params: ListingParams) {
  return (
    (params.category ? 1 : 0) +
    (params.minPrice !== null || params.maxPrice !== null ? 1 : 0) +
    Object.values(params.options).reduce(
      (sum, values) => sum + values.length,
      0
    ) +
    (params.inStock ? 1 : 0) +
    (params.onSale ? 1 : 0)
  )
}

/** Values that clear all filters while keeping the search and the sort. */
export const CLEARED_FILTERS = {
  category: null,
  minPrice: null,
  maxPrice: null,
  options: {},
  inStock: false,
  onSale: false,
} satisfies Partial<ListingParams>
