"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { ChevronLeftIcon, ChevronRightIcon, ZoomInIcon } from "lucide-react"

import { PhotoBox } from "@/components/shared/photo-box"
import { StageBackdrop } from "@/components/shared/stage-backdrop"
import { StageVisual } from "@/components/shared/stage-visual"
import { useIdle } from "@/hooks/use-idle"
import { useStageMotion } from "@/hooks/use-stage-motion"
import type { ProductImage } from "@/lib/catalog/types"
import { scrollToSlide, visibleSlide } from "@/lib/slider"
import { BRAND_TONE, toneStyle } from "@/lib/tone"
import { cn } from "@/lib/utils"

// The zoom dialog's code loads after the page appears, or on the first click on the image
const ProductZoom = dynamic(
  () =>
    import("@/components/product/product-zoom").then((mod) => mod.ProductZoom),
  { ssr: false }
)

/** The round arrows on the stage, from tablets up */
const ARROW =
  "absolute top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border bg-card/80 text-foreground outline-none hover:bg-card focus-visible:ring-3 focus-visible:ring-ring md:flex"

interface ProductGalleryProps {
  images: ProductImage[]
  activeIndex: number
  onActiveIndexChange: (index: number) => void
}

/**
 * The product image gallery, a stage (DESIGN.md: Product page): the photos swipe by touch and turn in 3D as
 * they move, and the light behind them takes the tone of the photo in view the moment it changes
 * (useStageMotion), with arrows, thumbnails and a zoom dialog. The visible photo is controlled by the parent
 * component, so choosing a color moves the gallery to that color's photo, and the light to its tone.
 */
export function ProductGallery({
  images,
  activeIndex,
  onActiveIndexChange,
}: ProductGalleryProps) {
  const { trackRef, backdropRef } = useStageMotion<HTMLDivElement>()
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  // The image an arrow, a thumbnail or a color asked for, while the row scrolls to it
  const requested = useRef<number | null>(null)
  const [zoomOpen, setZoomOpen] = useState(false)
  // The zoom dialog's code loads after the page appears
  const idle = useIdle()
  // The other photos wait until the visitor reaches for the gallery (a touch, the mouse over it, or the
  // keyboard), or until their photo is shown, so the first screen loads only the first photo
  const [reached, setReached] = useState(false)
  const reach = () => setReached(true)
  const count = images.length

  // Find the visible image after the swipe stops, not during it: a smooth scroll to a far image
  // passes the ones in between, and counting each as "current" would stop the scroll at the first.
  // While the row scrolls to a requested image, a pause on the way is not reported, so a second
  // quick click on an arrow isn't undone; the visitor's own touch or wheel ends that wait.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let timer: ReturnType<typeof setTimeout> | undefined
    function settle() {
      if (!track) return
      const visible = Math.min(visibleSlide(track), count - 1)
      if (requested.current !== null) {
        if (visible !== requested.current) return
        requested.current = null
      }
      onActiveIndexChange(visible)
    }
    function onScroll() {
      clearTimeout(timer)
      timer = setTimeout(settle, 120)
    }
    function onVisitorScroll() {
      requested.current = null
    }
    track.addEventListener("scroll", onScroll, { passive: true })
    track.addEventListener("pointerdown", onVisitorScroll, { passive: true })
    track.addEventListener("wheel", onVisitorScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      track.removeEventListener("scroll", onScroll)
      track.removeEventListener("pointerdown", onVisitorScroll)
      track.removeEventListener("wheel", onVisitorScroll)
    }
  }, [trackRef, count, onActiveIndexChange])

  // Scroll to the requested image when an arrow, a thumbnail or a color is chosen
  useEffect(() => {
    const track = trackRef.current
    const slide = slideRefs.current[activeIndex]
    if (!track || !slide) return
    requested.current = activeIndex
    scrollToSlide(track, slide)
  }, [trackRef, activeIndex])

  const step = (by: number) =>
    onActiveIndexChange((activeIndex + by + count) % count)

  return (
    // On desktop: the thumbnails run vertically beside the stage, on the start side
    <div className="space-y-3 lg:flex lg:items-start lg:gap-3 lg:space-y-0">
      <div
        onPointerDown={reach}
        onPointerEnter={reach}
        onFocus={reach}
        className="relative isolate overflow-hidden rounded-2xl border bg-background lg:min-w-0 lg:flex-1"
      >
        <StageBackdrop ref={backdropRef} tone={images[0]?.tone ?? BRAND_TONE} />
        <div
          ref={trackRef}
          // The browser tests read each photo's tone through this attribute
          data-slot="stage-track"
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain stage-track"
        >
          {images.map((image, index) => (
            <div
              key={image.src}
              ref={(element) => {
                slideRefs.current[index] = element
              }}
              style={toneStyle(image.tone)}
              className="w-full shrink-0 snap-center p-4 md:p-8"
            >
              <button
                type="button"
                onClick={() => {
                  onActiveIndexChange(index)
                  setZoomOpen(true)
                }}
                className="block w-full cursor-zoom-in rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                aria-label={`تكبير الصورة ${index + 1} من ${count}`}
              >
                {/* The other large photos wait until the page has loaded, or until they are shown,
                    so on a slow phone they don't share the connection with the first photo */}
                <StageVisual
                  photo={
                    index === 0 || index === activeIndex || reached
                      ? image
                      : null
                  }
                  alt={image.alt}
                  // The photo is 84% of the stage
                  sizes="(min-width: 1024px) 440px, (min-width: 768px) 39vw, 78vw"
                  priority={index === 0}
                />
              </button>
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="الصورة السابقة"
              className={cn(ARROW, "start-3")}
            >
              <ChevronLeftIcon className="size-5 rtl:rotate-180" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="الصورة التالية"
              className={cn(ARROW, "end-3")}
            >
              <ChevronRightIcon className="size-5 rtl:rotate-180" aria-hidden />
            </button>
          </>
        )}
        <span className="pointer-events-none absolute end-3 top-3 flex size-9 items-center justify-center rounded-full bg-card/85 text-foreground">
          <ZoomInIcon className="size-4" aria-hidden />
        </span>
        {count > 1 && (
          // Left to right, so it reads "1 / 3" and not "3 / 1" in the Arabic direction
          <span
            dir="ltr"
            className="pointer-events-none absolute start-3 bottom-3 rounded-full bg-card/85 px-2.5 py-1 text-xs font-medium tabular-nums md:hidden"
          >
            {activeIndex + 1} / {count}
          </span>
        )}
      </div>

      {count > 1 && (
        <ul className="no-scrollbar flex gap-2 overflow-x-auto pb-1 lg:order-first lg:max-h-[34rem] lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:pb-0">
          {images.map((image, index) => (
            <li key={image.src} className="shrink-0">
              <button
                type="button"
                onClick={() => onActiveIndexChange(index)}
                aria-label={`عرض الصورة ${index + 1}`}
                aria-current={index === activeIndex}
                className={cn(
                  "block rounded-xl border-2 p-0.5 transition-[border-color,opacity] outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  index === activeIndex
                    ? "border-primary"
                    : "border-border opacity-70 hover:opacity-100"
                )}
              >
                <PhotoBox
                  photo={image}
                  alt=""
                  sizes="80px"
                  className="size-16 rounded-lg md:size-20"
                  cutoutClassName="p-1.5"
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
