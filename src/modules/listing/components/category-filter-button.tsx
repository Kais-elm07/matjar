"use client"

import { cn } from "@/lib/utils"

interface CategoryFilterButtonProps {
  label: string
  count?: number
  active: boolean
  onClick: () => void
}

export function CategoryFilterButton({
  label,
  count,
  active,
  onClick,
}: CategoryFilterButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex min-h-11 w-full items-center justify-between gap-2 rounded-lg px-2 text-start text-sm transition-colors hover:bg-muted",
        active && "bg-primary/12 font-bold text-primary hover:bg-primary/16"
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
