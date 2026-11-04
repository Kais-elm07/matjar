import { Skeleton } from "@/components/ui/skeleton"

/** هيكل صفحة الطلب حتى تُستعاد السلة من المتصفح، بنفس تخطيط النموذج والملخص. */
export function CheckoutSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]"
      aria-hidden
    >
      <div className="space-y-6">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-48 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-72 rounded-xl" />
    </div>
  )
}
