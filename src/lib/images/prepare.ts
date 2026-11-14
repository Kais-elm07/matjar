import sharp from "sharp"

import type { ImageMeta } from "@/modules/catalog/types"
import { IMAGE_WIDTHS } from "@/lib/image-loader"

/**
 * Preparing a product photo for the store, the same way for the photos in assets/images (pnpm images,
 * scripts/images.ts) and the ones the store owner uploads in the admin panel (src/modules/admin/uploads.ts):
 * five WebP copies, one per width the image loader picks from, and the photo's look, which the site
 * turns into the light behind it (DESIGN.md: the product's tone). It runs outside Next.js too, so it
 * imports nothing that needs the server.
 */

/** A photo's main color as #rrggbb, or null when it has none, and whether it is a cut-out. */
type MeasuredLook = ImageMeta[string]

/** A photo whose transparent pixels cover at least this share of it is a cut-out. */
const CUTOUT_SHARE = 0.01
/** Below this average strength of color per pixel, a photo has no clear color (a black speaker, a white shirt). */
const MIN_COLORFUL = 0.04
/** Below this agreement between the hues of the colorful pixels (0 to 1), the photo has no single main color. */
const MIN_AGREEMENT = 0.45
/** Colorful pixels within this many degrees of the most common hue make up the main color. */
const HUE_RANGE = 30
/** The photo is measured at this size: enough for its colors, and quick. */
const MEASURE_SIZE = 96

/**
 * The five WebP copies of a photo, smallest first, at the widths of IMAGE_WIDTHS. A copy is never
 * wider than the photo itself, and WebP keeps the transparent background of a cut-out. The photo is
 * decoded once for all five.
 */
export function webpCopies(input: string | Buffer) {
  // rotate() turns a phone photo the right way up from its orientation tag
  const photo = sharp(input).rotate()
  return Promise.all(
    IMAGE_WIDTHS.map(async (width) => ({
      width,
      data: await photo
        .clone()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80, effort: 5 })
        .toBuffer(),
    }))
  )
}

/** The hue of an RGB color in degrees, as on a color wheel (0 red, 120 green, 240 blue). */
function hueOf(red: number, green: number, blue: number) {
  const max = Math.max(red, green, blue)
  const delta = max - Math.min(red, green, blue)
  const sector =
    max === red
      ? ((green - blue) / delta) % 6
      : max === green
        ? (blue - red) / delta + 2
        : (red - green) / delta + 4
  return (sector * 60 + 360) % 360
}

function hueDistance(a: number, b: number) {
  const distance = Math.abs(a - b) % 360
  return distance > 180 ? 360 - distance : distance
}

const toHex = (channels: number[]) =>
  `#${channels.map((value) => Math.round(value).toString(16).padStart(2, "0")).join("")}`

interface ColorfulPixel {
  red: number
  green: number
  blue: number
  hue: number
  vividness: number
}

/**
 * A photo's look from its pixels, four bytes each (red, green, blue, alpha). The main color is the
 * average of the colorful pixels around their most common hue, weighted by how vivid each one is, so a
 * few pixels of another color don't change it. Transparent pixels don't count, so a cut-out's color is
 * the product's own. Dark, gray and white pixels have no clear hue, so a photo made of them has no
 * color (null).
 */
export function lookFromPixels(data: Uint8Array): MeasuredLook {
  const pixelCount = data.length / 4
  let transparent = 0
  let opaque = 0
  let x = 0
  let y = 0
  let weight = 0
  const colorful: ColorfulPixel[] = []
  for (let index = 0; index < data.length; index += 4) {
    const alpha = data[index + 3]
    if (alpha < 250) transparent++
    if (alpha < 128) continue
    opaque++
    const red = data[index]
    const green = data[index + 1]
    const blue = data[index + 2]
    const max = Math.max(red, green, blue)
    const min = Math.min(red, green, blue)
    const saturation = max === 0 ? 0 : (max - min) / max
    if (max < 50 || saturation < 0.25) continue
    const hue = hueOf(red, green, blue)
    const vividness = saturation * (max / 255)
    const angle = (hue * Math.PI) / 180
    x += vividness * Math.cos(angle)
    y += vividness * Math.sin(angle)
    weight += vividness
    colorful.push({ red, green, blue, hue, vividness })
  }

  const cutout = pixelCount > 0 && transparent / pixelCount >= CUTOUT_SHARE
  const hasColor =
    opaque > 0 &&
    weight / opaque >= MIN_COLORFUL &&
    Math.hypot(x, y) / weight >= MIN_AGREEMENT
  if (!hasColor) return { color: null, cutout }

  const mainHue = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
  const sum = [0, 0, 0]
  let total = 0
  for (const pixel of colorful) {
    if (hueDistance(pixel.hue, mainHue) > HUE_RANGE) continue
    sum[0] += pixel.red * pixel.vividness
    sum[1] += pixel.green * pixel.vividness
    sum[2] += pixel.blue * pixel.vividness
    total += pixel.vividness
  }
  if (total === 0) return { color: null, cutout }
  return { color: toHex(sum.map((value) => value / total)), cutout }
}

/** A photo's look, measured on a small copy of it. */
export async function measurePhoto(
  input: string | Buffer
): Promise<MeasuredLook> {
  const data = await sharp(input)
    .rotate()
    .resize({ width: MEASURE_SIZE, height: MEASURE_SIZE, fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer()
  return lookFromPixels(data)
}
