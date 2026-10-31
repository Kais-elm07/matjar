"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { ZoomInIcon } from "lucide-react"

import type { ProductImage } from "@/lib/catalog/types"
import { scrollBehavior } from "@/lib/motion"
import { useIdle } from "@/lib/use-idle"
import { cn } from "@/lib/utils"

// نافذة التكبير يُحمَّل كودها بعد ظهور الصفحة، أو عند أول ضغطة على الصورة
const ProductZoom = dynamic(
  () =>
    import("@/components/product/product-zoom").then((mod) => mod.ProductZoom),
  { ssr: false }
)

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
  const idle = useIdle()

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
        behavior: scrollBehavior(),
      })
    }
  }, [activeIndex])

  return (
    // على الحاسوب: الصور المصغرة عمودياً بجانب الصورة الكبيرة من جهة البداية
    <div className="space-y-3 lg:flex lg:items-start lg:gap-3 lg:space-y-0">
      <div className="relative lg:min-w-0 lg:flex-1">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain rounded-lg border bg-background [&::-webkit-scrollbar]:hidden"
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
        <ul className="flex [scrollbar-width:none] gap-2 overflow-x-auto pb-1 lg:order-first lg:max-h-[34rem] lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:pb-0">
          {images.map((image, index) => (
            <li key={image.src} className="shrink-0">
              <button
                type="button"
                onClick={() => onActiveIndexChange(index)}
                aria-label={`عرض الصورة ${index + 1}`}
                aria-current={index === activeIndex}
                className={cn(
                  "relative block size-16 overflow-hidden rounded-md border-2 border-border bg-background transition-colors md:size-20",
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

      {(zoomOpen || idle) && (
        <ProductZoom
          images={images}
          activeIndex={activeIndex}
          onActiveIndexChange={onActiveIndexChange}
          open={zoomOpen}
          onOpenChange={setZoomOpen}
        />
      )}
    </div>
  )
}
