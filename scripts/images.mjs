#!/usr/bin/env node
/**
 * The store's images.
 *
 *   pnpm images        converts the original images in assets/images to WebP at widths of 200, 400, 800 and 1200 pixels
 *                      in public/images. It runs automatically before pnpm dev and pnpm build,
 *                      and skips the images that haven't changed since the last run.
 *   pnpm images:demo   draws demo images (SVG) for the products and categories that have no real photo, then processes them.
 *   pnpm images:photos downloads the Pexels photos listed in assets/images/sources.json (scripts/fetch-demo-photos.mjs).
 *
 * How to add a real product photo:
 *   1. Put the photo in assets/images/products/ with a name such as classic-cotton-shirt-1.jpg
 *   2. In the data file, write the path without the extension: /images/products/classic-cotton-shirt-1
 *
 * Note: the public/images folder is generated automatically, so don't put images in it by hand.
 */
import { existsSync } from "node:fs"
import { mkdir, readdir, rm, stat, writeFile } from "node:fs/promises"
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

// ---------------------------------------------------------------------------
// Demo images: SVG drawings with a gradient background and a Lucide icon in the product's color
// ---------------------------------------------------------------------------

const COLORS = {
  أبيض: "#f1f5f9",
  أسود: "#1f2937",
  رمادي: "#9ca3af",
  أزرق: "#2563eb",
  كحلي: "#1e3a5f",
  أحمر: "#dc2626",
  وردي: "#ec4899",
  أخضر: "#16a34a",
  عنابي: "#7f1d1d",
  بيج: "#d6c4a1",
  بني: "#8b5a2b",
  فضي: "#a8b2bd",
  ذهبي: "#c9a227",
}

/** Categories: the category's color and its icon. */
const DEMO_CATEGORIES = [
  ["clothing", "shirt", "#0f766e"],
  ["men", "shirt", "#0369a1"],
  ["women", "flower-2", "#db2777"],
  ["electronics", "headphones", "#4338ca"],
  ["audio", "headphones", "#6d28d9"],
  ["phone-accessories", "smartphone", "#0e7490"],
  ["home-kitchen", "sofa", "#b45309"],
  ["beauty", "sparkles", "#be185d"],
  ["bags-accessories", "backpack", "#334155"],
]

/** Products: the icon, then one image per color (a color name or a hex shade). alt = a second shot with a different composition. */
const DEMO_PRODUCTS = [
  ["classic-cotton-shirt", "shirt", ["أبيض", "أزرق", "أبيض:alt"]],
  ["lightweight-sneakers", "footprints", ["أسود", "رمادي"]],
  ["floral-summer-dress", "flower-2", ["وردي", "أزرق"]],
  ["elegant-black-abaya", "shirt", ["أسود", "أسود:alt"]],
  ["noise-cancelling-earbuds", "headphones", ["أسود", "أبيض", "أسود:alt"]],
  ["gaming-headset", "headset", ["أسود", "أحمر"]],
  ["portable-speaker", "speaker", ["أسود", "أزرق", "أخضر"]],
  ["fast-charger-65w", "plug-zap", ["#0ea5e9", "#0ea5e9:alt"]],
  ["power-bank-20000", "battery-charging", ["أسود", "أبيض"]],
  ["classic-wrist-watch", "watch", ["فضي", "ذهبي"]],
  ["cookware-set-10", "cooking-pot", ["#ea580c", "#ea580c:alt"]],
  ["wooden-table-lamp", "lamp-desk", ["بيج", "أبيض"]],
  ["luxury-prayer-rug", "moon", ["أخضر", "كحلي", "عنابي"]],
  ["coffee-maker", "coffee", ["#78350f", "#78350f:alt"]],
  ["oud-perfume", "spray-can", ["#b45309", "#b45309:alt"]],
  ["hydrating-face-cream", "droplets", ["#38bdf8", "#38bdf8:alt"]],
  ["pro-hair-dryer", "wind", ["أسود", "وردي"]],
  ["beard-care-kit", "scissors", ["#57534e"]],
  ["travel-backpack", "backpack", ["أسود", "رمادي", "كحلي"]],
  ["leather-wallet", "wallet", ["بني", "أسود"]],
]

function hexToRgb(hex) {
  const value = Number.parseInt(hex.slice(1), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

function mix(hex, otherHex, amount) {
  const a = hexToRgb(hex)
  const b = hexToRgb(otherHex)
  const channels = a.map((channel, i) =>
    Math.round(channel + (b[i] - channel) * amount)
  )
  return `#${channels.map((c) => c.toString(16).padStart(2, "0")).join("")}`
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((channel) => channel / 255)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Draws the icon from the internal files of lucide-react. The file path isn't an official API of the library,
 * so if it changes after an update, only drawing the placeholder images stops (pnpm images:demo), not the site build.
 */
async function iconMarkup(name) {
  const { __iconData } = await import(`lucide-react/dist/esm/icons/${name}.mjs`)
  return __iconData.node
    .map(([tag, attributes]) => {
      const attrs = Object.entries(attributes)
        .filter(([key]) => key !== "key")
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ")
      return `<${tag} ${attrs}/>`
    })
    .join("")
}

/** A product image: a light background in the product's color and an icon in a dark shade of it. */
function productSvg(icon, base, alternate) {
  const isLight = luminance(base) > 0.75
  const tint = isLight ? "#e2e8f0" : base
  const backgroundFrom = mix(tint, "#ffffff", alternate ? 0.62 : 0.8)
  const backgroundTo = mix(tint, "#ffffff", alternate ? 0.82 : 0.6)
  const stroke = isLight ? "#475569" : mix(base, "#000000", 0.25)
  const fill = isLight ? "#ffffff" : mix(base, "#ffffff", 0.88)
  const iconBox = alternate
    ? `x="380" y="300" width="560" height="560" transform="rotate(-12 660 580)"`
    : `x="300" y="260" width="600" height="600"`
  const decorations = alternate
    ? `<circle cx="300" cy="320" r="170" fill="${tint}" opacity="0.18"/>
       <circle cx="930" cy="930" r="110" fill="#ffffff" opacity="0.6"/>`
    : `<circle cx="600" cy="560" r="390" fill="${fill}" opacity="0.9"/>
       <circle cx="990" cy="190" r="90" fill="#ffffff" opacity="0.55"/>
       <circle cx="190" cy="1010" r="60" fill="${tint}" opacity="0.15"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${backgroundFrom}"/>
      <stop offset="1" stop-color="${backgroundTo}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="1200" fill="url(#bg)"/>
  ${decorations}
  <ellipse cx="600" cy="1000" rx="290" ry="30" fill="#0f172a" opacity="0.07"/>
  <svg ${iconBox} viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round">${ICONS.get(icon)}</svg>
</svg>`
}

/** A category image: a background in the category's color and a white icon. */
function categorySvg(icon, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${mix(color, "#ffffff", 0.15)}"/>
      <stop offset="1" stop-color="${mix(color, "#000000", 0.2)}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="1200" fill="url(#bg)"/>
  <circle cx="600" cy="600" r="400" fill="#ffffff" opacity="0.1"/>
  <circle cx="1010" cy="170" r="120" fill="#ffffff" opacity="0.08"/>
  <svg x="330" y="330" width="540" height="540" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">${ICONS.get(icon)}</svg>
</svg>`
}

const ICONS = new Map()

/** A real photo with the same name (jpg, png, webp or avif) replaces the demo drawing. */
const hasPhoto = (dir, name) =>
  [".jpg", ".jpeg", ".png", ".webp", ".avif"].some((ext) =>
    existsSync(path.join(dir, `${name}${ext}`))
  )

async function generateDemoImages() {
  const iconNames = new Set([
    ...DEMO_CATEGORIES.map(([, icon]) => icon),
    ...DEMO_PRODUCTS.map(([, icon]) => icon),
  ])
  for (const name of iconNames) ICONS.set(name, await iconMarkup(name))

  const categoriesDir = path.join(SOURCE_DIR, "categories")
  const productsDir = path.join(SOURCE_DIR, "products")
  await mkdir(categoriesDir, { recursive: true })
  await mkdir(productsDir, { recursive: true })

  for (const [slug, icon, color] of DEMO_CATEGORIES) {
    if (hasPhoto(categoriesDir, slug)) continue
    await writeFile(
      path.join(categoriesDir, `${slug}.svg`),
      categorySvg(icon, color)
    )
  }

  let count = 0
  for (const [slug, icon, shots] of DEMO_PRODUCTS) {
    for (const [index, shot] of shots.entries()) {
      if (hasPhoto(productsDir, `${slug}-${index + 1}`)) continue
      const [colorName, mode] = shot.split(":")
      const base = COLORS[colorName] ?? colorName
      await writeFile(
        path.join(productsDir, `${slug}-${index + 1}.svg`),
        productSvg(icon, base, mode === "alt")
      )
      count++
    }
  }
  console.log(
    `الصور التجريبية: ${DEMO_CATEGORIES.length} فئة و${count} صورة منتج في assets/images.`
  )
}

if (process.argv.includes("--demo")) await generateDemoImages()
await processImages()
