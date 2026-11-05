"use client"

import { CategoryFilter } from "@/components/listing/category-filter"
import { CheckRow } from "@/components/listing/check-row"
import { FilterSection } from "@/components/listing/filter-section"
import { OptionFilter } from "@/components/listing/option-filter"
import { PriceFilter } from "@/components/listing/price-filter"
import type { Facets } from "@/lib/catalog/filter"
import {
  CLEARED_FILTERS,
  countActiveFilters,
  type ListingParams,
} from "@/lib/catalog/listing"
import type { CategoryOption } from "@/lib/catalog/types"

import type { FilterChange } from "./filter-types"

interface FilterPanelProps {
  params: ListingParams
  facets: Facets
  /** يظهر فلتر الفئات فقط عند تمرير الفئات (صفحتا كل المنتجات والبحث) */
  categories?: CategoryOption[]
  categoryCounts?: Record<string, number>
  onChange: FilterChange
  showHeading?: boolean
}

/** لوحة الفلاتر: نفسها في الشريط الجانبي على الحاسوب وفي النافذة السفلية على الجوال. */
export function FilterPanel({
  params,
  facets,
  categories,
  categoryCounts,
  onChange,
  showHeading = true,
}: FilterPanelProps) {
  const activeCount = countActiveFilters(params)
  const range = facets.priceRange

  return (
    <div className="space-y-5">
      {showHeading && (
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-bold">تصفية النتائج</h2>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => onChange(CLEARED_FILTERS)}
              className="text-sm font-medium text-primary hover:underline"
            >
              مسح الكل
            </button>
          )}
        </div>
      )}

      {categories && categoryCounts && (
        <CategoryFilter
          categories={categories}
          counts={categoryCounts}
          selected={params.category}
          onSelect={(category) => onChange({ category })}
        />
      )}

      {range && range.min < range.max && (
        <PriceFilter
          // إعادة التهيئة فقط عند تغيّر نطاق الأسعار (مثلاً عند تغيير الفئة)
          key={`${range.min}-${range.max}`}
          range={range}
          minPrice={params.minPrice}
          maxPrice={params.maxPrice}
          onChange={onChange}
        />
      )}

      {facets.options.map((group) => (
        <OptionFilter
          key={group.name}
          group={group}
          selected={params.options[group.name] ?? []}
          onToggle={(value) => {
            const current = params.options[group.name] ?? []
            const next = current.includes(value)
              ? current.filter((item) => item !== value)
              : [...current, value]
            onChange({ options: { ...params.options, [group.name]: next } })
          }}
        />
      ))}

      <FilterSection title="التوفر والعروض">
        <CheckRow
          label="المتوفر فقط"
          checked={params.inStock}
          onCheckedChange={(inStock) => onChange({ inStock })}
        />
        <CheckRow
          label="العروض فقط"
          checked={params.onSale}
          onCheckedChange={(onSale) => onChange({ onSale })}
        />
      </FilterSection>
    </div>
  )
}
