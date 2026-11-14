import Link from "next/link"
import { ImageOffIcon } from "lucide-react"

import { DiscountBadge } from "@/modules/catalog/components/discount-badge"
import { Price } from "@/modules/catalog/components/price"
import { QuickAddButton } from "@/modules/cart/components/quick-add-button"
import { WishlistButton } from "@/modules/wishlist/components/wishlist-button"
import { PhotoBox } from "@/components/shared/photo-box"
import type { ProductCardData } from "@/modules/catalog/types"
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
 * Product card: a dark surface with 16px corners and a thin border, holding the photo box washed with the
 * product's tone, with the discount badge and heart button on it, then the category name in gray, the name
 * and the blue price, and the round cart button in the card's bottom corner. On hover the card rises and its
 * border takes a hint of blue (DESIGN.md: product-card and card-cart-button).
 */
export function ProductCard({ product, priority = false }: ProductCardProps) {
  const overlays = (
    <>
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
    </>
  )

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border bg-card p-2.5 transition-[translate,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/40 md:p-3">
      {product.image ? (
        <PhotoBox
          photo={product.image}
          alt={product.image.alt}
          sizes={IMAGE_SIZES}
          priority={priority}
          className="aspect-square"
          imageClassName={cn(
            "group-hover:scale-105",
            !product.inStock && "opacity-60"
          )}
        >
          {overlays}
        </PhotoBox>
      ) : (
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          <ImageOffIcon
            aria-hidden
            className="absolute inset-0 m-auto size-10 text-muted-foreground/50"
          />
          {overlays}
        </div>
      )}

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
            className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50 focus-visible:after:ring-inset"
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

      {/* Only the button's data, so the full card data isn't repeated in the page for each button,
          and only the image's path and description, which the cart keeps */}
      <QuickAddButton
        product={{
          slug: product.slug,
          name: product.name,
          image: product.image
            ? { src: product.image.src, alt: product.image.alt }
            : null,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          inStock: product.inStock,
          quickAdd: product.quickAdd,
        }}
      />
    </article>
  )
}
