"use client"

import Link from "next/link"
import { ShoppingBagIcon } from "lucide-react"

import { useAddToCart } from "@/components/cart/use-add-to-cart"
import type { ProductCardData } from "@/lib/catalog/types"
import { cn } from "@/lib/utils"

/** Only what the button needs, so the full card data isn't sent with every button on the page. */
export type QuickAddProduct = Pick<
  ProductCardData,
  | "slug"
  | "name"
  | "image"
  | "price"
  | "compareAtPrice"
  | "inStock"
  | "quickAdd"
>

/**
 * A round orange button in the card's bottom corner on the end side, ringed in the background
 * color so the card looks cut out around it (DESIGN.md: card-cart-button). The focus ring is
 * white so it shows on the orange.
 */
const CIRCLE =
  "absolute bottom-0 end-0 z-10 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground ring-[6px] ring-background transition-colors outline-none hover:bg-primary/90 focus-visible:ring-foreground [&_svg]:size-5"

interface QuickAddButtonProps {
  product: QuickAddProduct
  className?: string
}

/**
 * The card's always-visible button: adds a single-option product straight to the cart, and opens
 * the product page to pick a size or color for a multi-option one. A sold-out product has no button.
 */
export function QuickAddButton({ product, className }: QuickAddButtonProps) {
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
            image: product.image,
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
