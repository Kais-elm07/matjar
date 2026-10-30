"use client"

import Link from "next/link"
import { HeartIcon, WifiOffIcon } from "lucide-react"

import {
  ProductGrid,
  ProductGridSkeleton,
} from "@/components/product/product-grid"
import { EmptyState } from "@/components/store/empty-state"
import { Button, buttonVariants } from "@/components/ui/button"
import { PRODUCT_FORMS, pluralize } from "@/lib/arabic-plural"
import type { ProductCard } from "@/lib/catalog/types"
import { useSearchIndex } from "@/lib/catalog/use-search-index"
import { useWishlistRestored } from "@/lib/store/hydration"
import { useWishlistStore } from "@/lib/store/wishlist"

/**
 * صفحة المفضلة: بطاقات المنتجات المحفوظة في المتصفح.
 * بيانات البطاقات تأتي من فهرس البحث المنشور، فتظهر بأحدث سعر ومخزون.
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
  // منتج حُذف من المتجر بعد حفظه لا يُعرض
  const products = slugs
    .map((slug) => bySlug.get(slug))
    .filter((product): product is ProductCard => Boolean(product))

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
        {pluralize(products.length, PRODUCT_FORMS)}
      </p>
      <ProductGrid products={products} />
    </>
  )
}
