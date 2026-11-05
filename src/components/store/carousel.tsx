"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { scrollBehavior } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface CarouselProps {
  /** The row's name for screen readers, such as "الأكثر مبيعاً" (Best sellers) */
  label: string
  children: React.ReactNode
  /** Where the two scroll buttons go: in the section header beside the title, or hidden */
  controls?: "header" | "none"
  /** The title and links shown in the section header */
  header?: React.ReactNode
  className?: string
  listClassName?: string
}

/**
 * A row that swipes horizontally by touch, with two round scroll buttons on desktop.
 * Items are passed as <li> elements, and whoever uses the row sets each item's width.
 * It works with CSS (scroll-snap) and no slider library, so it doesn't weigh down the page.
 */
export function Carousel({
  label,
  children,
  controls = "header",
  header,
  className,
  listClassName,
}: CarouselProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ atStart: true, atEnd: false })

  const updateEdges = useCallback(() => {
    const list = listRef.current
    if (!list) return
    // In the Arabic (RTL) direction the scroll value starts at zero and turns negative toward the end
    const scrolled = Math.abs(list.scrollLeft)
    const max = list.scrollWidth - list.clientWidth
    const atStart = scrolled <= 4
    const atEnd = scrolled >= max - 4
    // The same state while nothing changed, so scrolling doesn't re-render the row on every event
    setEdges((edges) =>
      edges.atStart === atStart && edges.atEnd === atEnd
        ? edges
        : { atStart, atEnd }
    )
  }, [])

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    // The observer reports the row's first size too, after the browser's own layout,
    // so measuring it here doesn't force an extra layout while the page loads
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
      behavior: scrollBehavior(),
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
                variant="outline"
                size="icon-lg"
                className="size-11 rounded-full border-transparent bg-muted hover:bg-muted/70"
                aria-label={`السابق في ${label}`}
                disabled={edges.atStart}
                onClick={() => scrollByPage(-1)}
              >
                <ChevronLeftIcon className="rtl:rotate-180" aria-hidden />
              </Button>
              <Button
                variant="outline"
                size="icon-lg"
                className="size-11 rounded-full border-transparent bg-muted hover:bg-muted/70"
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
