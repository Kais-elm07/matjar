"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { WifiOffIcon } from "lucide-react"

import { ListingSkeleton } from "@/components/listing/listing-skeleton"
import { ListingView } from "@/components/listing/listing-view"
import { SearchBox } from "@/components/search/search-box"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import type { CategoryOption } from "@/lib/catalog/types"
import { useSearchIndex } from "@/lib/search/use-search-index"

interface SearchViewProps {
  categories: CategoryOption[]
}

/** The search results page: reads the term from the URL and searches the index in the browser. */
export function SearchView({ categories }: SearchViewProps) {
  const searchParams = useSearchParams()
  const query = (searchParams.get("q") ?? "").trim()
  const { data, error, retry } = useSearchIndex(Boolean(query))

  if (!query) {
    return (
      <div className="mx-auto max-w-xl py-8 text-center md:py-14">
        <h1 className="text-2xl font-bold md:text-3xl">ابحث في المتجر</h1>
        <p className="mt-2 text-muted-foreground">
          اكتب اسم المنتج أو الفئة أو حتى اللون الذي تريده.
        </p>
        <SearchBox className="mt-6 text-start" autoFocus />
        <ul className="mt-6 flex flex-wrap justify-center gap-2">
          {categories
            .filter((category) => !category.parentSlug)
            .map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  className="inline-flex h-11 items-center rounded-full border px-4 text-sm transition-colors hover:border-primary hover:text-primary"
                >
                  {category.name}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    )
  }

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">
        نتائج البحث عن «{query}»
      </h1>
      {error ? (
        <EmptyState
          icon={WifiOffIcon}
          title="تعذّر تحميل نتائج البحث"
          description="تحقق من اتصالك بالإنترنت ثم حاول مرة أخرى."
        >
          <Button variant="outline" size="xl" onClick={retry}>
            إعادة المحاولة
          </Button>
        </EmptyState>
      ) : data ? (
        <ListingView products={data} categories={categories} search />
      ) : (
        <ListingSkeleton />
      )}
    </>
  )
}
