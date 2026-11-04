import { DealItem } from "@/components/home/deal-item"
import { ProductCard } from "@/components/product/product-card"
import { RAIL_ITEM } from "@/components/product/product-grid"
import { Carousel } from "@/components/store/carousel"
import { SectionHeading } from "@/components/store/section-heading"
import type { ProductCardData } from "@/lib/catalog/types"

/** "عروض لفترة محدودة": منتجات لها تاريخ نهاية حقيقي، فوق كل منها عدّاد تنازلي. */
export function DealsRail({ products }: { products: ProductCardData[] }) {
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
            endsAt={product.saleEndsAt ?? ""}
            className={RAIL_ITEM}
          >
            <ProductCard product={product} />
          </DealItem>
        ))}
      </Carousel>
    </section>
  )
}
