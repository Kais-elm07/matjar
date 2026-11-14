import { Suspense } from "react"
import type { Metadata } from "next"

import { ListingSkeleton } from "@/components/listing/listing-skeleton"
import { SearchView } from "@/components/search/search-view"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategoryOptions } from "@/modules/catalog/queries"

export const metadata: Metadata = {
  title: "البحث",
  // Search result pages are not indexed by search engines, but their links are followed
  robots: { index: false, follow: true },
}

export default async function SearchPage() {
  const categories = await getCategoryOptions()
  return (
    <div className="page-container py-5 md:py-8">
      <Suspense
        fallback={
          <>
            <Skeleton className="mb-6 h-9 w-64" />
            <ListingSkeleton />
          </>
        }
      >
        <SearchView categories={categories} />
      </Suspense>
    </div>
  )
}
