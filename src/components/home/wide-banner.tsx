import Image from "next/image"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import type { ProductBanner } from "@/lib/catalog/types"
import { formatPrice } from "@/lib/money"
import { cn } from "@/lib/utils"

interface WideBannerProps {
  banner: ProductBanner
}

/** A wide product banner: its photo fills the banner, with the text on the start side over a dark gradient. */
export function WideBanner({ banner }: WideBannerProps) {
  return (
    // The banner's box is inside the section, so the section itself has no style of its own
    // (the home page renders it later with section-later)
    <section aria-labelledby="wide-banner-heading">
      <div className="relative overflow-hidden rounded-xl border bg-muted">
        {banner.image && (
          <Image
            src={banner.image.src}
            alt=""
            fill
            sizes="(min-width: 1280px) 1232px, 100vw"
            className="object-cover"
          />
        )}
        {/* The site is always right to left: the dark gradient starts on the right, where the text is,
            and fades toward the photo on the left */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-l from-background/95 via-background/70 to-background/25"
        />
        <div className="relative flex min-h-64 flex-col justify-center gap-3 p-6 md:min-h-80 md:max-w-xl md:p-12">
          {banner.tag && (
            <p className="inline-flex self-start rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
              {banner.tag}
            </p>
          )}
          <h2
            id="wide-banner-heading"
            className="text-2xl leading-snug font-bold md:text-4xl"
          >
            {banner.title}
          </h2>
          {banner.text && (
            <p className="text-base text-foreground/85">{banner.text}</p>
          )}
          <p className="flex flex-wrap items-baseline gap-x-2 text-base">
            {banner.priceVaries ? "يبدأ من" : "بسعر"}
            <span className="text-2xl font-bold text-primary md:text-3xl">
              {formatPrice(banner.price)}
            </span>
            {banner.compareAtPrice && (
              <>
                <span className="sr-only">بدلاً من</span>
                <del className="text-muted-foreground">
                  {formatPrice(banner.compareAtPrice)}
                </del>
              </>
            )}
          </p>
          <Link
            href={banner.href}
            className={cn(
              buttonVariants({ variant: "cta", size: "xl" }),
              "mt-1 self-start"
            )}
          >
            تسوّق الآن
          </Link>
        </div>
      </div>
    </section>
  )
}
