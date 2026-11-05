"use client"

import { XIcon } from "lucide-react"

import { CLEARED_FILTERS, type ListingParams } from "@/lib/catalog/listing"
import { formatPrice, toMinorUnits } from "@/lib/catalog/money"
import type { CategoryOption } from "@/lib/catalog/types"

function priceLabel(min: number | null, max: number | null) {
  const format = (value: number) => formatPrice(toMinorUnits(value))
  if (min !== null && max !== null)
    return `من ${format(min)} إلى ${format(max)}`
  if (min !== null) return `من ${format(min)}`
  return `حتى ${format(max ?? 0)}`
}

interface ActiveFiltersProps {
  params: ListingParams
  categories?: CategoryOption[]
  onChange: (changes: Partial<ListingParams>) => void
}

/** الفلاتر المفعّلة كأزرار صغيرة فوق النتائج، والنقر على أي منها يزيله. */
export function ActiveFilters({
  params,
  categories,
  onChange,
}: ActiveFiltersProps) {
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
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-muted ps-3 pe-2 text-sm transition-colors outline-none hover:bg-muted/70 focus-visible:ring-3 focus-visible:ring-ring/50"
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
          className="inline-flex h-9 items-center rounded-sm px-1 text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          مسح الكل
        </button>
      )}
    </div>
  )
}
