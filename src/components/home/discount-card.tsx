import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DiscountCardProps {
  /** The heading's id, which the surrounding section links to through aria-labelledby */
  headingId: string
  /** The largest discount percentage among discounted products, or 0 if there are no deals */
  maxDiscount: number
  className?: string
}

/** Discount card beside the promo tiles: the highest real discount and a "تسوّق العروض" (Shop the deals) button. */
export function DiscountCard({
  headingId,
  maxDiscount,
  className,
}: DiscountCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center gap-3 rounded-2xl border bg-card p-6 md:p-8",
        className
      )}
    >
      <p className="text-sm font-medium text-muted-foreground">عروض مختارة</p>
      <h2
        id={headingId}
        className="text-2xl leading-snug font-bold md:text-3xl"
      >
        {maxDiscount > 0 ? (
          <>
            خصومات تصل إلى{" "}
            <span className="text-primary" dir="ltr">
              {maxDiscount}%
            </span>
          </>
        ) : (
          "خصومات على منتجات مختارة"
        )}
      </h2>
      <p className="text-sm leading-7 text-muted-foreground md:text-base">
        وفّر أكثر على منتجات مختارة من كل الأقسام، والدفع عند الاستلام كالمعتاد.
      </p>
      <Link
        href="/products?sale=1"
        className={cn(
          buttonVariants({ variant: "cta", size: "xl" }),
          "mt-2 self-start"
        )}
      >
        تسوّق العروض
      </Link>
    </div>
  )
}
