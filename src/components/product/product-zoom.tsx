"use client"

import Image from "next/image"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import type { ProductImage } from "@/lib/catalog/types"

/** نافذة تكبير صور المنتج، مع التنقل بين الصور. */
export function ProductZoom({
  images,
  activeIndex,
  onActiveIndexChange,
  open,
  onOpenChange,
}: {
  images: ProductImage[]
  activeIndex: number
  onActiveIndexChange: (index: number) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const active = images[activeIndex] ?? images[0]
  const showPrevious = () =>
    onActiveIndexChange((activeIndex - 1 + images.length) % images.length)
  const showNext = () => onActiveIndexChange((activeIndex + 1) % images.length)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  )
}
