"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { WifiOffIcon } from "lucide-react"

import { SearchBox } from "@/components/layout/search-box"
import { ListingView } from "@/components/listing/listing-view"
import { ProductGridSkeleton } from "@/components/product/product-grid"
import { EmptyState } from "@/components/store/empty-state"
import { Button } from "@/components/ui/button"
import type { CategoryOption } from "@/lib/catalog/types"
import { useSearchIndex } from "@/lib/catalog/use-search-index"

/** صفحة نتائج البحث: تقرأ الكلمة من الرابط وتبحث في الفهرس داخل المتصفح. */
export function SearchView({ categories }: { categories: CategoryOption[] }) {
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
                  className="inline-flex h-9 items-center rounded-full border px-4 text-sm transition-colors hover:border-primary hover:text-primary"
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
          <Button variant="outline" size="lg" onClick={retry}>
            إعادة المحاولة
          </Button>
        </EmptyState>
      ) : data ? (
        <ListingView products={data} categories={categories} search />
      ) : (
        <SearchSkeleton />
      )}
    </>
  )
}

export function SearchSkeleton() {
  return (
    <div className="lg:ms-[17rem]">
      <ProductGridSkeleton className="lg:grid-cols-3 xl:grid-cols-4" />
    </div>
  )
}
