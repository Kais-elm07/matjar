import { ProductRail } from "@/components/product/product-rail"
import { SectionHeading } from "@/components/shared/section-heading"
import type { ProductCardData } from "@/lib/catalog/types"

interface BestSellersProps {
  products: ProductCardData[]
}

/** The best sellers: a row of the most popular products, with a link to all products. */
export function BestSellers({ products }: BestSellersProps) {
  return (
    <section aria-labelledby="best-sellers-heading">
      <ProductRail
        label="الأكثر مبيعاً"
        header={
          <SectionHeading
            id="best-sellers-heading"
            title="الأكثر مبيعاً"
            href="/products"
          />
        }
        products={products}
      />
    </section>
  )
}
