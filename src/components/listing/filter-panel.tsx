"use client"

import { CategoryFilter } from "@/components/listing/category-filter"
import { CheckRow } from "@/components/listing/check-row"
import { FilterSection } from "@/components/listing/filter-section"
import type { FilterChange } from "@/components/listing/filter-types"
import { OptionFilter } from "@/components/listing/option-filter"
import { PriceFilter } from "@/components/listing/price-filter"
import type { CategoryOption } from "@/modules/catalog/types"
import type { Facets } from "@/lib/listing/filter"
import {
  CLEARED_FILTERS,
  countActiveFilters,
  type ListingParams,
} from "@/lib/listing/params"

interface FilterPanelProps {
  params: ListingParams
  facets: Facets
  /** The category filter shows only when categories are passed (the all-products and search pages) */
  categories?: CategoryOption[]
  categoryCounts?: Record<string, number>
  onChange: FilterChange
  showHeading?: boolean
}

/** The filter panel: the same one in the sidebar on desktop and in the bottom sheet on mobile. */
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
          // Reset only when the price range changes (for example, when the category changes)
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
