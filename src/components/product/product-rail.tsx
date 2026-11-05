import { ProductCard } from "@/components/product/product-card"
import { RAIL_ITEM } from "@/components/product/product-styles"
import { Carousel } from "@/components/shared/carousel"
import type { ProductCardData } from "@/lib/catalog/types"

interface ProductRailProps {
  products: ProductCardData[]
  label: string
  header?: React.ReactNode
}

/** A product row that swipes horizontally, with two scroll buttons in its header on desktop. */
export function ProductRail({ products, label, header }: ProductRailProps) {
  return (
    <Carousel label={label} header={header}>
      {products.map((product) => (
        <li key={product.slug} className={RAIL_ITEM}>
          <ProductCard product={product} />
        </li>
      ))}
    </Carousel>
  )
}
