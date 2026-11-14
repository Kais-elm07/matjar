import Link from "next/link"

import { IMAGE_SHADE } from "@/modules/home/components/banner-styles"
import { PhotoBox } from "@/components/shared/photo-box"
import type { ProductBanner } from "@/modules/catalog/types"
import { formatPrice } from "@/lib/money"
import { cn } from "@/lib/utils"

interface PromoTileProps {
  banner: ProductBanner
  className?: string
}

/**
 * A product tile in the promo grid: a photo box washed with the product's tone, with the cut-out floating in
 * its upper part, and the badge, title and price at its bottom over a dark gradient (DESIGN.md: Promo grid).
 */
export function PromoTile({ banner, className }: PromoTileProps) {
  return (
    <Link
      href={banner.href}
      className={cn(
        "group relative block overflow-hidden rounded-2xl border bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring",
        className
      )}
    >
      {banner.image && (
        <PhotoBox
          photo={banner.image}
          alt=""
          sizes="(min-width: 768px) 30vw, 50vw"
          className="absolute inset-0 rounded-none"
          imageClassName="group-hover:scale-105"
          cutoutClassName="p-[12%] pb-[34%]"
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
