"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { PhotoBox } from "@/components/shared/photo-box"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import type { ProductImage } from "@/modules/catalog/types"

interface ProductZoomProps {
  images: ProductImage[]
  activeIndex: number
  onActiveIndexChange: (index: number) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** The product image zoom dialog, with navigation between the images, on the light of each photo's tone. */
export function ProductZoom({
  images,
  activeIndex,
  onActiveIndexChange,
  open,
  onOpenChange,
}: ProductZoomProps) {
  const active = images[activeIndex] ?? images[0]
  const showPrevious = () =>
    onActiveIndexChange((activeIndex - 1 + images.length) % images.length)
  const showNext = () => onActiveIndexChange((activeIndex + 1) % images.length)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[min(92vw,44rem)] gap-3 p-3 sm:max-w-[min(92vw,44rem)]">
        <DialogTitle className="sr-only">{active.alt}</DialogTitle>
        {/* The whole photo shows, so a regular photo is not cropped either */}
        <PhotoBox
          photo={active}
          alt={active.alt}
          sizes="(min-width: 768px) 704px, 92vw"
          className="aspect-square w-full"
          imageClassName="object-contain"
          cutoutClassName="p-[7%]"
        />
        {images.length > 1 && (
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon-xl"
              onClick={showPrevious}
              aria-label="الصورة السابقة"
            >
              <ChevronLeftIcon className="rtl:rotate-180" aria-hidden />
            </Button>
            {/* Left to right, so it reads "1 / 3" and not "3 / 1" in the Arabic direction */}
            <span
              dir="ltr"
              className="text-sm text-muted-foreground tabular-nums"
            >
              {activeIndex + 1} / {images.length}
            </span>
            <Button
              variant="outline"
              size="icon-xl"
              onClick={showNext}
              aria-label="الصورة التالية"
            >
              <ChevronRightIcon className="rtl:rotate-180" aria-hidden />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
