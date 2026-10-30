"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { BANNER_THEME } from "@/components/home/banner-theme"
import { buttonVariants } from "@/components/ui/button"
import { formatPrice } from "@/lib/catalog/money"
import type { ProductBanner } from "@/lib/catalog/types"
import { cn } from "@/lib/utils"

/**
 * شرائح العرض الرئيسي: تُسحب باللمس، ولها أسهم على الحاسوب ونقاط تحتها.
 * لا تتحرك تلقائياً، فالزائر يقرر متى ينتقل.
 */
export function HeroSlider({ slides }: { slides: ProductBanner[] }) {
  const listRef = useRef<HTMLUListElement>(null)
  const slideRefs = useRef<(HTMLLIElement | null)[]>([])
  const [active, setActive] = useState(0)

  function onScroll() {
    const list = listRef.current
    if (!list) return
    // في الاتجاه العربي تكون قيمة التمرير سالبة، فنأخذ قيمتها المطلقة
    setActive(Math.round(Math.abs(list.scrollLeft) / list.clientWidth))
  }

  function show(index: number) {
    const count = slides.length
    slideRefs.current[(index + count) % count]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    })
  }

  return (
    <section aria-roledescription="عرض شرائح" aria-label="أبرز العروض">
      <div className="relative">
        <ul
          ref={listRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain rounded-lg [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((slide, index) => {
            const theme = BANNER_THEME[slide.theme]
            return (
              <li
                key={slide.href}
                ref={(element) => {
                  slideRefs.current[index] = element
                }}
                aria-roledescription="شريحة"
                aria-label={`${index + 1} من ${slides.length}`}
                className="w-full shrink-0 snap-center"
              >
                <div
                  className={cn(
                    "grid min-h-72 items-center gap-6 px-6 py-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:px-12 md:min-h-96 md:px-16",
                    theme.surface
                  )}
                >
                  <div className="max-w-xl space-y-3">
                    {slide.tag && (
                      <p
                        className={cn(
                          "inline-flex rounded-sm px-2.5 py-1 text-xs font-bold",
                          theme.tag
                        )}
                      >
                        {slide.tag}
                      </p>
                    )}
                    <h2 className="text-3xl leading-snug font-bold md:text-5xl md:leading-tight">
                      {slide.title}
                    </h2>
                    {slide.text && (
                      <p className={cn("text-base md:text-lg", theme.muted)}>
                        {slide.text}
                      </p>
                    )}
                    <p className="text-base">
                      {slide.priceVaries ? "يبدأ من " : "بسعر "}
                      <span
                        className={cn(
                          "text-2xl font-bold md:text-3xl",
                          theme.price
                        )}
                      >
                        {formatPrice(slide.price)}
                      </span>
                    </p>
                    <Link
                      href={slide.href}
                      className={cn(
                        buttonVariants({ variant: theme.button, size: "xl" }),
                        "mt-1"
                      )}
                    >
                      تسوّق الآن
                    </Link>
                  </div>
                  {slide.image && (
                    <div className="relative hidden size-56 overflow-hidden rounded-lg bg-background sm:block md:size-72 lg:size-80">
                      <Image
                        src={slide.image.src}
                        alt={slide.image.alt}
                        fill
                        sizes="(min-width: 1024px) 320px, (min-width: 768px) 288px, 224px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => show(active - 1)}
              aria-label="الشريحة السابقة"
              className="absolute start-3 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md outline-none hover:bg-background focus-visible:ring-3 focus-visible:ring-ring md:flex"
            >
              <ChevronLeftIcon className="size-5 rtl:rotate-180" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => show(active + 1)}
              aria-label="الشريحة التالية"
              className="absolute end-3 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md outline-none hover:bg-background focus-visible:ring-3 focus-visible:ring-ring md:flex"
            >
              <ChevronRightIcon className="size-5 rtl:rotate-180" aria-hidden />
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="mt-2 flex justify-center">
          {slides.map((slide, index) => (
            <button
              key={slide.href}
              type="button"
              onClick={() => show(index)}
              aria-label={`الشريحة ${index + 1}`}
              aria-current={index === active}
              className="group/dot flex h-8 min-w-6 items-center justify-center px-2 outline-none"
            >
              <span
                className={cn(
                  "block h-2.5 rounded-full transition-all group-focus-visible/dot:ring-3 group-focus-visible/dot:ring-ring",
                  index === active ? "w-7 bg-primary" : "w-2.5 bg-border"
                )}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
