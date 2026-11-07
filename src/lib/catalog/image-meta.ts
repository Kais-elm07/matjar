import "server-only"

import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

import { isImageMeta } from "@/lib/catalog/guards"
import type { ImageMeta, PhotoLook } from "@/lib/catalog/types"
import { BRAND_TONE, toneFromHex } from "@/lib/tone"

/**
 * The look of every photo at build time (DESIGN.md: the product's tone): its tone and whether it is a cut-out,
 * from the colors that pnpm images measures in each photo and writes to public/images/image-meta.json.
 */

/**
 * The measured colors, or an empty list when the file doesn't exist yet (pnpm images hasn't run, as in
 * the unit tests); every photo then takes the store's blue and is framed.
 * The catalog is also built in the running server, so the path is written out in full: the server's file
 * tracing then takes this one file, not the whole project.
 */
export function readImageMeta(): ImageMeta {
  const file = path.join(process.cwd(), "public", "images", "image-meta.json")
  if (!existsSync(file)) return {}
  return parseImageMeta(readFileSync(file, "utf8"))
}

/** The colors in the file's text; a broken file stops with an Arabic message. */
export function parseImageMeta(text: string): ImageMeta {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    data = null
  }
  if (!isImageMeta(data)) {
    throw new Error(
      "ملف ألوان الصور public/images/image-meta.json غير صالح. احذفه ثم شغّل pnpm images من جديد."
    )
  }
  return data
}

/**
 * A photo's look: the tone the store owner set for it in the data, or else the color measured from it,
 * or else the store's blue for a photo without a clear color; and whether it is a cut-out.
 */
export function photoLook(
  meta: ImageMeta,
  src: string,
  toneOverride?: string
): PhotoLook {
  const measured = meta[src]
  const color = toneOverride ?? measured?.color
  return {
    tone: (color ? toneFromHex(color) : null) ?? BRAND_TONE,
    cutout: measured?.cutout ?? false,
  }
}
