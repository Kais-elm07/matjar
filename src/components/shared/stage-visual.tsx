import Image from "next/image"

import type { PhotoLook } from "@/lib/catalog/types"
import { cn } from "@/lib/utils"

/** A photo on a stage: its path and its look. */
type StagePhoto = { src: string } & PhotoLook

interface StageVisualProps {
  /** The photo, or null while it waits to load, so the platform shows alone */
  photo: StagePhoto | null
  alt: string
  sizes: string
  /** The largest photo on the first screen loads at once, before the others */
  priority?: boolean
  className?: string
}

/**
 * A product on a stage (DESIGN.md: Hero and Product page): the glowing platform (stage-platform), and the
 * photo above it, which turns in 3D with the swipe (stage-photo). A cut-out floats in the light; any other
 * photo stands in a frame. The tone comes from the CSS variables of an element around it (toneStyle).
 */
export function StageVisual({
  photo,
  alt,
  sizes,
  priority = false,
  className,
}: StageVisualProps) {
  const loading = priority ? "eager" : "lazy"
  const fetchPriority = priority ? "high" : "auto"
  return (
    <div
      className={cn(
        "relative grid aspect-square w-full place-items-center",
        className
      )}
    >
      <div aria-hidden className="stage-platform" />
      {photo &&
        (photo.cutout ? (
          <div className="relative mb-[9%] aspect-square w-[84%] stage-photo">
            <Image
              src={photo.src}
              alt={alt}
              fill
              sizes={sizes}
              loading={loading}
              fetchPriority={fetchPriority}
              className="object-contain"
            />
          </div>
        ) : (
          <div className="relative mb-[7%] aspect-[4/5] w-[64%] stage-photo overflow-hidden rounded-xl border border-foreground/15 bg-muted">
            <Image
              src={photo.src}
              alt={alt}
              fill
              sizes={sizes}
              loading={loading}
              fetchPriority={fetchPriority}
              className="object-cover"
            />
          </div>
        ))}
    </div>
  )
}
