"use client"

import { FilterSection } from "@/modules/listing/components/filter-section"
import type { OptionFacet } from "@/modules/listing/filter"
import { cn } from "@/lib/utils"

interface OptionFilterProps {
  group: OptionFacet
  selected: string[]
  onToggle: (value: string) => void
}

export function OptionFilter({ group, selected, onToggle }: OptionFilterProps) {
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
                  "border-primary bg-primary/12 font-bold text-primary hover:border-primary"
              )}
            >
              {color && (
                <span
                  aria-hidden
                  className="size-4 rounded-full border border-foreground/20"
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
