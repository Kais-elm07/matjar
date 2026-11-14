"use client"

import Image from "next/image"
import { useWatch } from "react-hook-form"

import {
  ADMIN_THUMB,
  ADMIN_THUMB_IMAGE,
} from "@/modules/admin/components/admin-styles"
import type { ProductFormValues } from "@/modules/admin/product-form"

interface PhotoPreviewProps {
  /** The photo's place in the form's list of photos */
  index: number
}

/** A small thumbnail of the photo whose address is in the form now: a typed path or an uploaded photo. */
export function PhotoPreview({ index }: PhotoPreviewProps) {
  const src = useWatch<ProductFormValues, `images.${number}.src`>({
    name: `images.${index}.src`,
  }).trim()
  // Only an address the image loader can read: a path in the store or a full address
  const shown = src.startsWith("/") || /^https?:\/\/./.test(src)

  return (
    <span className={ADMIN_THUMB}>
      {shown && (
        <Image
          src={src}
          alt=""
          fill
          sizes="64px"
          className={ADMIN_THUMB_IMAGE}
        />
      )}
    </span>
  )
}
