import { ProductCard } from "@/components/product/product-card"
import { Carousel } from "@/components/store/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import type { ProductCardData } from "@/lib/catalog/types"
import { cn } from "@/lib/utils"

/** شبكة بطاقات داكنة مستقلة بفجوات بينها: عمودان على الجوال، و3 على اللوحي، و4 على الحاسوب. */
const GRID = "grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4"

export function ProductGrid({
  products,
  priorityCount = 0,
  className,
}: {
  products: ProductCardData[]
  priorityCount?: number
  className?: string
}) {
  return (
    <ul className={cn(GRID, className)}>
      {products.map((product, index) => (
        <li key={product.slug}>
          <ProductCard product={product} priority={index < priorityCount} />
        </li>
      ))}
    </ul>
  )
}

/** هيكل بلون السطح الفاتح بنفس شكل الشبكة أثناء التحميل. */
export function ProductGridSkeleton({
  count = 8,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <ul className={cn(GRID, className)} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="space-y-3 rounded-xl bg-card p-3">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-4 w-4/5" />
          <div className="flex items-end justify-between">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="size-12 rounded-full" />
          </div>
        </li>
      ))}
    </ul>
  )
}

/** عرض البطاقة في الصفوف: بطاقتان وجزء على الجوال، و3 على اللوحي، و4 على الحاسوب، و5 على الشاشات العريضة. */
export const RAIL_ITEM =
  "w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23.5%] xl:w-[18.8%]"

/** صف منتجات يُسحب أفقياً، مع زرّي تمرير في رأسه على الحاسوب. */
export function ProductRail({
  products,
  label,
  header,
}: {
  products: ProductCardData[]
  label: string
  header?: React.ReactNode
}) {
  return (
    <Carousel label={label} header={header}>
      {products.map((product) => (
        <li key={product.slug} className={RAIL_ITEM}>
          <ProductCard product={product} />
        </li>
      ))}
    </Carousel>
  )
}
