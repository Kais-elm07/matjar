import Link from "next/link"

import { ToneBanner } from "@/modules/home/components/tone-banner"
import { ProductRail } from "@/modules/catalog/components/product-rail"
import { buttonVariants } from "@/components/ui/button"
import type { ProductCardData } from "@/modules/catalog/types"

interface NewArrivalsProps {
  products: ProductCardData[]
}

/**
 * "وصل حديثاً" (New arrivals): a wide stage with the newest product in the light of its tone, then the
 * product row, then a centered button.
 */
export function NewArrivals({ products }: NewArrivalsProps) {
  if (products.length === 0) return null

  return (
    <section aria-labelledby="new-arrivals-heading" className="space-y-5">
      <ToneBanner photo={products[0].image}>
        <p className="flex items-center gap-2 text-sm font-bold">
          <span
            aria-hidden
            className="size-2 rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)]"
          />
          {products[0].name}
        </p>
        <h2
          id="new-arrivals-heading"
          className="text-4xl font-bold md:text-6xl"
        >
          وصل حديثاً
        </h2>
        <p className="max-w-md text-base text-foreground/85 md:text-lg">
          تشكيلة جديدة تصل باستمرار، فلا تفوّتها.
        </p>
      </ToneBanner>
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
