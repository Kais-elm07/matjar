import Link from "next/link"

import { Price } from "@/modules/catalog/components/price"
import { PhotoBox } from "@/components/shared/photo-box"
import type { ProductCardData } from "@/modules/catalog/types"
import { productPath } from "@/lib/routes"

interface ProductMiniCardProps {
  product: ProductCardData
}

/**
 * A small horizontal product card in the surface color with a thin border: the photo box beside the name and
 * price, for the "الرائج الآن" (Trending now) section.
 */
export function ProductMiniCard({ product }: ProductMiniCardProps) {
  return (
    <article className="group relative flex items-center gap-4 rounded-2xl border bg-card p-2 transition-[border-color] duration-200 hover:border-primary/40">
      {product.image ? (
        <PhotoBox
          photo={product.image}
          alt={product.image.alt}
          sizes="96px"
          className="size-24 shrink-0"
          imageClassName="group-hover:scale-105"
          cutoutClassName="p-2.5 pb-3.5"
        />
      ) : (
        <div className="size-24 shrink-0 rounded-xl bg-muted" />
      )}
      <div className="min-w-0 flex-1 space-y-1">
        {product.categoryName && (
          <p className="text-xs text-muted-foreground">
            {product.categoryName}
          </p>
        )}
        <h3 className="line-clamp-2 text-sm leading-6 font-medium">
          <Link
            href={productPath(product.slug)}
            className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
          >
            {product.name}
          </Link>
        </h3>
        <Price
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          from={product.priceVaries}
        />
      </div>
    </article>
  )
}
