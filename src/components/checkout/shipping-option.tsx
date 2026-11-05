import type { LucideIcon } from "lucide-react"

import { formatShipping } from "@/lib/money"
import { cn } from "@/lib/utils"

interface ShippingOptionProps extends React.ComponentProps<"input"> {
  icon: LucideIcon
  title: string
  description: string
  /** The fee in the smallest unit, 0 for free, or null to show no price */
  price: number | null
  disabled?: boolean
}

/** A shipping option as a clickable card; the selected one has an orange border. */
export function ShippingOption({
  icon: Icon,
  title,
  description,
  price,
  disabled = false,
  ...input
}: ShippingOptionProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors has-checked:border-primary has-checked:bg-primary/5 has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <input
        type="radio"
        disabled={disabled}
        className="size-4 shrink-0 accent-primary"
        {...input}
      />
      <Icon className="size-5 shrink-0 text-primary" aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block font-bold">{title}</span>
        <span className="block text-sm text-muted-foreground">
          {description}
        </span>
      </span>
      <span className="shrink-0 text-sm font-bold text-primary">
        {price === null ? "" : formatShipping(price)}
      </span>
    </label>
  )
}
