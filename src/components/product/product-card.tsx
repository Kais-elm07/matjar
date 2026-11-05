import Image from "next/image"
import Link from "next/link"
import { ImageOffIcon } from "lucide-react"

import { DiscountBadge } from "@/components/product/discount-badge"
import { Price } from "@/components/product/price"
import { QuickAddButton } from "@/components/product/quick-add-button"
import { WishlistButton } from "@/components/product/wishlist-button"
import type { ProductCardData } from "@/lib/catalog/types"
import { productPath } from "@/lib/routes"
import { cn } from "@/lib/utils"

/** Image width by screen size: two columns on mobile, 3 on tablets and 4 on desktop. */
const IMAGE_SIZES =
  "(min-width: 1280px) 300px, (min-width: 1024px) 24vw, (min-width: 640px) 32vw, 48vw"

interface ProductCardProps {
  product: ProductCardData
  /** Images visible at the top of the page load first */
  priority?: boolean
}

/**
 * Product card: a dark surface with 12px corners and no shadow, holding the image square with the
 * discount badge and heart button on it, then the category name in gray, the name and the orange
 * price, and the round cart button in the card's bottom corner
 * (DESIGN.md: product-card and card-cart-button).
 */
export function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <article className="group relative flex h-full flex-col rounded-xl bg-card p-2.5 md:p-3">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        {product.image ? (
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes={IMAGE_SIZES}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            className={cn(
              "object-cover transition-transform duration-300 group-hover:scale-[1.03]",
              !product.inStock && "opacity-60"
            )}
          />
        ) : (
          <ImageOffIcon
            aria-hidden
            className="absolute inset-0 m-auto size-10 text-muted-foreground/50"
          />
        )}
        <DiscountBadge
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          className="absolute start-2 top-2"
        />
        <WishlistButton
          slug={product.slug}
          name={product.name}
          className="absolute end-0.5 top-0.5"
        />
        {!product.inStock && (
          <span className="absolute inset-x-2 bottom-2 rounded-sm bg-background/85 py-1 text-center text-xs font-bold">
            نفد من المخزون
          </span>
        )}
      </div>

      {/* Space on the end side for the round cart button */}
      <div className="mt-3 flex flex-1 flex-col gap-1 pe-12">
        {product.categoryName && (
          <p className="text-xs text-muted-foreground">
            {product.categoryName}
          </p>
        )}
        <h3 className="line-clamp-2 text-sm leading-6 font-bold">
          {/* The link covers the whole card for easier tapping */}
          <Link
            href={productPath(product.slug)}
            className="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50 focus-visible:after:ring-inset"
          >
            {product.name}
          </Link>
        </h3>
        <Price
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          from={product.priceVaries}
          className="mt-auto pt-1"
        />
      </div>

      {/* Only the button's data, so the full card data isn't repeated in the page for each button */}
      <QuickAddButton
        product={{
          slug: product.slug,
          name: product.name,
          image: product.image,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          inStock: product.inStock,
          quickAdd: product.quickAdd,
        }}
      />
    </article>
  )
}
