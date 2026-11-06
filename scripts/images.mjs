#!/usr/bin/env node
/**
 * The store's images.
 *
 *   pnpm images        converts the original images in assets/images to WebP at widths of 200, 400, 800 and 1200 pixels
 *                      in public/images. It runs automatically before pnpm dev and pnpm build,
 *                      and skips the images that haven't changed since the last run.
 *                      It also writes public/images/image-meta.json: each photo's main color and whether it is a cut-out,
 *                      which the site turns into the light behind the photo (DESIGN.md: the product's tone).
 *   pnpm images:photos downloads the Pexels photos listed in assets/images/sources.json (scripts/fetch-demo-photos.mjs).
 *
 * How to add a real product photo:
 *   1. Remove the photo's background, so the product stands alone on a transparent background (a cut-out),
 *      and save it as PNG or WebP, at least 1200 pixels on its long side (DESIGN.md: Product photos).
 *   2. Put it in assets/images/products/ with a name such as classic-cotton-shirt-1.png
 *   3. In the data file, write the path without the extension: /images/products/classic-cotton-shirt-1
 *
 * Note: the public/images folder is generated automatically, so don't put images in it by hand.
 */
import { existsSync } from "node:fs"
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises"
import path from "node:path"

import sharp from "sharp"

const ROOT = process.cwd()
const SOURCE_DIR = path.join(ROOT, "assets", "images")
const OUTPUT_DIR = path.join(ROOT, "public", "images")
// Read by src/lib/catalog/image-meta.ts at build time
const META_FILE = path.join(OUTPUT_DIR, "image-meta.json")
// 200 is for the small thumbnails (the gallery, the cart and the search suggestions);
// the same sizes are in IMAGE_WIDTHS (src/lib/image-loader.ts) and next.config.ts
const WIDTHS = [200, 400, 800, 1200]
const SOURCE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".svg",
])
const OUTPUT_PATTERN = new RegExp(`-(${WIDTHS.join("|")})\\.webp$`)

/** A photo whose transparent pixels cover at least this share of it is a cut-out. */
const CUTOUT_SHARE = 0.01
/** Below this average strength of color per pixel, a photo has no clear color (a black speaker, a white shirt). */
const MIN_COLORFUL = 0.04
/** Below this agreement between the hues of the colorful pixels (0 to 1), the photo has no single main color. */
const MIN_AGREEMENT = 0.45
/** Colorful pixels within this many degrees of the most common hue make up the main color. */
const HUE_RANGE = 30

async function listFiles(dir) {
  if (!existsSync(dir)) return []
  const entries = await readdir(dir, { withFileTypes: true, recursive: true })
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath, entry.name))
}

function outputsFor(sourceFile) {
  const { dir, name } = path.parse(path.relative(SOURCE_DIR, sourceFile))
  return WIDTHS.map((width) => ({
    width,
    file: path.join(OUTPUT_DIR, dir, `${name}-${width}.webp`),
  }))
}

/** The path the data files use for a source image: assets/images/products/x-1.png → /images/products/x-1 */
function dataPath(sourceFile) {
  const { dir, name } = path.parse(path.relative(SOURCE_DIR, sourceFile))
  return ["/images", ...dir.split(path.sep).filter(Boolean), name].join("/")
}

async function isUpToDate(sourceFile, outputs) {
  const sourceTime = (await stat(sourceFile)).mtimeMs
  for (const { file } of outputs) {
    if (!existsSync(file) || (await stat(file)).mtimeMs < sourceTime) {
      return false
    }
  }
  return true
}

async function convert(sourceFile, outputs) {
  await mkdir(path.dirname(outputs[0].file), { recursive: true })
  await Promise.all(
    outputs.map(({ width, file }) =>
      sharp(sourceFile)
        .rotate() // Fix the orientation of phone photos automatically
        .resize({ width, withoutEnlargement: true })
        // WebP keeps the transparent background of a cut-out
        .webp({ quality: 80, effort: 5 })
        .toFile(file)
    )
  )
}

/** The hue of an RGB color in degrees, as on a color wheel (0 red, 120 green, 240 blue). */
function hueOf(red, green, blue, max, min) {
  const delta = max - min
  const sector =
    max === red
      ? ((green - blue) / delta) % 6
      : max === green
        ? (blue - red) / delta + 2
        : (red - green) / delta + 4
  return (sector * 60 + 360) % 360
}

const hueDistance = (a, b) => {
  const distance = Math.abs(a - b) % 360
  return distance > 180 ? 360 - distance : distance
}

const toHex = (channels) =>
  `#${channels.map((value) => Math.round(value).toString(16).padStart(2, "0")).join("")}`

/**
 * How a photo looks to the site: its main color, which becomes the light behind it, and whether it is a cut-out.
 * The main color is the average of the colorful pixels around their most common hue, weighted by how vivid each
 * one is, so a few pixels of another color don't change it. Transparent pixels don't count, so a cut-out's color
 * is the product's own. Dark, gray and white pixels have no clear hue, so a photo made of them has no color (null).
 */
async function photoLook(sourceFile) {
  const { data } = await sharp(sourceFile)
    .rotate()
    .resize({ width: 96, height: 96, fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const pixelCount = data.length / 4
  let transparent = 0
  let opaque = 0
  let x = 0
  let y = 0
  let weight = 0
  const colorful = []
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
    const hue = hueOf(red, green, blue, max, min)
    const vividness = saturation * (max / 255)
    const angle = (hue * Math.PI) / 180
    x += vividness * Math.cos(angle)
    y += vividness * Math.sin(angle)
    weight += vividness
    colorful.push({ red, green, blue, hue, vividness })
  }

  const cutout = transparent / pixelCount >= CUTOUT_SHARE
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

/** The colors measured in the last run, so an image that hasn't changed isn't measured again. */
async function previousMeta() {
  try {
    const meta = JSON.parse(await readFile(META_FILE, "utf8"))
    return meta && typeof meta === "object" && !Array.isArray(meta) ? meta : {}
  } catch {
    return {}
  }
}

async function processImages() {
  const sources = (await listFiles(SOURCE_DIR)).filter((file) =>
    SOURCE_EXTENSIONS.has(path.extname(file).toLowerCase())
  )

  const expected = new Map()
  const previous = await previousMeta()
  const meta = {}
  let converted = 0
  let skipped = 0

  for (const source of sources) {
    const outputs = outputsFor(source)
    const key = outputs[0].file
    if (expected.has(key)) {
      console.warn(
        `تنبيه: صورتان بنفس الاسم بامتدادين مختلفين، ستُستخدم واحدة فقط: ${path.relative(ROOT, source)}`
      )
      continue
    }
    for (const output of outputs) expected.set(output.file, source)

    const upToDate = await isUpToDate(source, outputs)
    try {
      if (upToDate) {
        skipped++
      } else {
        await convert(source, outputs)
        converted++
      }
      const known = upToDate ? previous[dataPath(source)] : undefined
      meta[dataPath(source)] = known ?? (await photoLook(source))
    } catch (error) {
      console.error(
        `تعذّرت معالجة الصورة ${path.relative(ROOT, source)}: ${error.message}`
      )
      process.exitCode = 1
    }
  }

  // Delete the copies whose original images were deleted
  let removed = 0
  for (const file of await listFiles(OUTPUT_DIR)) {
    if (OUTPUT_PATTERN.test(file) && !expected.has(file)) {
      await rm(file)
      removed++
    }
  }

  await mkdir(OUTPUT_DIR, { recursive: true })
  const sorted = Object.fromEntries(
    Object.entries(meta).sort(([a], [b]) => a.localeCompare(b))
  )
  await writeFile(META_FILE, `${JSON.stringify(sorted, null, 2)}\n`)

  console.log(
    `الصور: ${converted} جديدة أو محدّثة، ${skipped} دون تغيير${removed ? `، ${removed} نسخة قديمة حُذفت` : ""}.`
  )
}

await processImages()
