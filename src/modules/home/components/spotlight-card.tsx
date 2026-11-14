import Link from "next/link"

import { StageVisual } from "@/components/shared/stage-visual"
import { buttonVariants } from "@/components/ui/button"
import type { CategoryBanner } from "@/modules/catalog/types"
import { BRAND_TONE, toneStyle } from "@/lib/tone"
import { cn } from "@/lib/utils"

interface SpotlightCardProps {
  banner: CategoryBanner
}

/**
 * A category spotlight card: the cut-out of the category's cover photo on its platform on the end side, in
 * the light of its tone, and the title, description and button on the start side (DESIGN.md: Category
 * spotlight cards).
 */
export function SpotlightCard({ banner }: SpotlightCardProps) {
  return (
    <Link
      href={banner.href}
      style={toneStyle(banner.image?.tone ?? BRAND_TONE)}
      className="group relative isolate flex min-h-60 items-center overflow-hidden rounded-2xl border bg-card p-6 outline-none focus-visible:ring-3 focus-visible:ring-ring md:min-h-72 md:p-8"
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10 [--stage-x:24%] [--stage-y:55%] stage-backdrop"
      />
      <StageVisual
        photo={banner.image}
        alt=""
        sizes="(min-width: 768px) 260px, 40vw"
        className="absolute end-[3%] top-1/2 w-[44%] max-w-64 -translate-y-1/2 transition-transform duration-300 group-hover:scale-105"
      />
      {/* The site is always right to left: the dark side starts on the right, where the text is */}
      <span
        aria-hidden
        className="absolute inset-y-0 start-0 -z-10 w-2/3 bg-gradient-to-l from-card via-card/70 to-transparent"
      />
      <span className="relative flex max-w-[56%] flex-col items-start gap-2">
        <h3 className="text-xl leading-snug font-bold text-balance md:text-2xl">
          {banner.title}
        </h3>
        {banner.text && (
          <span className="text-sm text-foreground/85 md:text-base">
            {banner.text}
          </span>
        )}
        <span
          className={cn(
            buttonVariants({ variant: "cta", size: "lg" }),
            "mt-2 px-5"
          )}
        >
          تسوّق الآن
        </span>
      </span>
    </Link>
  )
}
