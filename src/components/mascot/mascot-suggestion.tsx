import Image from "next/image"
import Link from "next/link"

import { useAddToCart } from "@/components/cart/use-add-to-cart"
import { SMALL_TARGET } from "@/components/mascot/mascot-styles"
import { Price } from "@/modules/catalog/components/price"
import { Button, buttonVariants } from "@/components/ui/button"
import type { SimilarProduct } from "@/modules/catalog/types"
import { productPath } from "@/lib/routes"
import { quickAddLine } from "@/lib/state/cart"
import { cn } from "@/lib/utils"

interface MascotSuggestionProps {
  product: SimilarProduct
}

/**
 * A product Najm suggests: its photo, name and price, and "أضف" (Add), which adds a single-option product
 * straight to the cart (Najm catches it too), or "اختر" (Choose), which opens the page of a product with options.
 */
export function MascotSuggestion({ product }: MascotSuggestionProps) {
  const addToCart = useAddToCart()
  const line = quickAddLine(product)
  const href = productPath(product.slug)

  return (
    <li className="flex items-center gap-2.5">
      <span className="relative size-12 shrink-0 overflow-hidden rounded-xl border bg-muted">
        {product.image && (
          <Image
            src={product.image.src}
            alt=""
            fill
            sizes="48px"
            className="object-contain p-1"
          />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <Link
          href={href}
          className="line-clamp-2 text-xs leading-5 font-medium hover:underline"
        >
          {product.name}
        </Link>
        <Price
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          from={product.priceVaries}
        />
      </span>
      {line ? (
        <Button
          variant="cta"
          size="lg"
          aria-label={`أضف للسلة: ${product.name}`}
          className={SMALL_TARGET}
          onClick={(event) =>
            addToCart(line, 1, { origin: event.currentTarget })
          }
        >
          أضف
        </Button>
      ) : (
        <Link
          href={href}
          aria-label={`اختر الخيارات: ${product.name}`}
          className={cn(buttonVariants({ size: "lg" }), SMALL_TARGET)}
        >
          اختر
        </Link>
      )}
    </li>
  )
}
