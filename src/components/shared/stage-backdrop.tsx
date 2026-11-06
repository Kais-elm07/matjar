import type { Ref } from "react"

import { toneStyle, type Tone } from "@/lib/tone"
import { cn } from "@/lib/utils"

interface StageBackdropProps {
  /** The first slide's tone: the light before the page's code runs */
  tone: Tone
  /** The element whose two layers useStageMotion blends during a swipe */
  ref?: Ref<HTMLDivElement>
  /** Where the light sits behind the product, such as md:[--stage-x:28%] (DESIGN.md: The stage) */
  className?: string
}

/**
 * The light behind a stage (DESIGN.md: stage-backdrop), in two layers: the tone of the slide in view, and over
 * it the next slide's tone, which useStageMotion fades in as the swipe moves toward that slide. It sits behind
 * the stage's content, so the stage needs `isolate`.
 */
export function StageBackdrop({ tone, ref, className }: StageBackdropProps) {
  return (
    <div
      ref={ref}
      aria-hidden
      // The browser tests read the light's tone through this attribute
      data-slot="stage-light"
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
    >
      <div
        className="absolute inset-0 stage-backdrop"
        style={toneStyle(tone)}
      />
      <div
        className="absolute inset-0 opacity-0 will-change-[opacity] stage-backdrop"
        style={toneStyle(tone)}
      />
    </div>
  )
}
