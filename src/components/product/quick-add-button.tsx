"use client"

import Link from "next/link"
import { ShoppingBagIcon } from "lucide-react"

import { useAddToCart } from "@/components/cart/use-add-to-cart"
import type { ProductCard } from "@/lib/catalog/types"
import { cn } from "@/lib/utils"

/**
 * زر دائري برتقالي في ركن البطاقة السفلي من جهة النهاية، محاط بحلقة بلون الخلفية
 * فتبدو البطاقة مقطوعة حوله (DESIGN.md: card-cart-button). حلقة التركيز بيضاء لتظهر فوق البرتقالي.
 */
const CIRCLE =
  "absolute bottom-0 end-0 z-10 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground ring-[6px] ring-background transition-colors outline-none hover:bg-primary/90 focus-visible:ring-foreground [&_svg]:size-5"

/**
 * زر البطاقة الظاهر دائماً: إضافة مباشرة للسلة للمنتج ذي الخيار الواحد،
 * وفتح صفحة المنتج لاختيار المقاس أو اللون للمنتج متعدد الخيارات. المنتج النافد بلا زر.
 */
export function QuickAddButton({
  product,
  className,
}: {
  product: ProductCard
  className?: string
}) {
  const addToCart = useAddToCart()
  if (!product.inStock) return null

  const quick = product.quickAdd
  if (!quick) {
    return (
      <Link
        href={`/product/${product.slug}`}
        aria-label={`اختر الخيارات: ${product.name}`}
        className={cn(CIRCLE, className)}
      >
        <ShoppingBagIcon aria-hidden />
      </Link>
    )
  }

  return (
    <button
      type="button"
      aria-label={`أضف للسلة: ${product.name}`}
      className={cn(CIRCLE, className)}
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
      <ShoppingBagIcon aria-hidden />
    </button>
  )
}
