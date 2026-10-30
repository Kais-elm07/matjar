export const SORT_OPTIONS = [
  { value: "relevance", label: "الأكثر صلة" },
  { value: "popular", label: "الأكثر مبيعاً" },
  { value: "newest", label: "الأحدث" },
  { value: "price-asc", label: "السعر: من الأقل" },
  { value: "price-desc", label: "السعر: من الأعلى" },
] as const

export type SortValue = (typeof SORT_OPTIONS)[number]["value"]

/** الترتيب الافتراضي: الأكثر صلة عند البحث، والأكثر مبيعاً في غير ذلك. */
export function defaultSort(q: string): SortValue {
  return q ? "relevance" : "popular"
}

/** خيارات الترتيب المعروضة: "الأكثر صلة" يظهر فقط مع البحث. */
export function sortOptionsFor(q: string) {
  return SORT_OPTIONS.filter((option) => q || option.value !== "relevance")
}

/** معاملات صفحات القوائم كما تُقرأ من الرابط. الأسعار هنا بالوحدة الكبرى (ريال). */
export type ListingParams = {
  q: string
  category: string | null
  minPrice: number | null
  maxPrice: number | null
  /** الخيارات المختارة: { "المقاس": ["M", "L"], "اللون": ["أزرق"] } */
  options: Record<string, string[]>
  inStock: boolean
  onSale: boolean
  sort: SortValue
  page: number
}

export type RawSearchParams = Record<string, string | string[] | undefined>

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

const all = (value: string | string[] | undefined) =>
  value === undefined ? [] : Array.isArray(value) ? value : [value]

const SORT_VALUES = new Set<string>(SORT_OPTIONS.map((option) => option.value))

/** سعر صحيح غير سالب، أو null لأي قيمة أخرى. */
function parsePrice(value: string | undefined) {
  if (!value) return null
  const number = Number(value)
  return Number.isInteger(number) && number >= 0 && number <= 10_000_000
    ? number
    : null
}

/** رقم صفحة صحيح من 1 إلى 1000، وإلا فالصفحة الأولى. */
function parsePage(value: string | undefined) {
  const number = Number(value)
  return Number.isInteger(number) && number >= 1 && number <= 1000 ? number : 1
}

/**
 * قراءة معاملات الرابط بأمان: أي قيمة غير صالحة تُستبدل بالقيمة الافتراضية بدل إظهار خطأ.
 * الخيارات تأتي بصيغة o=الاسم:القيمة ويمكن تكرارها.
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
    SORT_VALUES.has(sortParam) && (sortParam !== "relevance" || q)
      ? (sortParam as SortValue)
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

/** تحويل URLSearchParams إلى كائن يقبل القيم المتكررة (مثل o). */
export function fromURLSearchParams(search: URLSearchParams): RawSearchParams {
  const raw: RawSearchParams = {}
  for (const key of new Set(search.keys())) {
    const values = search.getAll(key)
    raw[key] = values.length > 1 ? values : values[0]
  }
  return raw
}

/** بناء معاملات الرابط من الحالة، مع حذف القيم الافتراضية حتى يبقى الرابط قصيراً. */
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

/** رابط القائمة بعد تعديل بعض المعاملات. أي تعديل غير رقم الصفحة يعيد إلى الصفحة الأولى. */
export function listingHref(
  pathname: string,
  params: ListingParams,
  changes: Partial<ListingParams> = {}
) {
  const next: ListingParams = { ...params, page: 1, ...changes }
  const query = toSearchParams(next).toString()
  return query ? `${pathname}?${query}` : pathname
}

/** عدد الفلاتر المفعّلة، لعرضه على زر التصفية في الجوال. */
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

/** القيم التي تمسح كل الفلاتر مع إبقاء البحث والترتيب. */
export const CLEARED_FILTERS = {
  category: null,
  minPrice: null,
  maxPrice: null,
  options: {},
  inStock: false,
  onSale: false,
} satisfies Partial<ListingParams>
