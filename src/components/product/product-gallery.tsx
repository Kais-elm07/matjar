"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeftIcon, ChevronRightIcon, ZoomInIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import type { ProductImage } from "@/lib/catalog/types"
import { cn } from "@/lib/utils"

/**
 * معرض صور المنتج: يُسحب باللمس، مع صور مصغرة ونافذة تكبير.
 * الصورة الظاهرة يتحكم بها المكوّن الأب، فيمكن نقلها عند اختيار لون.
 */
export function ProductGallery({
  images,
  activeIndex,
  onActiveIndexChange,
}: {
  images: ProductImage[]
  activeIndex: number
  onActiveIndexChange: (index: number) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const [zoomOpen, setZoomOpen] = useState(false)

  // معرفة الصورة الظاهرة عند السحب
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            onActiveIndexChange(
              Number((entry.target as HTMLElement).dataset.index)
            )
          }
        }
      },
      { root: track, threshold: 0.6 }
    )
    for (const slide of slideRefs.current) if (slide) observer.observe(slide)
    return () => observer.disconnect()
  }, [images.length, onActiveIndexChange])

  // الانتقال للصورة المطلوبة عند اختيار صورة مصغرة أو لون
  useEffect(() => {
    const track = trackRef.current
    const slide = slideRefs.current[activeIndex]
    if (!track || !slide) return
    const trackBox = track.getBoundingClientRect()
    const slideBox = slide.getBoundingClientRect()
    if (Math.abs(slideBox.left - trackBox.left) > 2) {
      track.scrollBy({
        left: slideBox.left - trackBox.left,
        behavior: "smooth",
      })
    }
  }, [activeIndex])

  const showPrevious = () =>
    onActiveIndexChange((activeIndex - 1 + images.length) % images.length)
  const showNext = () => onActiveIndexChange((activeIndex + 1) % images.length)
  const active = images[activeIndex] ?? images[0]

  return (
    <div className="space-y-3">
      <div className="relative">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain rounded-2xl bg-muted [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, index) => (
            <div
              key={image.src}
              ref={(element) => {
                slideRefs.current[index] = element
              }}
              data-index={index}
              className="relative aspect-square w-full shrink-0 snap-center"
            >
              <button
                type="button"
                onClick={() => {
                  onActiveIndexChange(index)
                  setZoomOpen(true)
                }}
                className="absolute inset-0 cursor-zoom-in outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                aria-label={`تكبير الصورة ${index + 1} من ${images.length}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  className="object-cover"
                />
              </button>
            </div>
          ))}
        </div>
        <span className="pointer-events-none absolute end-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/80 text-muted-foreground shadow-sm">
          <ZoomInIcon className="size-4" aria-hidden />
        </span>
        {images.length > 1 && (
          <span className="pointer-events-none absolute start-3 bottom-3 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium tabular-nums shadow-sm md:hidden">
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <ul className="flex [scrollbar-width:none] gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <li key={image.src} className="shrink-0">
              <button
                type="button"
                onClick={() => onActiveIndexChange(index)}
                aria-label={`عرض الصورة ${index + 1}`}
                aria-current={index === activeIndex}
                className={cn(
                  "relative block size-16 overflow-hidden rounded-lg border-2 border-transparent bg-muted transition-colors md:size-20",
                  index === activeIndex
                    ? "border-primary"
                    : "opacity-70 hover:opacity-100"
                )}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-[min(92vw,44rem)] gap-3 p-3 sm:max-w-[min(92vw,44rem)]">
          <DialogTitle className="sr-only">{active.alt}</DialogTitle>
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src={active.src}
              alt={active.alt}
              fill
              sizes="(min-width: 768px) 704px, 92vw"
              className="object-contain"
            />
          </div>
          {images.length > 1 && (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon-xl"
                onClick={showPrevious}
                aria-label="الصورة السابقة"
              >
                <ChevronRightIcon className="ltr:rotate-180" aria-hidden />
              </Button>
              <span className="text-sm text-muted-foreground tabular-nums">
                {activeIndex + 1} / {images.length}
              </span>
              <Button
                variant="outline"
                size="icon-xl"
                onClick={showNext}
                aria-label="الصورة التالية"
              >
                <ChevronLeftIcon className="ltr:rotate-180" aria-hidden />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
