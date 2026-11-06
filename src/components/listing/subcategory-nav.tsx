import Image from "next/image"
import Link from "next/link"

import type { Category } from "@/lib/catalog/types"
import { categoryPath } from "@/lib/routes"

interface SubcategoryNavProps {
  subcategories: Category[]
}

/** A category's subcategories as a row of chips, each with its photo and product count. Nothing shows without any. */
export function SubcategoryNav({ subcategories }: SubcategoryNavProps) {
  if (subcategories.length === 0) return null
  return (
    <nav
      aria-label="الفئات الفرعية"
      className="-mx-4 mb-8 no-scrollbar overflow-x-auto px-4 pb-1"
    >
      <ul className="flex gap-3">
        {subcategories.map((child) => (
          <li key={child.slug} className="shrink-0">
            <Link
              href={categoryPath(child.slug)}
              className="flex items-center gap-3 rounded-full border bg-card py-1.5 ps-1.5 pe-4 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
            >
              {child.image && (
                <span className="relative size-9 overflow-hidden rounded-full bg-muted">
                  <Image
                    src={child.image}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </span>
              )}
              {child.name}
              <span className="text-xs text-muted-foreground tabular-nums">
                {child.productCount}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
