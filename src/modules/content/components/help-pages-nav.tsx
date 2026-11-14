import Link from "next/link"

import { getContentPages } from "@/modules/content/pages"
import { contentPagePath } from "@/lib/routes"
import { cn } from "@/lib/utils"

interface HelpPagesNavProps {
  /** The page being shown, which the list marks as the current one */
  currentSlug: string
}

/** The list of static pages beside the page on desktop, with the current one in blue. */
export function HelpPagesNav({ currentSlug }: HelpPagesNavProps) {
  return (
    <nav
      aria-label="صفحات المساعدة"
      className="hidden rounded-2xl border bg-card p-2 lg:sticky lg:top-32 lg:block"
    >
      <ul>
        {getContentPages().map((item) => (
          <li key={item.slug}>
            <Link
              href={contentPagePath(item.slug)}
              aria-current={item.slug === currentSlug ? "page" : undefined}
              className={cn(
                "flex h-11 items-center rounded-lg px-3 text-sm outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
                item.slug === currentSlug &&
                  "bg-primary/12 font-bold text-primary hover:bg-primary/16"
              )}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
