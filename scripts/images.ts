/**
 * The store's images.
 *
 *   pnpm images        converts the original images in assets/images to WebP at widths of 200, 400, 600, 800 and 1200 pixels
 *                      in public/images. It runs automatically before pnpm dev and pnpm build,
 *                      and skips the images that haven't changed since the last run.
 *                      It also writes public/images/image-meta.json: each photo's main color and whether it is a cut-out,
 *                      which the site turns into the light behind the photo (DESIGN.md: the product's tone).
 *                      The copies and the colors are made by src/lib/images/prepare.ts, as for the photos uploaded
 *                      in the admin panel.
 *   pnpm images:photos downloads the Pexels photos listed in assets/images/sources.json (scripts/fetch-demo-photos.mjs).
 *
 * How to add a real product photo:
 *   1. Remove the photo's background, so the product stands alone on a transparent background (a cut-out),
 *      and save it as PNG or WebP, at least 1200 pixels on its long side (DESIGN.md: Product photos).
 *   2. Put it in assets/images/products/ with a name such as classic-cotton-shirt-1.png
 *   3. In the data file, write the path without the extension: /images/products/classic-cotton-shirt-1
 * The admin panel can upload a photo instead (/admin/), which needs none of these steps.
 *
 * Note: the public/images folder is generated automatically, so don't put images in it by hand.
 */
import { existsSync } from "node:fs"
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises"
import path from "node:path"

import { isImageMeta } from "@/modules/catalog/guards"
import type { ImageMeta } from "@/modules/catalog/types"
import { IMAGE_WIDTHS } from "@/lib/image-loader"
import { measurePhoto, webpCopies } from "@/lib/images/prepare"

const ROOT = process.cwd()
const SOURCE_DIR = path.join(ROOT, "assets", "images")
const OUTPUT_DIR = path.join(ROOT, "public", "images")
// Read by src/modules/catalog/image-meta.ts when the database is seeded
const META_FILE = path.join(OUTPUT_DIR, "image-meta.json")
const SOURCE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".svg",
])
const OUTPUT_PATTERN = new RegExp(`-(${IMAGE_WIDTHS.join("|")})\\.webp$`)

interface Output {
  width: number
  file: string
}

async function listFiles(dir: string) {
  if (!existsSync(dir)) return []
  const entries = await readdir(dir, { withFileTypes: true, recursive: true })
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath, entry.name))
}

function outputsFor(sourceFile: string): Output[] {
  const { dir, name } = path.parse(path.relative(SOURCE_DIR, sourceFile))
  return IMAGE_WIDTHS.map((width) => ({
    width,
    file: path.join(OUTPUT_DIR, dir, `${name}-${width}.webp`),
  }))
}

/** The path the data files use for a source image: assets/images/products/x-1.png → /images/products/x-1 */
function dataPath(sourceFile: string) {
  const { dir, name } = path.parse(path.relative(SOURCE_DIR, sourceFile))
  return ["/images", ...dir.split(path.sep).filter(Boolean), name].join("/")
}

async function isUpToDate(sourceFile: string, outputs: Output[]) {
  const sourceTime = (await stat(sourceFile)).mtimeMs
  for (const { file } of outputs) {
    if (!existsSync(file) || (await stat(file)).mtimeMs < sourceTime) {
      return false
    }
  }
  return true
}

async function convert(sourceFile: string, outputs: Output[]) {
  await mkdir(path.dirname(outputs[0].file), { recursive: true })
  const copies = await webpCopies(sourceFile)
  await Promise.all(
    copies.map((copy, index) => writeFile(outputs[index].file, copy.data))
  )
}

/** The colors measured in the last run, so an image that hasn't changed isn't measured again. */
async function previousMeta(): Promise<ImageMeta> {
  try {
    const meta: unknown = JSON.parse(await readFile(META_FILE, "utf8"))
    return isImageMeta(meta) ? meta : {}
  } catch {
    return {}
  }
}

async function processImages() {
  const sources = (await listFiles(SOURCE_DIR)).filter((file) =>
    SOURCE_EXTENSIONS.has(path.extname(file).toLowerCase())
  )

  const expected = new Map<string, string>()
  const previous = await previousMeta()
  const meta: ImageMeta = {}
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
      meta[dataPath(source)] = known ?? (await measurePhoto(source))
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)
      console.error(
        `تعذّرت معالجة الصورة ${path.relative(ROOT, source)}: ${reason}`
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

void processImages()
