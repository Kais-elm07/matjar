import { PRODUCT_GRID } from "@/components/product/product-styles"
import { Skeleton } from "@/components/ui/skeleton"
import { placeholderIds } from "@/lib/placeholders"
import { cn } from "@/lib/utils"

interface ProductGridSkeletonProps {
  count?: number
  className?: string
}

/** A skeleton in the light surface color (surface-muted), in the same shape as the grid, while loading. */
export function ProductGridSkeleton({
  count = 8,
  className,
}: ProductGridSkeletonProps) {
  return (
    <ul className={cn(PRODUCT_GRID, className)} aria-hidden>
      {placeholderIds("product", count).map((id) => (
        <li key={id} className="space-y-3 rounded-xl bg-card p-3">
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
