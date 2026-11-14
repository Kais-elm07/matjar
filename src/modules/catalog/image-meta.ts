import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

import { isImageMeta } from "@/modules/catalog/guards"
import type { ImageMeta } from "@/modules/catalog/types"

/**
 * The colors pnpm images measures in every photo, from public/images/image-meta.json: the tone of the
 * light behind it (DESIGN.md: the product's tone) and whether it is a cut-out. pnpm db:seed stores them
 * with each photo in the database, so the server never reads this file.
 */

export function readImageMeta(): ImageMeta {
  const file = path.join(process.cwd(), "public", "images", "image-meta.json")
  if (!existsSync(file)) {
    throw new Error(
      "ملف ألوان الصور public/images/image-meta.json غير موجود. شغّل pnpm images أولاً."
    )
  }
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
