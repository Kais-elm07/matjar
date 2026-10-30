"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * صف يُسحب أفقياً باللمس، مع زرّي تمرير دائريين على الحاسوب.
 * العناصر تُمرَّر كعناصر <li>، وعرض كل عنصر يحدده من يستخدم الصف.
 * يعمل بـ CSS (scroll-snap) دون مكتبة شرائح، فلا يثقل الصفحة.
 */
export function Carousel({
  label,
  children,
  controls = "header",
  header,
  className,
  listClassName,
}: {
  /** اسم الصف لقارئات الشاشة، مثل "الأكثر مبيعاً" */
  label: string
  children: React.ReactNode
  /** مكان زرّي التمرير: في رأس القسم بجانب العنوان، أو مخفيان */
  controls?: "header" | "none"
  /** العنوان والروابط التي تظهر في رأس القسم */
  header?: React.ReactNode
  className?: string
  listClassName?: string
}) {
  const listRef = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ atStart: true, atEnd: false })

  const updateEdges = useCallback(() => {
    const list = listRef.current
    if (!list) return
    // في الاتجاه العربي تبدأ قيمة التمرير من الصفر وتصبح سالبة نحو النهاية
    const scrolled = Math.abs(list.scrollLeft)
    const max = list.scrollWidth - list.clientWidth
    setEdges({ atStart: scrolled <= 4, atEnd: scrolled >= max - 4 })
  }, [])

  useEffect(() => {
    updateEdges()
    const list = listRef.current
    if (!list) return
    const observer = new ResizeObserver(updateEdges)
    observer.observe(list)
    return () => observer.disconnect()
  }, [updateEdges])

  function scrollByPage(direction: 1 | -1) {
    const list = listRef.current
    if (!list) return
    const rtl = getComputedStyle(list).direction === "rtl"
    list.scrollBy({
      left: direction * list.clientWidth * 0.9 * (rtl ? -1 : 1),
      behavior: "smooth",
    })
  }

  return (
    <div className={className}>
      {(header || controls === "header") && (
        <div className="mb-4 flex items-center justify-between gap-3 md:mb-5">
          <div className="min-w-0">{header}</div>
          {controls === "header" && (
            <div className="hidden shrink-0 items-center gap-2 md:flex">
              <Button
                variant="secondary"
                size="icon-lg"
                aria-label={`السابق في ${label}`}
                disabled={edges.atStart}
                onClick={() => scrollByPage(-1)}
              >
                <ChevronLeftIcon className="rtl:rotate-180" aria-hidden />
              </Button>
              <Button
                variant="secondary"
                size="icon-lg"
                aria-label={`التالي في ${label}`}
                disabled={edges.atEnd}
                onClick={() => scrollByPage(1)}
              >
                <ChevronRightIcon className="rtl:rotate-180" aria-hidden />
              </Button>
            </div>
          )}
        </div>
      )}
      <ul
        ref={listRef}
        aria-label={label}
        onScroll={updateEdges}
        className={cn(
          "-mx-4 flex snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:scroll-px-0 md:gap-4 md:px-0 [&::-webkit-scrollbar]:hidden",
          listClassName
        )}
      >
        {children}
      </ul>
    </div>
  )
}
