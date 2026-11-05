import { DiscountCard } from "@/components/home/discount-card"
import { PromoTile } from "@/components/home/promo-tile"
import type { ProductBanner } from "@/lib/catalog/types"
import { cn } from "@/lib/utils"

const HEADING_ID = "discount-heading"

interface PromoGridProps {
  promos: ProductBanner[]
  /** The largest real discount percentage in the store, or 0 */
  maxDiscount: number
}

/**
 * The promo grid: two image tiles, one above the other, and a tall tile beside them, then the discount card.
 * With fewer than three cards, the tiles show in a single row beside the discount card.
 */
export function PromoGrid({ promos, maxDiscount }: PromoGridProps) {
  if (promos.length === 0) return null
  const discount = (className: string) => (
    <DiscountCard
      headingId={HEADING_ID}
      maxDiscount={maxDiscount}
      className={className}
    />
  )

  if (promos.length < 3) {
    return (
      <section
        aria-labelledby={HEADING_ID}
        className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4"
      >
        {promos.map((promo) => (
          <PromoTile key={promo.href} banner={promo} className="aspect-[4/3]" />
        ))}
        {discount(
          cn(
            "col-span-2",
            promos.length === 1 ? "md:col-span-2" : "md:col-span-1"
          )
        )}
      </section>
    )
  }

  const [first, second, tall] = promos
  return (
    <section
      aria-labelledby={HEADING_ID}
      className="grid grid-cols-2 gap-3 md:grid-cols-[1fr_1fr_1.35fr] md:grid-rows-2 md:gap-4"
    >
      <PromoTile banner={first} className="aspect-[4/3]" />
      <PromoTile banner={tall} className="row-span-2 md:col-start-2" />
      <PromoTile
        banner={second}
        className="aspect-[4/3] md:col-start-1 md:row-start-2"
      />
      {discount(
        "col-span-2 md:col-span-1 md:col-start-3 md:row-span-2 md:row-start-1"
      )}
    </section>
  )
}
