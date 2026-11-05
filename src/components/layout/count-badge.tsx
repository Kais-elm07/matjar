import { cn } from "@/lib/utils"

interface CountBadgeProps {
  count: number
  className?: string
}

/** A small orange counter with a surface-colored ring, over the icon (DESIGN.md: counter-badge). */
export function CountBadge({ count, className }: CountBadgeProps) {
  if (count <= 0) return null
  return (
    <span
      aria-hidden
      className={cn(
        "absolute end-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[11px] leading-none font-bold text-primary-foreground tabular-nums ring-2 ring-card",
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  )
}
