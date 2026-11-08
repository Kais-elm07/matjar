import sharp from "sharp"
import { describe, expect, it } from "vitest"

import { IMAGE_WIDTHS } from "@/lib/image-loader"
import { lookFromPixels, measurePhoto, webpCopies } from "@/lib/images/prepare"

import { discPhoto } from "./support/photos"

/**
 * Preparing a photo (src/lib/images/prepare.ts), shared by pnpm images and the uploads in the admin
 * panel: the five WebP copies, and the look the light behind the photo takes.
 */

/** How far apart two #rrggbb colors are, as the largest difference of one channel */
function colorDistance(a: string, b: string) {
  const channels = (hex: string) =>
    [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16))
  const first = channels(a)
  const second = channels(b)
  return Math.max(
    ...first.map((value, index) => Math.abs(value - second[index]))
  )
}

/** Raw pixels (red, green, blue, alpha) repeating the given colors */
function pixels(...colors: [number, number, number, number][]) {
  return Uint8Array.from(colors.flat())
}

describe("a photo's look", () => {
  it("measures a cut-out's own color, not its transparent background", async () => {
    const look = await measurePhoto(await discPhoto(400, "#c2410c", "none"))
    expect(look.cutout).toBe(true)
    expect(look.color).not.toBeNull()
    expect(colorDistance(look.color ?? "", "#c2410c")).toBeLessThanOrEqual(3)
  })

  it("finds no color in a gray product, and a photo with a background is not a cut-out", async () => {
    const look = await measurePhoto(await discPhoto(400, "#777777", "#ffffff"))
    expect(look).toEqual({ color: null, cutout: false })
  })

  it("finds no single color when two opposite colors share the photo", () => {
    const red: [number, number, number, number] = [220, 30, 30, 255]
    const cyan: [number, number, number, number] = [30, 220, 220, 255]
    expect(lookFromPixels(pixels(red, cyan, red, cyan))).toEqual({
      color: null,
      cutout: false,
    })
  })

  it("answers an empty photo without dividing by zero", () => {
    expect(lookFromPixels(new Uint8Array())).toEqual({
      color: null,
      cutout: false,
    })
  })
})

describe("the prepared copies", () => {
  it("makes one WebP copy per width, never wider than the photo, and keeps the transparency", async () => {
    const copies = await webpCopies(await discPhoto(1000, "#2563eb", "none"))
    expect(copies.map((copy) => copy.width)).toEqual([...IMAGE_WIDTHS])
    const sizes = await Promise.all(
      copies.map((copy) => sharp(copy.data).metadata())
    )
    expect(sizes.map((meta) => meta.format)).toEqual(
      IMAGE_WIDTHS.map(() => "webp")
    )
    expect(sizes.map((meta) => meta.width)).toEqual([200, 400, 600, 800, 1000])
    expect(sizes.every((meta) => meta.hasAlpha)).toBe(true)
  })
})
