import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { StageVisual } from "@/components/shared/stage-visual"
import { buttonVariants } from "@/components/ui/button"
import type { ProductBanner } from "@/lib/catalog/types"
import { formatPrice } from "@/lib/money"
import { cn } from "@/lib/utils"

interface HeroSlideProps {
  slide: ProductBanner
  /** Whether the photo loads now: the first slide's at once, the others once the page has loaded */
  photo: ProductBanner["image"]
  /** The first slide's photo is the largest element on the first screen */
  priority: boolean
}

/**
 * One slide of the hero (DESIGN.md: Hero): the product's cut-out on its platform, and beside it on the start
 * side (above it on a phone) the eyebrow, the headline, the description, the price and the blue button.
 * The text sits on the dark side of the stage, so it stays readable whatever the product's tone.
 */
export function HeroSlide({ slide, photo, priority }: HeroSlideProps) {
  return (
    <div className="page-container grid items-center gap-x-10 gap-y-2 pt-3 pb-16 md:min-h-[min(72svh,42rem)] md:grid-cols-2 md:pt-8 md:pb-32">
      <div className="flex flex-col items-start gap-4">
        {slide.tag && (
          <p className="flex items-center gap-2 text-sm font-bold">
            <span
              aria-hidden
              className="size-2 rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)]"
            />
            {slide.tag}
          </p>
        )}
        <h2 className="text-4xl leading-[1.25] font-bold text-balance md:text-5xl md:leading-[1.15] lg:text-6xl">
          {slide.title}
        </h2>
        {slide.text && (
          <p className="max-w-xl text-base text-foreground/85 md:text-lg">
            {slide.text}
          </p>
        )}
        <p className="flex flex-wrap items-baseline gap-x-2 text-sm text-foreground/85">
          {slide.priceVaries ? "يبدأ من" : "بسعر"}
          <span className="text-2xl font-bold text-primary md:text-3xl">
            {formatPrice(slide.price)}
          </span>
          {slide.compareAtPrice && (
            <>
              <span className="sr-only">بدلاً من</span>
              <del className="text-base text-muted-foreground">
                {formatPrice(slide.compareAtPrice)}
              </del>
            </>
          )}
        </p>
        <Link
          href={slide.href}
          className={cn(
            buttonVariants({ variant: "cta", size: "xl" }),
            "mt-1 h-12 px-8"
          )}
        >
          تسوّق الآن
          <ArrowRightIcon className="size-5 rtl:rotate-180" aria-hidden />
        </Link>
      </div>
      <StageVisual
        photo={photo}
        alt={slide.image?.alt ?? ""}
        sizes="(min-width: 768px) 480px, 92vw"
        priority={priority}
        className="order-first mx-auto w-[min(100%,46svh,30rem)] md:order-none md:w-full md:max-w-[30rem]"
      />
    </div>
  )
}
