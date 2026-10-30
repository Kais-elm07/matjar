import { discountPercent, formatPrice } from "@/lib/catalog/money"
import { cn } from "@/lib/utils"

/** السعر مع السعر قبل الخصم مشطوباً إن وُجد. "من" تظهر عندما تختلف أسعار المتغيرات. */
export function Price({
  price,
  compareAtPrice,
  from = false,
  size = "default",
  className,
}: {
  price: number
  compareAtPrice?: number | null
  from?: boolean
  size?: "default" | "lg"
  className?: string
}) {
  const discount = discountPercent(price, compareAtPrice)

  return (
    <p
      className={cn(
        "flex flex-wrap items-baseline gap-x-2 gap-y-0.5",
        className
      )}
    >
      <span
        className={cn(
          "font-bold",
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

/** شارة نسبة الخصم، مثل "-20%". */
export function DiscountBadge({
  price,
  compareAtPrice,
  className,
}: {
  price: number
  compareAtPrice?: number | null
  className?: string
}) {
  const discount = discountPercent(price, compareAtPrice)
  if (!discount) return null
  return (
    <span
      className={cn(
        "inline-flex rounded-md bg-destructive px-1.5 py-0.5 text-xs font-bold text-white",
        className
      )}
    >
      <span className="sr-only">خصم </span>
      <span dir="ltr">-{discount}%</span>
    </span>
  )
}
