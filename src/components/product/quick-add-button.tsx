"use client"

import Link from "next/link"
import { ShoppingCartIcon } from "lucide-react"

import { useAddToCart } from "@/components/cart/use-add-to-cart"
import { Button, buttonVariants } from "@/components/ui/button"
import type { ProductCard } from "@/lib/catalog/types"
import { cn } from "@/lib/utils"

/**
 * زر البطاقة الظاهر دائماً: إضافة مباشرة للسلة للمنتج ذي الخيار الواحد،
 * و"اختر الخيارات" للمنتج متعدد المقاسات أو الألوان.
 */
export function QuickAddButton({
  product,
  className,
}: {
  product: ProductCard
  className?: string
}) {
  const addToCart = useAddToCart()
  const classes = cn("relative z-10 w-full text-sm", className)

  if (!product.inStock) {
    return (
      <Button variant="outline" size="xl" disabled className={classes}>
        نفد من المخزون
      </Button>
    )
  }

  const quick = product.quickAdd
  if (!quick) {
    return (
      <Link
        href={`/product/${product.slug}`}
        className={cn(
          buttonVariants({ variant: "outline", size: "xl" }),
          classes
        )}
      >
        اختر الخيارات
        <span className="sr-only">: {product.name}</span>
      </Link>
    )
  }

  return (
    <Button
      variant="cta"
      size="xl"
      className={classes}
      onClick={() =>
        addToCart(
          {
            sku: quick.sku,
            slug: product.slug,
            name: product.name,
            image: product.image
              ? { src: product.image.src, alt: product.image.alt }
              : null,
            options: {},
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            stock: quick.stock,
          },
          1
        )
      }
    >
      <ShoppingCartIcon data-icon="inline-start" aria-hidden />
      أضف للسلة
      <span className="sr-only">: {product.name}</span>
    </Button>
  )
}
