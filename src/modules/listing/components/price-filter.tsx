"use client"

import { useState } from "react"

import { FilterSection } from "@/modules/listing/components/filter-section"
import type { FilterChange } from "@/modules/listing/components/filter-types"
import { Slider, type SliderRange } from "@/components/ui/slider"
import { formatPrice, toMinorUnits } from "@/lib/money"

interface PriceFilterProps {
  range: { min: number; max: number }
  minPrice: number | null
  maxPrice: number | null
  onChange: FilterChange
}

export function PriceFilter({
  range,
  minPrice,
  maxPrice,
  onChange,
}: PriceFilterProps) {
  const clamp = (value: number) =>
    Math.min(range.max, Math.max(range.min, value))
  const fromUrl: SliderRange = [
    clamp(minPrice ?? range.min),
    clamp(maxPrice ?? range.max),
  ]
  const [value, setValue] = useState(fromUrl)

  // Sync the value when the URL changes from outside the slider (for example, clearing filters),
  // without recreating the slider, so focus isn't lost while using the keyboard
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
          onValueChange={(next) => setValue(next)}
          onValueCommitted={([low, high]) => {
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
