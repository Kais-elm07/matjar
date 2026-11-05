import Image from "next/image"
import Link from "next/link"

import { IMAGE_SHADE } from "@/components/home/banner-styles"
import type { ProductBanner } from "@/lib/catalog/types"
import { formatPrice } from "@/lib/money"
import { cn } from "@/lib/utils"

interface PromoTileProps {
  banner: ProductBanner
  className?: string
}

/** A product image tile in the promo grid: the photo fills it, with the badge, title and price at its bottom. */
export function PromoTile({ banner, className }: PromoTileProps) {
  return (
    <Link
      href={banner.href}
      className={cn(
        "group relative block overflow-hidden rounded-xl border bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring",
        className
      )}
    >
      {banner.image && (
        <Image
          src={banner.image.src}
          alt=""
          fill
          sizes="(min-width: 768px) 30vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      )}
      <span aria-hidden className={IMAGE_SHADE} />
      <span className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-1.5 p-4">
        {banner.tag && (
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
            {banner.tag}
          </span>
        )}
        <span className="text-base leading-snug font-bold md:text-lg">
          {banner.title}
        </span>
        <span className="text-sm text-foreground/85">
          {banner.priceVaries ? "يبدأ من " : "بسعر "}
          <span className="font-bold text-primary">
            {formatPrice(banner.price)}
          </span>
        </span>
      </span>
    </Link>
  )
}
