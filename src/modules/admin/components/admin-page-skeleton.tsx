import { Skeleton } from "@/components/ui/skeleton"
import { ADMIN_CARD } from "@/modules/admin/components/admin-styles"
import { placeholderIds } from "@/lib/placeholders"
import { cn } from "@/lib/utils"

/** Placeholder for a panel page while the server reads the database: its title, then a list of cards. */
export function AdminPageSkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-11 w-32 rounded-full" />
      </div>
      <div className="space-y-3">
        {placeholderIds("item", 4).map((id) => (
          <div key={id} className={cn(ADMIN_CARD, "flex items-center gap-4")}>
            <Skeleton className="size-16 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
