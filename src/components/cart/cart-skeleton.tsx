import { Skeleton } from "@/components/ui/skeleton"
import { placeholderIds } from "@/lib/placeholders"

/** Placeholder for the cart page until the saved cart is restored, in the same layout. */
export function CartSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"
      aria-hidden
    >
      <div className="space-y-4 rounded-xl border p-4">
        {placeholderIds("line", 2).map((id) => (
          <div key={id} className="flex gap-3">
            <Skeleton className="size-20 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-9 w-28 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )
}
