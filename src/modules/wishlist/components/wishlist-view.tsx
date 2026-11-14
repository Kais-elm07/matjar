"use client"

import { useEffect } from "react"
import Link from "next/link"
import { HeartIcon, WifiOffIcon } from "lucide-react"

import { ProductGrid } from "@/modules/catalog/components/product-grid"
import { ProductGridSkeleton } from "@/modules/catalog/components/product-grid-skeleton"
import { EmptyState } from "@/components/shared/empty-state"
import { Button, buttonVariants } from "@/components/ui/button"
import { PRODUCT_FORMS, pluralize } from "@/lib/arabic-plural"
import type { SearchCardData } from "@/modules/catalog/types"
import { useSearchIndex } from "@/modules/search/use-search-index"
import { useWishlistRestored } from "@/lib/state/hydration"
import { useWishlistStore } from "@/modules/wishlist/store"
import { toast } from "@/lib/toast"

/**
 * The wishlist page: cards for the products saved in the browser.
 * The card data comes from the published search index, so it shows the latest price and stock, and a
 * saved product that is no longer in the index is dropped from the wishlist.
 */
export function WishlistView() {
  const restored = useWishlistRestored()
  const slugs = useWishlistStore((state) => state.slugs)
  const prune = useWishlistStore((state) => state.prune)
  const { data, error, retry } = useSearchIndex(restored && slugs.length > 0)

  // A product that left the store after it was saved leaves the wishlist too, so the counter in the
  // header matches the cards on this page
  useEffect(() => {
    if (!data) return
    const dropped = prune(new Set(data.map((product) => product.slug)))
    if (dropped > 0) {
      toast("بعض ما حفظته لم يعد في المتجر، فحذفناه من المفضلة.")
    }
  }, [data, prune])

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
  // Until the effect above has dropped them, saved products that left the store are skipped
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
