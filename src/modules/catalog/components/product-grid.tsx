import { ProductCard } from "@/modules/catalog/components/product-card"
import { PRODUCT_GRID } from "@/modules/catalog/components/product-styles"
import type { ProductCardData } from "@/modules/catalog/types"
import { cn } from "@/lib/utils"

interface ProductGridProps {
  products: ProductCardData[]
  /** How many cards from the start load their images first (the ones above the fold) */
  priorityCount?: number
  className?: string
}

/** A grid of product cards: two columns on phones, 3 on tablets and 4 on desktops. */
export function ProductGrid({
  products,
  priorityCount = 0,
  className,
}: ProductGridProps) {
  return (
    <ul className={cn(PRODUCT_GRID, className)}>
      {products.map((product, index) => (
        <li key={product.slug}>
          <ProductCard product={product} priority={index < priorityCount} />
        </li>
      ))}
    </ul>
  )
}
