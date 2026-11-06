"use client"

import { useRef, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { HeroSlide } from "@/components/home/hero-slide"
import { StageBackdrop } from "@/components/shared/stage-backdrop"
import { useIdle } from "@/hooks/use-idle"
import { useStageMotion } from "@/hooks/use-stage-motion"
import type { ProductBanner } from "@/lib/catalog/types"
import { scrollToSlide, visibleSlide } from "@/lib/slider"
import { BRAND_TONE, toneStyle } from "@/lib/tone"
import { cn } from "@/lib/utils"

/** The round arrows beside the dots, from tablets up */
const ARROW =
  "hidden size-11 items-center justify-center rounded-full border bg-card/80 text-foreground outline-none hover:bg-card focus-visible:ring-3 focus-visible:ring-ring md:flex"

interface HeroSliderProps {
  slides: ProductBanner[]
}

/**
 * The full-width hero, a stage (DESIGN.md: Hero): one slide per product, swiped by touch, with the dots
 * (the active one blue) between two arrows under the slides, and nothing moves on its own. As a slide moves,
 * its photo turns away in 3D and the light behind the stage blends into the next product's tone
 * (useStageMotion). On wider screens the light sits behind the product, on the end side.
 */
export function HeroSlider({ slides }: HeroSliderProps) {
  const { trackRef, backdropRef } = useStageMotion<HTMLUListElement>()
  const slideRefs = useRef<(HTMLLIElement | null)[]>([])
  const [active, setActive] = useState(0)
  // The other slides' photos wait until the page has loaded, or until their slide is shown,
  // so on a slow phone they don't share the connection with the first photo
  const idle = useIdle()

  function onScroll() {
    const list = trackRef.current
    if (list) setActive(visibleSlide(list))
  }

  /** Scrolls only the slides to the requested slide, without moving the page vertically. */
  function show(index: number) {
    const count = slides.length
    const list = trackRef.current
    const slide = slideRefs.current[(index + count) % count]
    if (list && slide) scrollToSlide(list, slide)
  }

  return (
    <section
      aria-roledescription="عرض شرائح"
      aria-label="أبرز العروض"
      className="relative isolate overflow-hidden bg-background"
    >
      <StageBackdrop
        ref={backdropRef}
        tone={slides[0]?.image?.tone ?? BRAND_TONE}
        className="[--stage-y:30%] md:[--stage-x:28%] md:[--stage-y:48%]"
      />
      <ul
        ref={trackRef}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain stage-track"
      >
        {slides.map((slide, index) => (
          <li
            key={slide.href}
            ref={(element) => {
              slideRefs.current[index] = element
            }}
            aria-roledescription="شريحة"
            aria-label={`${index + 1} من ${slides.length}`}
            style={toneStyle(slide.image?.tone ?? BRAND_TONE)}
            className="w-full shrink-0 snap-center"
          >
            <HeroSlide
              slide={slide}
              photo={
                index === 0 || index === active || idle ? slide.image : null
              }
              priority={index === 0}
            />
          </li>
        ))}
      </ul>

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 md:bottom-14">
          <button
            type="button"
            onClick={() => show(active - 1)}
            aria-label="الشريحة السابقة"
            className={ARROW}
          >
            <ChevronLeftIcon className="size-5 rtl:rotate-180" aria-hidden />
          </button>
          <div className="flex">
            {slides.map((slide, index) => (
              <button
                key={slide.href}
                type="button"
                onClick={() => show(index)}
                aria-label={`الشريحة ${index + 1}`}
                aria-current={index === active}
                className="group/dot flex size-11 items-center justify-center outline-none"
              >
                <span
                  className={cn(
                    "block h-2 rounded-full transition-all group-focus-visible/dot:ring-3 group-focus-visible/dot:ring-ring",
                    index === active ? "w-7 bg-primary" : "w-2 bg-foreground/40"
                  )}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => show(active + 1)}
            aria-label="الشريحة التالية"
            className={ARROW}
          >
            <ChevronRightIcon className="size-5 rtl:rotate-180" aria-hidden />
          </button>
        </div>
      )}
    </section>
  )
}
