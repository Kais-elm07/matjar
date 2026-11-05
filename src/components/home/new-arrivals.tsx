import Image from "next/image"
import Link from "next/link"

import { ProductRail } from "@/components/product/product-rail"
import { buttonVariants } from "@/components/ui/button"
import type { ProductCardData } from "@/lib/catalog/types"

interface NewArrivalsProps {
  products: ProductCardData[]
}

/** "وصل حديثاً": لافتة كبيرة بصورة أحدث منتج، ثم صف المنتجات، ثم زر في المنتصف. */
export function NewArrivals({ products }: NewArrivalsProps) {
  if (products.length === 0) return null
  const image = products[0].image

  return (
    <section aria-labelledby="new-arrivals-heading" className="space-y-5">
      <div className="relative overflow-hidden rounded-xl border bg-muted">
        {image && (
          <Image
            src={image.src}
            alt=""
            fill
            sizes="(min-width: 1280px) 1232px, 100vw"
            className="object-cover"
          />
        )}
        <div aria-hidden className="absolute inset-0 bg-background/40" />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background/95 via-background/50 to-transparent"
        />
        <div className="relative flex min-h-56 flex-col items-center justify-center gap-3 px-6 py-10 text-center md:min-h-80">
          <h2
            id="new-arrivals-heading"
            className="text-4xl font-bold md:text-6xl"
          >
            وصل حديثاً
          </h2>
          <p className="max-w-md text-base text-foreground/85 md:text-lg">
            تشكيلة جديدة تصل باستمرار، فلا تفوّتها.
          </p>
        </div>
      </div>
      <ProductRail label="وصل حديثاً" products={products} />
      <div className="flex justify-center">
        <Link
          href="/products?sort=newest"
          className={buttonVariants({ variant: "cta", size: "xl" })}
        >
          استكشف الجديد
        </Link>
      </div>
    </section>
  )
}
