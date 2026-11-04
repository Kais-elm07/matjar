"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { formatPrice } from "@/lib/catalog/money"
import type { ProductBanner } from "@/lib/catalog/types"
import { scrollBehavior } from "@/lib/motion"
import { cn } from "@/lib/utils"

/**
 * الواجهة الرئيسية بعرض الشاشة: صورة كبيرة بتدرج داكن من الأسفل، والنص والزر في ركنها السفلي.
 * تبدأ تحت الرأس الشفاف (هامش علوي سالب بارتفاع الرأس). أكثر من شريحة تُسحب باللمس،
 * ولها أسهم على الحاسوب ونقاط فوق الصورة، ولا تتحرك تلقائياً.
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
      behavior: scrollBehavior(),
      block: "nearest",
      inline: "center",
    })
  }

  return (
    <section
      aria-roledescription="عرض شرائح"
      aria-label="أبرز العروض"
      className="relative -mt-16 bg-muted md:-mt-[72px]"
    >
      <ul
        ref={listRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden"
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
            <div className="relative aspect-[4/5] sm:aspect-[16/9] md:aspect-auto md:h-[min(80svh,46rem)] md:min-h-[32rem]">
              {slide.image && (
                <Image
                  src={slide.image.src}
                  alt={slide.image.alt}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className="object-cover"
                />
              )}
              {/* تدرج داكن من الأسفل يضمن قراءة النص الأبيض، وآخر من الأعلى لنص الرأس الشفاف */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/25 to-foreground/5"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-foreground/55 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0">
                <div className="page-container pb-16 md:pb-20">
                  <div className="max-w-xl space-y-4 text-primary-foreground">
                    {slide.tag && (
                      <p className="inline-flex rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-foreground">
                        {slide.tag}
                      </p>
                    )}
                    <h2 className="text-4xl leading-[1.25] font-bold md:text-6xl md:leading-[1.15]">
                      {slide.title}
                    </h2>
                    {slide.text && (
                      <p className="text-base text-primary-foreground/85 md:text-lg">
                        {slide.text}
                      </p>
                    )}
                    <p className="text-sm text-primary-foreground/85">
                      {slide.priceVaries ? "يبدأ من " : "بسعر "}
                      <span className="text-xl font-bold text-primary-foreground">
                        {formatPrice(slide.price)}
                      </span>
                    </p>
                    <Link
                      href={slide.href}
                      className={cn(
                        buttonVariants({ variant: "on-image", size: "xl" }),
                        "mt-2 h-12 px-7"
                      )}
                    >
                      تسوّق الآن
                    </Link>
                  </div>
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
            className="absolute start-4 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground outline-none hover:bg-background focus-visible:ring-3 focus-visible:ring-ring md:flex"
          >
            <ChevronLeftIcon className="size-5 rtl:rotate-180" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => show(active + 1)}
            aria-label="الشريحة التالية"
            className="absolute end-4 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground outline-none hover:bg-background focus-visible:ring-3 focus-visible:ring-ring md:flex"
          >
            <ChevronRightIcon className="size-5 rtl:rotate-180" aria-hidden />
          </button>
          <div className="absolute inset-x-0 bottom-4 flex justify-center md:bottom-6">
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
                    "block h-2 rounded-full transition-all group-focus-visible/dot:ring-3 group-focus-visible/dot:ring-ring",
                    index === active
                      ? "w-7 bg-background"
                      : "w-2 bg-background/50"
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
