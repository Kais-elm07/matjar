import { ProductCard } from "@/components/product/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { ProductCard as ProductCardData } from "@/lib/catalog/types"
import { cn } from "@/lib/utils"

const GRID =
  "grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4 lg:gap-x-5"

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

/** هيكل رمادي بنفس شكل الشبكة أثناء التحميل. */
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
        <li key={index} className="space-y-3">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-1/3" />
        </li>
      ))}
    </ul>
  )
}

/**
 * صف منتجات: يُسحب أفقياً على الجوال، وشبكة على الشاشات الأكبر.
 * على الحاسوب يظهر أول 4 منتجات فقط، وعلى اللوحي أول 6.
 */
export function ProductRail({ products }: { products: ProductCardData[] }) {
  return (
    <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-x-4 sm:gap-y-7 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 lg:gap-x-5 [&::-webkit-scrollbar]:hidden lg:[&>li:nth-child(n+5)]:hidden sm:[&>li:nth-child(n+7)]:hidden">
      {products.map((product) => (
        <li
          key={product.slug}
          className="w-[44%] shrink-0 snap-start sm:w-auto"
        >
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}
