import { discountPercent } from "@/lib/money"
import { cn } from "@/lib/utils"

interface DiscountBadgeProps {
  price: number
  compareAtPrice?: number | null
  className?: string
}

/** The discount percentage badge, such as "-20%". */
export function DiscountBadge({
  price,
  compareAtPrice,
  className,
}: DiscountBadgeProps) {
  const discount = discountPercent(price, compareAtPrice)
  if (!discount) return null
  return (
    <span
      className={cn(
        "inline-flex rounded-sm bg-primary px-1.5 py-0.5 text-xs font-bold text-primary-foreground",
        className
      )}
    >
      <span className="sr-only">خصم </span>
      <span dir="ltr">-{discount}%</span>
    </span>
  )
}
