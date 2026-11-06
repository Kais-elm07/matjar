import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { ToneBanner } from "@/components/home/tone-banner"
import { buttonVariants } from "@/components/ui/button"
import type { ProductBanner } from "@/lib/catalog/types"
import { formatPrice } from "@/lib/money"
import { cn } from "@/lib/utils"

interface WideBannerProps {
  banner: ProductBanner
}

/** A wide product banner: a wide stage with the product in the light of its tone, and its text, price and button. */
export function WideBanner({ banner }: WideBannerProps) {
  return (
    // The banner's box is inside the section, so the section itself has no style of its own
    // (the home page renders it later with section-later)
    <section aria-labelledby="wide-banner-heading">
      <ToneBanner photo={banner.image}>
        {banner.tag && (
          <p className="flex items-center gap-2 text-sm font-bold">
            <span
              aria-hidden
              className="size-2 rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)]"
            />
            {banner.tag}
          </p>
        )}
        <h2
          id="wide-banner-heading"
          className="text-2xl leading-snug font-bold text-balance md:text-4xl"
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
          <ArrowRightIcon className="size-5 rtl:rotate-180" aria-hidden />
        </Link>
      </ToneBanner>
    </section>
  )
}
