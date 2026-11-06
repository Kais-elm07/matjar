"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { useIdle } from "@/hooks/use-idle"
import type { ProductBanner } from "@/lib/catalog/types"
import { formatPrice } from "@/lib/money"
import { scrollToSlide, visibleSlide } from "@/lib/slider"
import { cn } from "@/lib/utils"

interface HeroSliderProps {
  slides: ProductBanner[]
}

/**
 * The full-width hero: a large photo under a darkening layer in the background color and a darker
 * gradient from the bottom, with the badge, headline, description, price and orange button in its
 * middle. Multiple slides are swiped by touch, with arrows on desktop and dots (the active one
 * orange), and they do not move automatically.
 */
export function HeroSlider({ slides }: HeroSliderProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const slideRefs = useRef<(HTMLLIElement | null)[]>([])
  const [active, setActive] = useState(0)
  // The other slides' photos wait until the page has loaded, or until their slide is shown,
  // so on a slow phone they don't share the connection with the first photo
  const idle = useIdle()

  function onScroll() {
    const list = listRef.current
    if (list) setActive(visibleSlide(list))
  }

  /** Scrolls only the slides to the requested slide, without moving the page vertically. */
  function show(index: number) {
    const count = slides.length
    const list = listRef.current
    const slide = slideRefs.current[(index + count) % count]
    if (list && slide) scrollToSlide(list, slide)
  }

  return (
    <section
      aria-roledescription="عرض شرائح"
      aria-label="أبرز العروض"
      className="relative bg-muted"
    >
      <ul
        ref={listRef}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
      >
        {slides.map((slide, index) => (
          <li
            key={slide.href}
            ref={(element) => {
              slideRefs.current[index] = element
            }}
            aria-roledescription="شريحة"
            aria-label={`${index + 1} من ${slides.length}`}
            className="relative w-full shrink-0 snap-center"
          >
            <div className="relative flex min-h-[32rem] items-center md:h-[min(72svh,42rem)] md:min-h-[30rem]">
              {slide.image && (index === 0 || index === active || idle) && (
                // The first photo is the largest element on a phone's first screen (LCP), so it
                // loads at once and before the other images
                <Image
                  src={slide.image.src}
                  alt={slide.image.alt}
                  fill
                  sizes="100vw"
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  className="object-cover"
                />
              )}
              {/* Even darkening keeps the white text readable, and a gradient blends the bottom
                  of the photo into the page background */}
              <div aria-hidden className="absolute inset-0 bg-background/45" />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/55 to-transparent"
              />
              <div className="relative page-container flex justify-center py-16 md:py-20">
                <div className="flex max-w-3xl flex-col items-center gap-4 text-center">
                  {slide.tag && (
                    <p className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                      {slide.tag}
                    </p>
                  )}
                  <h2 className="text-4xl leading-[1.25] font-bold md:text-6xl md:leading-[1.15]">
                    {slide.title}
                  </h2>
                  {slide.text && (
                    <p className="max-w-xl text-base text-foreground/85 md:text-lg">
                      {slide.text}
                    </p>
                  )}
                  <p className="text-sm text-foreground/85">
                    {slide.priceVaries ? "يبدأ من " : "بسعر "}
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(slide.price)}
                    </span>
                  </p>
                  <Link
                    href={slide.href}
                    className={cn(
                      buttonVariants({ variant: "cta", size: "xl" }),
                      "mt-2 h-12 px-8"
                    )}
                  >
                    تسوّق الآن
                  </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => show(active - 1)}
            aria-label="الشريحة السابقة"
            className="absolute start-4 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 text-foreground outline-none hover:bg-card focus-visible:ring-3 focus-visible:ring-ring md:flex"
          >
            <ChevronLeftIcon className="size-5 rtl:rotate-180" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => show(active + 1)}
            aria-label="الشريحة التالية"
            className="absolute end-4 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 text-foreground outline-none hover:bg-card focus-visible:ring-3 focus-visible:ring-ring md:flex"
          >
            <ChevronRightIcon className="size-5 rtl:rotate-180" aria-hidden />
          </button>
          <div className="absolute inset-x-0 bottom-3 flex justify-center md:bottom-5">
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
        </>
      )}
    </section>
  )
}
