import { ProductCard } from "@/components/product/product-card"
import { Carousel } from "@/components/store/carousel"
import type { ProductCardData } from "@/lib/catalog/types"

import { RAIL_ITEM } from "./product-styles"

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
