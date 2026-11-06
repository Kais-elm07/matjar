"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import type { SearchCardData } from "@/lib/catalog/types"
import { formatPrice } from "@/lib/money"
import { placeholderIds } from "@/lib/placeholders"
import { productPath, searchPath } from "@/lib/routes"
import { cn } from "@/lib/utils"

interface SearchSuggestionsProps {
  /** What the visitor typed, trimmed */
  query: string
  results: SearchCardData[]
  /** Whether the search index is still loading, failed to load, or is ready */
  status: "loading" | "error" | "ready"
  listId: string
  /** The id of the suggestion at a position, which the field points to with aria-activedescendant */
  optionId: (index: number) => string
  /** The suggestion chosen with the arrow keys, or -1 */
  activeIndex: number
  /** Called when a suggestion or the link to all results is clicked */
  onNavigate: () => void
}

/**
 * The list under the search field: the matching products while typing, placeholders while the search
 * index loads, a message when nothing matches, and a link to the results page.
 */
export function SearchSuggestions({
  query,
  results,
  status,
  listId,
  optionId,
  activeIndex,
  onNavigate,
}: SearchSuggestionsProps) {
  return (
    <>
      {status === "error" ? (
        <p className="p-4 text-sm text-muted-foreground">
          تعذّر تحميل الاقتراحات. اضغط Enter للبحث.
        </p>
      ) : status === "loading" ? (
        // Skeletons shaped like the suggestions while the search index loads, instead of a spinner
        <div role="status" className="space-y-1 py-2">
          <span className="sr-only">جارٍ البحث...</span>
          {placeholderIds("suggestion", 3).map((key) => (
            <div
              key={key}
              aria-hidden
              className="flex items-center gap-3 px-3 py-2"
            >
              <Skeleton className="size-12 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <p className="p-4 text-sm">
          لا توجد منتجات تطابق «{query}». جرّب كلمة أخرى.
        </p>
      ) : (
        <ul id={listId} role="listbox" aria-label="اقتراحات البحث">
          {results.map((product, index) => (
            <li
              key={product.slug}
              id={optionId(index)}
              role="option"
              aria-selected={index === activeIndex}
            >
              <Link
                href={productPath(product.slug)}
                tabIndex={-1}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 transition-colors hover:bg-muted",
                  index === activeIndex && "bg-muted"
                )}
              >
                <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {product.image && (
                    <Image
                      src={product.image.src}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 text-sm font-medium">
                    {product.name}
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {product.priceVaries && "من "}
                    {formatPrice(product.price)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link
        href={searchPath(query)}
        tabIndex={-1}
        onClick={onNavigate}
        className="flex items-center justify-between gap-2 border-t px-3 py-3 text-sm font-medium text-primary transition-colors hover:bg-muted"
      >
        عرض كل النتائج لـ «{query}»
        <ArrowRightIcon className="size-4 rtl:rotate-180" aria-hidden />
      </Link>
    </>
  )
}
