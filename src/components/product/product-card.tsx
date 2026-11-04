import Image from "next/image"
import Link from "next/link"
import { ImageOffIcon } from "lucide-react"

import { DiscountBadge, Price } from "@/components/product/price"
import { QuickAddButton } from "@/components/product/quick-add-button"
import { WishlistButton } from "@/components/product/wishlist-button"
import type { ProductCard as ProductCardData } from "@/lib/catalog/types"
import { cn } from "@/lib/utils"

/** عرض الصورة حسب الشاشة: عمودان على الجوال، و3 على الأجهزة اللوحية، و4 على الحاسوب. */
const IMAGE_SIZES =
  "(min-width: 1280px) 300px, (min-width: 1024px) 24vw, (min-width: 640px) 32vw, 48vw"

/**
 * بطاقة المنتج: بلا إطار ولا ظل (الشبكة تفصلها بخطوط رفيعة): الصورة تملأ البطاقة،
 * والقلب وشارة الخصم فوقها، ثم اسم الفئة بالرمادي والاسم والسعر الكحلي،
 * وزر الإضافة للسلة ظاهر دائماً في الأسفل.
 */
export function ProductCard({
  product,
  priority = false,
}: {
  product: ProductCardData
  /** الصور الظاهرة في أعلى الصفحة تُحمَّل أولاً */
  priority?: boolean
}) {
  return (
    <article className="group relative flex h-full flex-col bg-background p-3 md:p-4">
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
          className="absolute end-0 top-0"
        />
        {!product.inStock && (
          <span className="absolute inset-x-2 bottom-2 rounded-sm bg-background/90 py-1 text-center text-xs font-bold">
            نفد من المخزون
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        {product.categoryName && (
          <p className="text-xs text-muted-foreground">
            {product.categoryName}
          </p>
        )}
        <h3 className="line-clamp-2 text-sm leading-6 font-medium">
          {/* الرابط يغطي البطاقة كلها لتسهيل اللمس */}
          <Link
            href={`/product/${product.slug}`}
            className="outline-none after:absolute after:inset-0 focus-visible:after:ring-3 focus-visible:after:ring-ring/50 focus-visible:after:ring-inset"
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

      <QuickAddButton product={product} className="mt-3" />
    </article>
  )
}
