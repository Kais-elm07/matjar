import { SpotlightCard } from "@/components/home/spotlight-card"
import type { CategoryBanner } from "@/lib/catalog/types"

interface SpotlightGridProps {
  spotlights: CategoryBanner[]
}

/** The category spotlight cards, two side by side on desktop. Nothing shows when there are none. */
export function SpotlightGrid({ spotlights }: SpotlightGridProps) {
  if (spotlights.length === 0) return null
  return (
    <section aria-label="أقسام مميزة">
      <ul className="grid gap-4 md:grid-cols-2">
        {spotlights.map((spotlight) => (
          <li key={spotlight.href}>
            <SpotlightCard banner={spotlight} />
          </li>
        ))}
      </ul>
    </section>
  )
}
