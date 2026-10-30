import { Suspense } from "react"
import type { Metadata } from "next"

import { SearchSkeleton, SearchView } from "@/components/search/search-view"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategoryOptions } from "@/lib/catalog/catalog"

export const metadata: Metadata = {
  title: "البحث",
  // صفحات نتائج البحث لا تُفهرس في محركات البحث، لكن روابطها تُتبع
  robots: { index: false, follow: true },
}

export default function SearchPage() {
  return (
    <div className="page-container py-5 md:py-8">
      <Suspense
        fallback={
          <>
            <Skeleton className="mb-6 h-9 w-64" />
            <SearchSkeleton />
          </>
        }
      >
        <SearchView categories={getCategoryOptions()} />
      </Suspense>
    </div>
  )
}
