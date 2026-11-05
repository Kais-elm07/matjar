"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { ZoomInIcon } from "lucide-react"

import type { ProductImage } from "@/lib/catalog/types"
import { scrollBehavior } from "@/lib/motion"
import { useIdle } from "@/lib/use-idle"
import { cn } from "@/lib/utils"

// The zoom dialog's code loads after the page appears, or on the first click on the image
const ProductZoom = dynamic(
  () =>
    import("@/components/product/product-zoom").then((mod) => mod.ProductZoom),
  { ssr: false }
)

interface ProductGalleryProps {
  images: ProductImage[]
  activeIndex: number
  onActiveIndexChange: (index: number) => void
}

/**
 * The product image gallery: swipeable by touch, with thumbnails and a zoom dialog.
 * The visible image is controlled by the parent component, so it can be moved when a color is chosen.
 */
export function ProductGallery({
  images,
  activeIndex,
  onActiveIndexChange,
}: ProductGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const [zoomOpen, setZoomOpen] = useState(false)
  const idle = useIdle()

  // Find the visible image after the swipe stops, not during it: a smooth scroll to a far image
  // passes the ones in between, and counting each as "current" would stop the scroll at the first
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let timer: ReturnType<typeof setTimeout> | undefined
    function settle() {
      if (!track) return
      // In the Arabic (RTL) direction the scroll value is negative, so take its absolute value
      const index = Math.round(Math.abs(track.scrollLeft) / track.clientWidth)
      onActiveIndexChange(Math.min(index, images.length - 1))
    }
    function onScroll() {
      clearTimeout(timer)
      timer = setTimeout(settle, 120)
    }
    track.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      track.removeEventListener("scroll", onScroll)
    }
  }, [images.length, onActiveIndexChange])

  // Scroll to the requested image when a thumbnail or a color is chosen
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
    // On desktop: the thumbnails run vertically beside the large image, on the start side
    <div className="space-y-3 lg:flex lg:items-start lg:gap-3 lg:space-y-0">
      <div className="relative lg:min-w-0 lg:flex-1">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain rounded-xl border bg-muted [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, index) => (
            <div
              key={image.src}
              ref={(element) => {
                slideRefs.current[index] = element
              }}
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
                {/* The other large photos wait until the page has loaded, or until they are shown,
                    so on a slow phone they don't share the connection with the first photo */}
                {(index === 0 || index === activeIndex || idle) && (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    className="object-cover"
                  />
                )}
              </button>
            </div>
          ))}
        </div>
        <span className="pointer-events-none absolute end-3 top-3 flex size-9 items-center justify-center rounded-full bg-card/85 text-foreground">
          <ZoomInIcon className="size-4" aria-hidden />
        </span>
        {images.length > 1 && (
          // Left to right, so it reads "1 / 3" and not "3 / 1" in the Arabic direction
          <span
            dir="ltr"
            className="pointer-events-none absolute start-3 bottom-3 rounded-full bg-card/85 px-2.5 py-1 text-xs font-medium tabular-nums md:hidden"
          >
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
                  "relative block size-16 overflow-hidden rounded-lg border-2 border-border bg-muted transition-colors md:size-20",
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
