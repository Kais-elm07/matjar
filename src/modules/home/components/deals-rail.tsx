import { DealItem } from "@/modules/home/components/deal-item"
import { ProductCard } from "@/modules/catalog/components/product-card"
import { RAIL_ITEM } from "@/modules/catalog/components/product-styles"
import { Carousel } from "@/components/shared/carousel"
import { SectionHeading } from "@/components/shared/section-heading"
import type { DealCard } from "@/modules/catalog/types"

interface DealsRailProps {
  products: DealCard[]
}

/** "عروض لفترة محدودة" (Limited-time deals): products with a real end date, each with a countdown above it. */
export function DealsRail({ products }: DealsRailProps) {
  if (products.length === 0) return null
  return (
    <section aria-labelledby="deals-heading">
      <Carousel
        label="عروض لفترة محدودة"
        header={
          <SectionHeading
            id="deals-heading"
            title="عروض لفترة محدودة"
            href="/products?sale=1"
            linkLabel="كل العروض"
          />
        }
      >
        {products.map((product) => (
          <DealItem
            key={product.slug}
            endsAt={product.saleEndsAt}
            className={RAIL_ITEM}
          >
            <ProductCard product={product} />
          </DealItem>
        ))}
      </Carousel>
    </section>
  )
}
