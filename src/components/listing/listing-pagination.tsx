"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** A page link, or a gap ("…") after the page `after`. */
type PageItem = { type: "page"; page: number } | { type: "gap"; after: number }

/** أرقام الصفحات المعروضة: الأولى والأخيرة وما حول الحالية، مع فواصل. */
function visiblePages(page: number, pageCount: number) {
  const pages = new Set([1, pageCount, page - 1, page, page + 1])
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= pageCount)
    .sort((a, b) => a - b)
  const items: PageItem[] = []
  let previous = 0
  for (const current of sorted) {
    if (previous > 0 && current - previous > 1) {
      items.push({ type: "gap", after: previous })
    }
    items.push({ type: "page", page: current })
    previous = current
  }
  return items
}

/**
 * ترقيم الصفحات: روابط حقيقية (تعمل مع الفتح في تبويب جديد)،
 * والنقر العادي ينتقل فوراً داخل الصفحة دون إعادة تحميل.
 */
export function ListingPagination({
  page,
  pageCount,
  hrefFor,
  onNavigate,
}: {
  page: number
  pageCount: number
  hrefFor: (page: number) => string
  onNavigate: (page: number) => void
}) {
  if (pageCount <= 1) return null

  const handle =
    (target: number) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }
      event.preventDefault()
      onNavigate(target)
    }

  return (
    <nav aria-label="التنقل بين الصفحات" className="mt-10 flex justify-center">
      <ul className="flex flex-wrap items-center justify-center gap-1">
        {page > 1 && (
          <li>
            <a
              href={hrefFor(page - 1)}
              onClick={handle(page - 1)}
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
            >
              <ChevronLeftIcon className="rtl:rotate-180" aria-hidden />
              السابق
            </a>
          </li>
        )}
        {visiblePages(page, pageCount).map((item) =>
          item.type === "gap" ? (
            <li
              key={`gap-after-${item.after}`}
              aria-hidden
              className="px-1 text-muted-foreground"
            >
              …
            </li>
          ) : (
            <li key={item.page}>
              <a
                href={hrefFor(item.page)}
                onClick={handle(item.page)}
                aria-current={item.page === page ? "page" : undefined}
                aria-label={`الصفحة ${item.page}`}
                className={cn(
                  buttonVariants({
                    variant: item.page === page ? "default" : "ghost",
                    size: "icon-lg",
                  }),
                  "tabular-nums"
                )}
              >
                {item.page}
              </a>
            </li>
          )
        )}
        {page < pageCount && (
          <li>
            <a
              href={hrefFor(page + 1)}
              onClick={handle(page + 1)}
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
            >
              التالي
              <ChevronRightIcon className="rtl:rotate-180" aria-hidden />
            </a>
          </li>
        )}
      </ul>
    </nav>
  )
}
