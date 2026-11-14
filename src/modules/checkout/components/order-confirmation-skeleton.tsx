import { Skeleton } from "@/components/ui/skeleton"
import { placeholderIds } from "@/lib/placeholders"

/** Placeholder for an order's page while the server reads the order, in the same layout as OrderConfirmation. */
export function OrderConfirmationSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6" aria-hidden>
      <div className="flex flex-col items-center">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="mt-4 h-8 w-56" />
        <Skeleton className="mt-3 h-4 w-72 max-w-full" />
        <Skeleton className="mt-4 h-9 w-44 rounded-full" />
      </div>
      <Skeleton className="h-16 rounded-2xl" />
      <div className="grid gap-4 md:grid-cols-2">
        {placeholderIds("details", 2).map((id) => (
          <Skeleton key={id} className="h-48 rounded-2xl" />
        ))}
      </div>
      <div className="space-y-4 rounded-2xl border p-5">
        <Skeleton className="h-5 w-24" />
        {placeholderIds("line", 2).map((id) => (
          <div key={id} className="flex items-center gap-3">
            <Skeleton className="size-14 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
