import { StageVisual } from "@/components/shared/stage-visual"
import type { CardPhoto } from "@/lib/catalog/types"
import { BRAND_TONE, toneStyle } from "@/lib/tone"
import { cn } from "@/lib/utils"

interface ToneBannerProps {
  /** The product photo on the end side, in the light of its tone */
  photo: CardPhoto | null
  /** The text on the start side */
  children: React.ReactNode
  className?: string
}

/**
 * A wide stage (DESIGN.md: New arrivals and the wide banner): 16px corners and a thin border, the product's
 * cut-out on its platform on the end side in the light of its tone, and the text on the start side, which
 * stays on the dark side of the light. On a phone the product stands under the text.
 */
export function ToneBanner({ photo, children, className }: ToneBannerProps) {
  return (
    <div
      style={toneStyle(photo?.tone ?? BRAND_TONE)}
      className={cn(
        "relative isolate grid items-center gap-2 overflow-hidden rounded-2xl border bg-card p-6 md:grid-cols-[1.25fr_1fr] md:gap-8 md:px-12 md:py-10",
        className
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [--stage-y:78%] stage-backdrop md:[--stage-x:24%] md:[--stage-y:52%]"
      />
      <div className="flex flex-col items-start gap-3">{children}</div>
      <StageVisual
        photo={photo}
        alt=""
        sizes="(min-width: 768px) 360px, 72vw"
        className="mx-auto max-w-[20rem]"
      />
    </div>
  )
}
