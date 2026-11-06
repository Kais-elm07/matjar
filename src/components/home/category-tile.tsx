import Link from "next/link"

import { PhotoBox } from "@/components/shared/photo-box"
import { PRODUCT_FORMS, pluralize } from "@/lib/arabic-plural"
import type { Category } from "@/lib/catalog/types"
import { categoryPath } from "@/lib/routes"

interface CategoryTileProps {
  category: Category
}

/**
 * A category tile: a surface card with 16px corners and a thin border, whose photo box shows the cut-out of
 * the category's cover photo on a wash of its tone, with the name and product count under the box
 * (DESIGN.md: category-tile). On hover it rises like a product card.
 */
export function CategoryTile({ category }: CategoryTileProps) {
  return (
    <Link
      href={categoryPath(category.slug)}
      className="group flex h-full flex-col gap-2.5 rounded-2xl border bg-card p-2 pb-3 transition-[translate,border-color] duration-200 outline-none hover:-translate-y-0.5 hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring"
    >
      {category.image ? (
        <PhotoBox
          photo={category.image}
          alt=""
          sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 42vw"
          className="aspect-square"
          imageClassName="group-hover:scale-105"
        />
      ) : (
        <span className="block aspect-square rounded-xl bg-muted" />
      )}
      <span className="px-1">
        <span className="block text-sm font-bold">{category.name}</span>
        <span className="block text-xs text-muted-foreground">
          {pluralize(category.productCount, PRODUCT_FORMS)}
        </span>
      </span>
    </Link>
  )
}
