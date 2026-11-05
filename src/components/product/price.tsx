import { discountPercent, formatPrice } from "@/lib/catalog/money"
import { cn } from "@/lib/utils"

interface PriceProps {
  price: number
  compareAtPrice?: number | null
  /** Shows "من" before the price, when the variants have different prices */
  from?: boolean
  size?: "default" | "lg"
  className?: string
}

/**
 * The price, with the pre-discount price struck through if there is one.
 * "من" (from) shows when the variants have different prices.
 */
export function Price({
  price,
  compareAtPrice,
  from = false,
  size = "default",
  className,
}: PriceProps) {
  const discount = discountPercent(price, compareAtPrice)

  return (
    <p
      className={cn(
        "flex flex-wrap items-baseline gap-x-2 gap-y-0.5",
        className
      )}
    >
      <span
        data-slot="price"
        className={cn(
          "font-bold text-primary",
          size === "lg" ? "text-2xl md:text-3xl" : "text-base"
        )}
      >
        {from && (
          <span className="text-xs font-medium text-muted-foreground">من </span>
        )}
        {formatPrice(price)}
      </span>
      {discount && compareAtPrice ? (
        <>
          <span className="sr-only">بدلاً من</span>
          <del
            className={cn(
              "text-muted-foreground",
              size === "lg" ? "text-base" : "text-xs"
            )}
          >
            {formatPrice(compareAtPrice)}
          </del>
        </>
      ) : null}
    </p>
  )
}
