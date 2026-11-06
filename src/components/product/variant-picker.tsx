"use client"

import {
  getColorHex,
  type OptionGroup,
  type VariantOptions,
} from "@/lib/catalog/options"
import type { OptionState } from "@/lib/catalog/variant-selection"
import { cn } from "@/lib/utils"

interface VariantPickerProps {
  groups: OptionGroup[]
  selected: VariantOptions
  /** Whether a value can be chosen with the other chosen options */
  stateOf: (groupName: string, value: string) => OptionState
  onSelect: (groupName: string, value: string) => void
}

/**
 * The option buttons, such as size and color: a sold-out value is crossed out, and a value that makes
 * no existing variant with the other choices is disabled.
 */
export function VariantPicker({
  groups,
  selected,
  stateOf,
  onSelect,
}: VariantPickerProps) {
  return (
    <>
      {groups.map((group) => (
        <fieldset key={group.name} className="space-y-3">
          <legend className="mb-3 text-sm font-bold">
            {group.name}:{" "}
            <span className="font-normal text-muted-foreground">
              {selected[group.name]}
            </span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {group.values.map((value) => {
              const state = stateOf(group.name, value)
              const isSelected = selected[group.name] === value
              const color = group.isColor ? getColorHex(value) : null
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={isSelected}
                  disabled={state === "unavailable"}
                  onClick={() => onSelect(group.name, value)}
                  className={cn(
                    "relative inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors hover:border-foreground/50 disabled:cursor-not-allowed disabled:opacity-40",
                    isSelected &&
                      "border-primary bg-primary text-primary-foreground hover:border-primary",
                    state === "sold-out" &&
                      "text-muted-foreground line-through decoration-1"
                  )}
                >
                  {color && (
                    <span
                      aria-hidden
                      className="size-5 rounded-full border border-foreground/20"
                      style={{ backgroundColor: color }}
                    />
                  )}
                  {value}
                  {state === "sold-out" && (
                    <span className="sr-only">(نفد)</span>
                  )}
                </button>
              )
            })}
          </div>
        </fieldset>
      ))}
    </>
  )
}
