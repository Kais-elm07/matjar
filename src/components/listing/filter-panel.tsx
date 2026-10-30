"use client"

import { useState } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import type { Facets, OptionFacet } from "@/lib/catalog/filter"
import {
  CLEARED_FILTERS,
  countActiveFilters,
  type ListingParams,
} from "@/lib/catalog/listing"
import { formatPrice, toMinorUnits } from "@/lib/catalog/money"
import type { CategoryOption } from "@/lib/catalog/types"
import { cn } from "@/lib/utils"

type FilterChange = (changes: Partial<ListingParams>) => void

/** لوحة الفلاتر: نفسها في الشريط الجانبي على الحاسوب وفي النافذة السفلية على الجوال. */
export function FilterPanel({
  params,
  facets,
  categories,
  categoryCounts,
  onChange,
  showHeading = true,
}: {
  params: ListingParams
  facets: Facets
  /** يظهر فلتر الفئات فقط عند تمرير الفئات (صفحتا كل المنتجات والبحث) */
  categories?: CategoryOption[]
  categoryCounts?: Record<string, number>
  onChange: FilterChange
  showHeading?: boolean
}) {
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

function FilterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3 border-t pt-5">
      <h3 className="text-sm font-bold">{title}</h3>
      {children}
    </section>
  )
}

function CategoryFilter({
  categories,
  counts,
  selected,
  onSelect,
}: {
  categories: CategoryOption[]
  counts: Record<string, number>
  selected: string | null
  onSelect: (category: string | null) => void
}) {
  const visible = categories.filter((category) => counts[category.slug])
  const roots = visible.filter((category) => !category.parentSlug)

  return (
    <FilterSection title="الفئة">
      <ul className="space-y-0.5">
        <li>
          <CategoryButton
            label="كل الفئات"
            active={!selected}
            onClick={() => onSelect(null)}
          />
        </li>
        {roots.map((root) => {
          const children = visible.filter(
            (category) => category.parentSlug === root.slug
          )
          return (
            <li key={root.slug}>
              <CategoryButton
                label={root.name}
                count={counts[root.slug]}
                active={selected === root.slug}
                onClick={() => onSelect(root.slug)}
              />
              {children.length > 0 && (
                <ul className="ms-3 border-s ps-2">
                  {children.map((child) => (
                    <li key={child.slug}>
                      <CategoryButton
                        label={child.name}
                        count={counts[child.slug]}
                        active={selected === child.slug}
                        onClick={() => onSelect(child.slug)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </FilterSection>
  )
}

function CategoryButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count?: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex min-h-9 w-full items-center justify-between gap-2 rounded-md px-2 text-start text-sm transition-colors hover:bg-muted",
        active && "bg-primary/10 font-semibold text-primary hover:bg-primary/15"
      )}
    >
      {label}
      {count !== undefined && (
        <span className="text-xs text-muted-foreground tabular-nums">
          {count}
        </span>
      )}
    </button>
  )
}

function PriceFilter({
  range,
  minPrice,
  maxPrice,
  onChange,
}: {
  range: { min: number; max: number }
  minPrice: number | null
  maxPrice: number | null
  onChange: FilterChange
}) {
  const clamp = (value: number) =>
    Math.min(range.max, Math.max(range.min, value))
  const fromUrl = [clamp(minPrice ?? range.min), clamp(maxPrice ?? range.max)]
  const [value, setValue] = useState<number[]>(fromUrl)

  // مزامنة القيمة عند تغيّر الرابط من خارج الشريط (مسح الفلاتر مثلاً)،
  // دون إعادة إنشاء الشريط حتى لا يضيع التركيز أثناء استخدام لوحة المفاتيح
  const urlKey = fromUrl.join("-")
  const [syncedKey, setSyncedKey] = useState(urlKey)
  if (syncedKey !== urlKey) {
    setSyncedKey(urlKey)
    setValue(fromUrl)
  }

  const step = range.max - range.min > 2000 ? 10 : 1

  return (
    <FilterSection title="السعر">
      <div className="px-1 pt-1">
        <Slider
          min={range.min}
          max={range.max}
          step={step}
          value={value}
          onValueChange={(next) => setValue(next as number[])}
          onValueCommitted={(next) => {
            const [low, high] = next as number[]
            onChange({
              minPrice: low > range.min ? low : null,
              maxPrice: high < range.max ? high : null,
            })
          }}
          getThumbLabel={(index) => (index === 0 ? "أقل سعر" : "أعلى سعر")}
        />
      </div>
      <p className="flex justify-between text-sm text-muted-foreground tabular-nums">
        <span>{formatPrice(toMinorUnits(value[0]))}</span>
        <span>{formatPrice(toMinorUnits(value[1]))}</span>
      </p>
    </FilterSection>
  )
}

function OptionFilter({
  group,
  selected,
  onToggle,
}: {
  group: OptionFacet
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <FilterSection title={group.name}>
      <div className="flex flex-wrap gap-2">
        {group.values.map(({ value, count, color }) => {
          const isSelected = selected.includes(value)
          return (
            <button
              key={value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(value)}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm transition-colors hover:border-foreground/40",
                isSelected &&
                  "border-primary bg-primary/10 font-semibold text-primary hover:border-primary"
              )}
            >
              {color && (
                <span
                  aria-hidden
                  className="size-4 rounded-full border border-black/15"
                  style={{ backgroundColor: color }}
                />
              )}
              {value}
              <span className="text-xs font-normal text-muted-foreground tabular-nums">
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </FilterSection>
  )
}

function CheckRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <label className="flex min-h-9 cursor-pointer items-center gap-3 text-sm">
      <Checkbox
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
      {label}
    </label>
  )
}
