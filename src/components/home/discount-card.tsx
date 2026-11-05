import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DiscountCardProps {
  /** معرّف العنوان، يربطه القسم المحيط به عبر aria-labelledby */
  headingId: string
  /** أكبر نسبة خصم بين المنتجات المخفضة، أو 0 إن لم توجد عروض */
  maxDiscount: number
  className?: string
}

/** بطاقة الخصم بجانب مربعات العروض: نسبة الخصم الحقيقية القصوى وزر "تسوّق العروض". */
export function DiscountCard({
  headingId,
  maxDiscount,
  className,
}: DiscountCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center gap-3 rounded-xl border bg-card p-6 md:p-8",
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
