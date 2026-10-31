"use client"

import { useCallback, useEffect, useId, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SearchXIcon, SlidersHorizontalIcon, XIcon } from "lucide-react"

import { ListingPagination } from "@/components/listing/listing-pagination"
import { ProductGrid } from "@/components/product/product-grid"
import { EmptyState } from "@/components/store/empty-state"
import { Button, buttonVariants } from "@/components/ui/button"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { siteConfig } from "@/config/site"
import { PRODUCT_FORMS, pluralize } from "@/lib/arabic-plural"
import {
  computeFacets,
  filterCards,
  paginate,
  searchCards,
  sortCards,
} from "@/lib/catalog/filter"
import {
  CLEARED_FILTERS,
  countActiveFilters,
  fromURLSearchParams,
  listingHref,
  parseListingParams,
  sortOptionsFor,
  type ListingParams,
  type SortValue,
} from "@/lib/catalog/listing"
import { formatPrice, toMinorUnits } from "@/lib/catalog/money"
import type { CategoryOption, ProductCard } from "@/lib/catalog/types"
import {
  updateListingUrl,
  useListingSearch,
} from "@/lib/catalog/use-listing-search"
import { scrollBehavior } from "@/lib/motion"
import { useIdle } from "@/lib/use-idle"
import { useMediaQuery } from "@/lib/use-media-query"

// لوحة الفلاتر تُرسم في الشريط الجانبي على الحاسوب فقط، وعلى الجوال داخل نافذة "تصفية"،
// فلا يُحمَّل كودها على الجوال إلا بعد ظهور الصفحة
const loadFilterPanel = () =>
  import("@/components/listing/filter-panel").then((mod) => mod.FilterPanel)
const FilterPanel = dynamic(loadFilterPanel, { ssr: false })

// نافذة التصفية على الجوال يُحمَّل كودها بعد ظهور الصفحة، أو عند أول ضغطة على "تصفية"
const FilterSheet = dynamic(
  () =>
    import("@/components/listing/filter-sheet").then((mod) => mod.FilterSheet),
  { ssr: false }
)

type ListingViewProps = {
  products: ProductCard[]
  /** تمرير الفئات يُظهر فلتر الفئات (صفحتا كل المنتجات والبحث) */
  categories?: CategoryOption[]
  /** وضع البحث: يطبّق كلمة البحث q ويرتب النتائج حسب الصلة */
  search?: boolean
}

/**
 * قائمة منتجات بفلاتر وترتيب وترقيم، كلها تعمل في المتصفح فوراً.
 * حالة الفلاتر محفوظة في الرابط، فيمكن مشاركته أو الرجوع إليه.
 */
export function ListingView({
  products,
  categories,
  search = false,
}: ListingViewProps) {
  const searchString = useListingSearch()
  const rawPathname = usePathname()
  // الشرطة المائلة في النهاية كما في الموقع المنشور، حتى تتطابق الروابط وقت البناء وفي المتصفح
  const pathname = rawPathname.endsWith("/") ? rawPathname : `${rawPathname}/`
  const sortId = useId()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const idle = useIdle()
  const isDesktop = useMediaQuery("(min-width: 64rem)")

  // تجهيز لوحة الفلاتر مسبقاً حتى تظهر فوراً عند فتح نافذة التصفية
  useEffect(() => {
    if (idle) void loadFilterPanel()
  }, [idle])

  const params = useMemo(
    () =>
      parseListingParams(
        fromURLSearchParams(new URLSearchParams(searchString))
      ),
    [searchString]
  )

  const scope = useMemo(
    () => (search ? searchCards(products, params.q) : products),
    [products, search, params.q]
  )
  const categoryCounts = useMemo(
    () => computeFacets(scope).categoryCounts,
    [scope]
  )
  const facets = useMemo(
    () =>
      computeFacets(
        params.category
          ? scope.filter((card) =>
              card.categorySlugs.includes(params.category as string)
            )
          : scope
      ),
    [scope, params.category]
  )
  const result = useMemo(
    () =>
      paginate(
        sortCards(filterCards(scope, params), params.sort),
        params.page,
        siteConfig.productsPerPage
      ),
    [scope, params]
  )

  const activeCount = countActiveFilters(params)

  /** تحديث الرابط دون إعادة تحميل الصفحة. */
  const navigate = useCallback(
    (changes: Partial<ListingParams>, push = false) => {
      updateListingUrl(listingHref(pathname, params, changes), push)
    },
    [pathname, params]
  )

  const goToPage = (page: number) => {
    navigate({ page }, true)
    document
      .getElementById("listing")
      ?.scrollIntoView({ behavior: scrollBehavior(), block: "start" })
  }

  // لا شيء لفلترته (بحث بلا نتائج أو فئة فارغة): رسالة واضحة فقط دون أدوات التصفية
  if (scope.length === 0) {
    return (
      <NoResults
        params={params}
        search={search}
        ignoreFilters
        onClear={() => navigate(CLEARED_FILTERS)}
      />
    )
  }

  const filterPanel = (showHeading: boolean) => (
    <FilterPanel
      params={params}
      facets={facets}
      categories={categories}
      categoryCounts={categories ? categoryCounts : undefined}
      onChange={(changes) => navigate(changes)}
      showHeading={showHeading}
    />
  )

  return (
    <div
      id="listing"
      className="scroll-mt-40 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8"
    >
      <aside aria-label="تصفية النتائج" className="hidden lg:block">
        <div className="sticky top-32">{isDesktop && filterPanel(true)}</div>
      </aside>

      <div className="min-w-0">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {pluralize(result.total, PRODUCT_FORMS)}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-10 lg:hidden"
              aria-haspopup="dialog"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen(true)}
            >
              <SlidersHorizontalIcon aria-hidden />
              تصفية
              {activeCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground tabular-nums">
                  {activeCount}
                </span>
              )}
            </Button>
            {(filtersOpen || idle) && (
              <FilterSheet
                open={filtersOpen}
                onOpenChange={setFiltersOpen}
                total={result.total}
                onClear={
                  activeCount > 0 ? () => navigate(CLEARED_FILTERS) : undefined
                }
              >
                {filterPanel(false)}
              </FilterSheet>
            )}

            <label htmlFor={sortId} className="sr-only">
              ترتيب حسب
            </label>
            <NativeSelect
              id={sortId}
              value={params.sort}
              onChange={(event) =>
                navigate({ sort: event.target.value as SortValue })
              }
              className="[&_select]:h-10 [&_select]:min-w-32 [&_select]:text-sm"
            >
              {sortOptionsFor(params.q).map((option) => (
                <NativeSelectOption key={option.value} value={option.value}>
                  {option.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
        </div>

        <ActiveFilters
          params={params}
          categories={categories}
          onChange={(changes) => navigate(changes)}
        />

        {result.total === 0 ? (
          <NoResults
            params={params}
            search={search}
            onClear={() => navigate(CLEARED_FILTERS)}
          />
        ) : (
          <>
            <h2 className="sr-only">قائمة المنتجات</h2>
            <ProductGrid
              products={result.items}
              priorityCount={4}
              className="lg:grid-cols-3 xl:grid-cols-4"
            />
            <ListingPagination
              page={result.page}
              pageCount={result.pageCount}
              hrefFor={(page) => listingHref(pathname, params, { page })}
              onNavigate={goToPage}
            />
          </>
        )}
      </div>
    </div>
  )
}

function priceLabel(min: number | null, max: number | null) {
  const format = (value: number) => formatPrice(toMinorUnits(value))
  if (min !== null && max !== null)
    return `من ${format(min)} إلى ${format(max)}`
  if (min !== null) return `من ${format(min)}`
  return `حتى ${format(max ?? 0)}`
}

/** الفلاتر المفعّلة كأزرار صغيرة، والنقر على أي منها يزيله. */
function ActiveFilters({
  params,
  categories,
  onChange,
}: {
  params: ListingParams
  categories?: CategoryOption[]
  onChange: (changes: Partial<ListingParams>) => void
}) {
  const chips: {
    key: string
    label: string
    remove: Partial<ListingParams>
  }[] = []

  if (params.category) {
    const name =
      categories?.find((c) => c.slug === params.category)?.name ??
      params.category
    chips.push({ key: "category", label: name, remove: { category: null } })
  }
  if (params.minPrice !== null || params.maxPrice !== null) {
    chips.push({
      key: "price",
      label: priceLabel(params.minPrice, params.maxPrice),
      remove: { minPrice: null, maxPrice: null },
    })
  }
  for (const [name, values] of Object.entries(params.options)) {
    for (const value of values) {
      chips.push({
        key: `option-${name}-${value}`,
        label: `${name}: ${value}`,
        remove: {
          options: {
            ...params.options,
            [name]: values.filter((item) => item !== value),
          },
        },
      })
    }
  }
  if (params.inStock) {
    chips.push({
      key: "stock",
      label: "المتوفر فقط",
      remove: { inStock: false },
    })
  }
  if (params.onSale) {
    chips.push({ key: "sale", label: "العروض فقط", remove: { onSale: false } })
  }

  if (chips.length === 0) return null

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onChange(chip.remove)}
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-muted ps-3 pe-2 text-sm transition-colors hover:bg-muted/70"
        >
          {chip.label}
          <XIcon className="size-3.5" aria-hidden />
          <span className="sr-only">إزالة الفلتر</span>
        </button>
      ))}
      {chips.length > 1 && (
        <button
          type="button"
          onClick={() => onChange(CLEARED_FILTERS)}
          className="text-sm font-medium text-primary hover:underline"
        >
          مسح الكل
        </button>
      )}
    </div>
  )
}

function NoResults({
  params,
  search,
  ignoreFilters = false,
  onClear,
}: {
  params: ListingParams
  search: boolean
  /** لا توجد منتجات أصلاً، فمسح الفلاتر لن يفيد */
  ignoreFilters?: boolean
  onClear: () => void
}) {
  if (!ignoreFilters && countActiveFilters(params) > 0) {
    return (
      <EmptyState
        icon={SearchXIcon}
        title="لا توجد منتجات تطابق اختيارك"
        description="جرّب إزالة بعض الفلاتر أو توسيع نطاق السعر."
      >
        <Button variant="outline" size="lg" onClick={onClear}>
          مسح الفلاتر
        </Button>
      </EmptyState>
    )
  }

  if (search) {
    return (
      <EmptyState
        icon={SearchXIcon}
        title={`لم نجد نتائج لـ «${params.q}»`}
        description="تأكد من كتابة الكلمة بشكل صحيح، أو جرّب كلمة أعم مثل اسم الفئة."
      >
        <Link
          href="/products"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          تصفّح كل المنتجات
        </Link>
      </EmptyState>
    )
  }

  return (
    <EmptyState
      icon={SearchXIcon}
      title="لا توجد منتجات هنا بعد"
      description="تصفّح الفئات الأخرى، فالمنتجات الجديدة تُضاف باستمرار."
    />
  )
}
