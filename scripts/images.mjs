#!/usr/bin/env node
/**
 * The store's images.
 *
 *   pnpm images        converts the original images in assets/images to WebP at widths of 200, 400, 800 and 1200 pixels
 *                      in public/images. It runs automatically before pnpm dev and pnpm build,
 *                      and skips the images that haven't changed since the last run.
 *   pnpm images:photos downloads the Pexels photos listed in assets/images/sources.json (scripts/fetch-demo-photos.mjs).
 *
 * How to add a real product photo:
 *   1. Put the photo in assets/images/products/ with a name such as classic-cotton-shirt-1.jpg
 *   2. In the data file, write the path without the extension: /images/products/classic-cotton-shirt-1
 *
 * Note: the public/images folder is generated automatically, so don't put images in it by hand.
 */
import { existsSync } from "node:fs"
import { mkdir, readdir, rm, stat } from "node:fs/promises"
import path from "node:path"

import sharp from "sharp"

const ROOT = process.cwd()
const SOURCE_DIR = path.join(ROOT, "assets", "images")
const OUTPUT_DIR = path.join(ROOT, "public", "images")
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
        .webp({ quality: 80, effort: 5 })
        .toFile(file)
    )
  )
}

async function processImages() {
  const sources = (await listFiles(SOURCE_DIR)).filter((file) =>
    SOURCE_EXTENSIONS.has(path.extname(file).toLowerCase())
  )

  const expected = new Map()
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

    if (await isUpToDate(source, outputs)) {
      skipped++
      continue
    }
    try {
      await convert(source, outputs)
      converted++
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

  console.log(
    `الصور: ${converted} جديدة أو محدّثة، ${skipped} دون تغيير${removed ? `، ${removed} نسخة قديمة حُذفت` : ""}.`
  )
}

await processImages()
