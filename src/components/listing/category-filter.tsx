"use client"

import { CategoryButton } from "@/components/listing/category-button"
import { FilterSection } from "@/components/listing/filter-section"
import type { CategoryOption } from "@/lib/catalog/types"

interface CategoryFilterProps {
  categories: CategoryOption[]
  counts: Record<string, number>
  selected: string | null
  onSelect: (category: string | null) => void
}

export function CategoryFilter({
  categories,
  counts,
  selected,
  onSelect,
}: CategoryFilterProps) {
  const visible = categories.filter((category) => counts[category.slug])
  const roots = visible.filter((category) => !category.parentSlug)

  return (
    <FilterSection title="الفئة">
      <ul className="space-y-0.5">
        <li>
          <CategoryButton
            label="كل الفئات"
            active={!selected}
            onClick={() => onSelect(null)}
          />
        </li>
        {roots.map((root) => {
          const children = visible.filter(
            (category) => category.parentSlug === root.slug
          )
          return (
            <li key={root.slug}>
              <CategoryButton
                label={root.name}
                count={counts[root.slug]}
                active={selected === root.slug}
                onClick={() => onSelect(root.slug)}
              />
              {children.length > 0 && (
                <ul className="ms-3 border-s ps-2">
                  {children.map((child) => (
                    <li key={child.slug}>
                      <CategoryButton
                        label={child.name}
                        count={counts[child.slug]}
                        active={selected === child.slug}
                        onClick={() => onSelect(child.slug)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </FilterSection>
  )
}
