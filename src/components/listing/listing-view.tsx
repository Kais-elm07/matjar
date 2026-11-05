"use client"

import { useCallback, useEffect, useId, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { SlidersHorizontalIcon } from "lucide-react"

import { ActiveFilters } from "@/components/listing/active-filters"
import { ListingEmpty } from "@/components/listing/listing-empty"
import { ListingPagination } from "@/components/listing/listing-pagination"
import {
  LISTING_GRID,
  LISTING_LAYOUT,
} from "@/components/listing/listing-skeleton"
import { ProductGrid } from "@/components/product/product-grid"
import { Button } from "@/components/ui/button"
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
  isSortValue,
  listingHref,
  parseListingParams,
  sortOptionsFor,
  type ListingParams,
} from "@/lib/catalog/listing"
import type {
  CategoryOption,
  ProductCardData,
  SearchCardData,
} from "@/lib/catalog/types"
import {
  updateListingUrl,
  useListingSearch,
} from "@/lib/catalog/use-listing-search"
import { scrollBehavior } from "@/lib/motion"
import { useIdle } from "@/lib/use-idle"
import { useMediaQuery } from "@/lib/use-media-query"
import { cn } from "@/lib/utils"

// لوحة الفلاتر تُرسم في الشريط الجانبي على الحاسوب فقط، وعلى الجوال داخل نافذة "تصفية"،
// فلا يُحمَّل كودها على الجوال إلا بعد ظهور الصفحة
const loadFilterPanel = () =>
  import("@/components/listing/filter-panel").then((mod) => mod.FilterPanel)
const FilterPanel = dynamic(loadFilterPanel, { ssr: false })

// نافذة التصفية للجوال وحده: يُحمَّل كودها بعد ظهور الصفحة، أو عند أول ضغطة على "تصفية"
const FilterSheet = dynamic(
  () =>
    import("@/components/listing/filter-sheet").then((mod) => mod.FilterSheet),
  { ssr: false }
)

type ListingViewProps = {
  /** تمرير الفئات يُظهر فلتر الفئات (صفحتا كل المنتجات والبحث) */
  categories?: CategoryOption[]
} & (
  | { products: ProductCardData[]; search?: false }
  /** وضع البحث: يطبّق كلمة البحث q ويرتب النتائج حسب الصلة، فيحتاج نصوص البحث */
  | { products: SearchCardData[]; search: true }
)

/**
 * قائمة منتجات بفلاتر وترتيب وترقيم، كلها تعمل في المتصفح فوراً.
 * حالة الفلاتر محفوظة في الرابط، فيمكن مشاركته أو الرجوع إليه.
 */
export function ListingView(props: ListingViewProps) {
  const { categories } = props
  const search = props.search === true
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

  const query = params.q
  const scope: ProductCardData[] = useMemo(
    () => (props.search ? searchCards(props.products, query) : props.products),
    [props.search, props.products, query]
  )
  const scopeFacets = useMemo(() => computeFacets(scope), [scope])
  // قيم الفلاتر داخل الفئة المختارة، وبدونها تكفي قيم النطاق كله
  const facets = useMemo(() => {
    const category = params.category
    if (!category) return scopeFacets
    return computeFacets(
      scope.filter((card) => card.categorySlugs.includes(category))
    )
  }, [scope, scopeFacets, params.category])
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
      <ListingEmpty
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
      categoryCounts={categories ? scopeFacets.categoryCounts : undefined}
      onChange={(changes) => navigate(changes)}
      showHeading={showHeading}
    />
  )

  return (
    <div id="listing" className={cn("scroll-mt-40", LISTING_LAYOUT)}>
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
              className="h-11 lg:hidden"
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
            {!isDesktop && (filtersOpen || idle) && (
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
              onChange={(event) => {
                const sort = event.target.value
                if (isSortValue(sort)) navigate({ sort })
              }}
              className="[&_select]:h-11 [&_select]:min-w-32 [&_select]:text-sm"
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
          <ListingEmpty
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
              className={LISTING_GRID}
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
