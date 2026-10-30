import Image from "next/image"
import Link from "next/link"

import { BANNER_THEME } from "@/components/home/banner-theme"
import { buttonVariants } from "@/components/ui/button"
import { formatPrice } from "@/lib/catalog/money"
import type { CategoryBanner, ProductBanner } from "@/lib/catalog/types"
import { cn } from "@/lib/utils"

/** بطاقة عرض لمنتج: شارة وعنوان وسعر ورابط، وصورة المنتج في جهة النهاية. */
export function PromoCard({ banner }: { banner: ProductBanner }) {
  const theme = BANNER_THEME[banner.theme]
  return (
    <Link
      href={banner.href}
      className={cn(
        "group flex min-h-40 items-center gap-4 overflow-hidden rounded-lg p-5 outline-none focus-visible:ring-3 focus-visible:ring-ring",
        theme.surface
      )}
    >
      <div className="min-w-0 flex-1 space-y-2">
        {banner.tag && (
          <p
            className={cn(
              "inline-flex rounded-sm px-2 py-0.5 text-xs font-bold",
              theme.tag
            )}
          >
            {banner.tag}
          </p>
        )}
        <h3 className="text-lg leading-snug font-bold">{banner.title}</h3>
        <p className={cn("text-sm", theme.muted)}>
          {banner.priceVaries ? "يبدأ من " : "بسعر "}
          <span className={cn("text-base font-bold", theme.price)}>
            {formatPrice(banner.price)}
          </span>
        </p>
        <span className="inline-block text-sm font-bold underline underline-offset-4">
          تسوّق الآن
        </span>
      </div>
      {banner.image && (
        <div className="relative size-28 shrink-0 overflow-hidden rounded-md bg-background md:size-32">
          <Image
            src={banner.image.src}
            alt=""
            fill
            sizes="128px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
    </Link>
  )
}

/** بطاقة عرض لفئة: عنوان ووصف وزر، وصورة الفئة في جهة النهاية. */
export function SpotlightCard({ banner }: { banner: CategoryBanner }) {
  const theme = BANNER_THEME[banner.theme]
  return (
    <Link
      href={banner.href}
      className={cn(
        "group flex min-h-48 items-center gap-5 overflow-hidden rounded-lg p-6 outline-none focus-visible:ring-3 focus-visible:ring-ring md:p-8",
        theme.surface
      )}
    >
      <div className="min-w-0 flex-1 space-y-2">
        <h3 className="text-xl leading-snug font-bold md:text-2xl">
          {banner.title}
        </h3>
        {banner.text && (
          <p className={cn("text-sm md:text-base", theme.muted)}>
            {banner.text}
          </p>
        )}
        <span
          className={cn(
            buttonVariants({ variant: theme.button, size: "lg" }),
            "mt-2 px-5"
          )}
        >
          تسوّق الآن
        </span>
      </div>
      {banner.image && (
        <div className="relative size-32 shrink-0 overflow-hidden rounded-md bg-background md:size-40">
          <Image
            src={banner.image}
            alt=""
            fill
            sizes="160px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
    </Link>
  )
}

/** بطاقة عريضة لمنتج، قبل آراء العملاء. */
export function WideBanner({ banner }: { banner: ProductBanner }) {
  const theme = BANNER_THEME[banner.theme]
  return (
    <section
      aria-labelledby="wide-banner-heading"
      className={cn(
        "grid items-center gap-6 overflow-hidden rounded-lg px-6 py-8 sm:grid-cols-[minmax(0,1fr)_auto] md:px-12",
        theme.surface
      )}
    >
      <div className="max-w-2xl space-y-3">
        {banner.tag && (
          <p
            className={cn(
              "inline-flex rounded-sm px-2.5 py-1 text-xs font-bold",
              theme.tag
            )}
          >
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
          <p className={cn("text-base", theme.muted)}>{banner.text}</p>
        )}
        <p className="flex flex-wrap items-baseline gap-x-2 text-base">
          {banner.priceVaries ? "يبدأ من" : "بسعر"}
          <span className={cn("text-2xl font-bold md:text-3xl", theme.price)}>
            {formatPrice(banner.price)}
          </span>
          {banner.compareAtPrice && (
            <>
              <span className="sr-only">بدلاً من</span>
              <del className={theme.muted}>
                {formatPrice(banner.compareAtPrice)}
              </del>
            </>
          )}
        </p>
        <Link
          href={banner.href}
          className={cn(
            buttonVariants({ variant: theme.button, size: "xl" }),
            "mt-1"
          )}
        >
          تسوّق الآن
        </Link>
      </div>
      {banner.image && (
        <div className="relative hidden size-56 overflow-hidden rounded-lg bg-background sm:block md:size-64">
          <Image
            src={banner.image.src}
            alt={banner.image.alt}
            fill
            sizes="256px"
            className="object-cover"
          />
        </div>
      )}
    </section>
  )
}
