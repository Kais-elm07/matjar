import Image from "next/image"

import type { PhotoLook } from "@/lib/catalog/types"
import { toneStyle } from "@/lib/tone"
import { cn } from "@/lib/utils"

/** A photo in a box: its path and its look. */
type BoxPhoto = { src: string } & PhotoLook

interface PhotoBoxProps {
  photo: BoxPhoto
  alt: string
  sizes: string
  /** Photos at the top of the page load first */
  priority?: boolean
  /** The box's size, shape and place */
  className?: string
  /** Classes for the photo, such as its zoom when the mouse is over a card */
  imageClassName?: string
  /** The space around a cut-out inside the box */
  cutoutClassName?: string
  /** Badges and buttons over the photo */
  children?: React.ReactNode
}

/**
 * A photo box (DESIGN.md: photo-box): 12 px corners, washed with the photo's tone and a short glow under the
 * product (tone-wash in globals.css). A cut-out floats inside it with space around it; any other photo fills it.
 */
export function PhotoBox({
  photo,
  alt,
  sizes,
  priority = false,
  className,
  imageClassName,
  cutoutClassName = "p-[10%] pb-[15%]",
  children,
}: PhotoBoxProps) {
  return (
    <div
      style={toneStyle(photo.tone)}
      className={cn("relative overflow-hidden rounded-xl tone-wash", className)}
    >
      <Image
        src={photo.src}
        alt={alt}
        fill
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={cn(
          "transition-transform duration-300",
          photo.cutout ? cn("object-contain", cutoutClassName) : "object-cover",
          imageClassName
        )}
      />
      {children}
    </div>
  )
}
