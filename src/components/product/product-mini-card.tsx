import Image from "next/image"
import Link from "next/link"

import { Price } from "@/components/product/price"
import type { ProductCardData } from "@/lib/catalog/types"

interface ProductMiniCardProps {
  product: ProductCardData
}

/** بطاقة منتج أفقية صغيرة بلون السطح: الصورة بجانب الاسم والسعر، لقسم "الرائج الآن". */
export function ProductMiniCard({ product }: ProductMiniCardProps) {
  return (
    <article className="group relative flex items-center gap-4 rounded-xl bg-card p-2 transition-colors hover:bg-muted/60">
      <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted">
        {product.image && (
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
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
            className="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
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
