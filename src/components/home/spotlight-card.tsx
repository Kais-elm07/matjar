import Image from "next/image"
import Link from "next/link"

import { IMAGE_SHADE } from "@/components/home/banner-styles"
import { buttonVariants } from "@/components/ui/button"
import type { CategoryBanner } from "@/lib/catalog/types"
import { cn } from "@/lib/utils"

interface SpotlightCardProps {
  banner: CategoryBanner
}

/** A category photo card: the category photo fills it, with the title, description and button over a dark gradient. */
export function SpotlightCard({ banner }: SpotlightCardProps) {
  return (
    <Link
      href={banner.href}
      className="group relative flex min-h-56 flex-col justify-end overflow-hidden rounded-xl border bg-muted p-6 outline-none focus-visible:ring-3 focus-visible:ring-ring md:min-h-64 md:p-8"
    >
      {banner.image && (
        <Image
          src={banner.image}
          alt=""
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      )}
      <span aria-hidden className={IMAGE_SHADE} />
      <span className="relative flex max-w-md flex-col items-start gap-2">
        <h3 className="text-xl leading-snug font-bold md:text-2xl">
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
