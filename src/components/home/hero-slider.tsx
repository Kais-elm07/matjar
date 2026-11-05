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

interface HeroSliderProps {
  slides: ProductBanner[]
}

/**
 * الواجهة الرئيسية بعرض الشاشة: صورة كبيرة فوقها تعتيم بلون الخلفية وتدرج أغمق من الأسفل،
 * والشارة والعنوان والوصف والسعر والزر البرتقالي في منتصفها. أكثر من شريحة تُسحب باللمس،
 * ولها أسهم على الحاسوب ونقاط (النشطة برتقالية)، ولا تتحرك تلقائياً.
 */
export function HeroSlider({ slides }: HeroSliderProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const slideRefs = useRef<(HTMLLIElement | null)[]>([])
  const [active, setActive] = useState(0)

  function onScroll() {
    const list = listRef.current
    if (!list) return
    // في الاتجاه العربي تكون قيمة التمرير سالبة، فنأخذ قيمتها المطلقة
    setActive(Math.round(Math.abs(list.scrollLeft) / list.clientWidth))
  }

  /** ينقل الشرائح وحدها إلى الشريحة المطلوبة، دون تحريك الصفحة رأسياً. */
  function show(index: number) {
    const count = slides.length
    const list = listRef.current
    const slide = slideRefs.current[(index + count) % count]
    if (!list || !slide) return
    list.scrollBy({
      left:
        slide.getBoundingClientRect().left - list.getBoundingClientRect().left,
      behavior: scrollBehavior(),
    })
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
            <div className="relative flex min-h-[32rem] items-center md:h-[min(72svh,42rem)] md:min-h-[30rem]">
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
              {/* تعتيم موحد يضمن قراءة النص الأبيض، وتدرج يذيب أسفل الصورة في خلفية الصفحة */}
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
                className="group/dot flex h-8 min-w-6 items-center justify-center px-2 outline-none"
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
