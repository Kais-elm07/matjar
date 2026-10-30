import Image from "next/image"
import Link from "next/link"

import { Price } from "@/components/product/price"
import type { ProductCard } from "@/lib/catalog/types"

/** بطاقة منتج أفقية صغيرة: الصورة بجانب الاسم والسعر، لقسم "الرائج الآن". */
export function ProductMiniCard({ product }: { product: ProductCard }) {
  return (
    <article className="group relative flex items-center gap-3 rounded-lg border bg-card p-3 transition-[border-color,box-shadow] hover:border-foreground/20 hover:shadow-md">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-background">
        {product.image && (
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        {product.categoryName && (
          <p className="text-xs text-muted-foreground">
            {product.categoryName}
          </p>
        )}
        <h3 className="line-clamp-2 text-sm leading-6 font-medium">
          <Link
            href={`/product/${product.slug}`}
            className="outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
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
