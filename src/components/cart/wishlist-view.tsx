"use client"

import Link from "next/link"
import { HeartIcon, WifiOffIcon } from "lucide-react"

import { ProductGrid } from "@/components/product/product-grid"
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton"
import { EmptyState } from "@/components/shared/empty-state"
import { Button, buttonVariants } from "@/components/ui/button"
import { PRODUCT_FORMS, pluralize } from "@/lib/arabic-plural"
import type { SearchCardData } from "@/lib/catalog/types"
import { useSearchIndex } from "@/lib/search/use-search-index"
import { useWishlistRestored } from "@/lib/state/hydration"
import { useWishlistStore } from "@/lib/state/wishlist"

/**
 * The wishlist page: cards for the products saved in the browser.
 * The card data comes from the published search index, so it shows the latest price and stock.
 */
export function WishlistView() {
  const restored = useWishlistRestored()
  const slugs = useWishlistStore((state) => state.slugs)
  const { data, error, retry } = useSearchIndex(restored && slugs.length > 0)

  if (!restored || (slugs.length > 0 && !data && !error)) {
    return <ProductGridSkeleton count={4} />
  }

  if (slugs.length === 0) {
    return (
      <EmptyState
        icon={HeartIcon}
        title="لا توجد منتجات في المفضلة"
        description="اضغط على القلب في أي منتج لحفظه هنا والعودة إليه لاحقاً."
      >
        <Link
          href="/products"
          className={buttonVariants({ variant: "cta", size: "xl" })}
        >
          تصفّح المنتجات
        </Link>
      </EmptyState>
    )
  }

  if (error || !data) {
    return (
      <EmptyState
        icon={WifiOffIcon}
        title="تعذّر تحميل المفضلة"
        description="تأكد من اتصالك بالإنترنت ثم أعد المحاولة."
      >
        <Button variant="outline" size="xl" onClick={retry}>
          إعادة المحاولة
        </Button>
      </EmptyState>
    )
  }

  const bySlug = new Map(data.map((product) => [product.slug, product]))
  // A product removed from the store after it was saved is not shown
  const products = slugs
    .map((slug) => bySlug.get(slug))
    .filter((product): product is SearchCardData => Boolean(product))

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
        {pluralize(products.length, PRODUCT_FORMS)}
      </p>
      <ProductGrid products={products} />
    </>
  )
}
