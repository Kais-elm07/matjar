import { Skeleton } from "@/components/ui/skeleton"
import { placeholderIds } from "@/lib/placeholders"

/** Checkout page skeleton until the cart is restored from the browser, matching the form and summary layout. */
export function CheckoutSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]"
      aria-hidden
    >
      <div className="space-y-6">
        {placeholderIds("section", 3).map((id) => (
          <Skeleton key={id} className="h-48 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  )
}
