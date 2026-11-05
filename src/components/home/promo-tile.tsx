import Image from "next/image"
import Link from "next/link"

import { formatPrice } from "@/lib/catalog/money"
import type { ProductBanner } from "@/lib/catalog/types"
import { cn } from "@/lib/utils"

import { IMAGE_SHADE } from "./banner-styles"

interface PromoTileProps {
  banner: ProductBanner
  className?: string
  sizes?: string
}

/** مربع صورة لمنتج في شبكة العروض: الصورة تملؤه، وفي أسفله الشارة والعنوان والسعر. */
export function PromoTile({
  banner,
  className,
  sizes = "(min-width: 768px) 30vw, 50vw",
}: PromoTileProps) {
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
          sizes={sizes}
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
