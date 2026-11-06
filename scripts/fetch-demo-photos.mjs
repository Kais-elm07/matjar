#!/usr/bin/env node
/**
 * Downloads the original Pexels photos behind the demo product photos, listed in assets/images/sources.json,
 * into assets/images/products; after that, pnpm images is enough to prepare them.
 *
 * The demo photos in the project are cut-outs: these photos with their backgrounds removed (DESIGN.md: Product
 * photos). So a photo is downloaded only when no photo with its name exists yet, whatever its extension, and a
 * cut-out is never replaced by its original.
 *
 *   node scripts/fetch-demo-photos.mjs            downloads only the missing photos
 *   node scripts/fetch-demo-photos.mjs --force    also downloads again the photos that are still original JPEGs
 *
 * The photos are licensed by Pexels for free use without attribution, and they are for display until they are replaced with photos of your products.
 */
import { existsSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const ROOT = process.cwd()
const force = process.argv.includes("--force")
const SOURCES_FILE = path.join(ROOT, "assets", "images", "sources.json")
const PHOTOS_DIR = path.join(ROOT, "assets", "images", "products")
/** The extensions pnpm images reads; a photo with any of them already exists. */
const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"]

/** The photo list: the file name without an extension and the photo's ID on Pexels. */
async function readSources() {
  let sources
  try {
    sources = JSON.parse(await readFile(SOURCES_FILE, "utf8"))
  } catch (error) {
    console.error(
      `تعذّرت قراءة assets/images/sources.json: ${error.code === "ENOENT" ? "الملف غير موجود" : "الملف ليس JSON صحيحاً"}.`
    )
    process.exit(1)
  }
  const entries = sources.products
  const valid =
    entries &&
    typeof entries === "object" &&
    Object.values(entries).every((id) => Number.isInteger(id) && id > 0)
  if (!valid) {
    console.error(
      'assets/images/sources.json: الحقل "products" يجب أن يكون قائمة أسماء وأرقام صور، مثل { "shirt-1": 5746087 }.'
    )
    process.exit(1)
  }
  return entries
}

const photos = await readSources()

const url = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`

async function download(id, file, attempt = 1) {
  try {
    const response = await fetch(url(id), {
      headers: { "User-Agent": "Mozilla/5.0 (matjar demo photos)" },
      signal: AbortSignal.timeout(60000),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const bytes = new Uint8Array(await response.arrayBuffer())
    if (bytes.length < 10000)
      throw new Error(`ملف صغير جداً (${bytes.length} بايت)`)
    await writeFile(file, bytes)
    return `${(bytes.length / 1024).toFixed(0)}KB`
  } catch (error) {
    if (attempt < 3) return download(id, file, attempt + 1)
    throw error
  }
}

/** The extension of the photo with this name in the folder, or null when there is none. */
const existingExtension = (name) =>
  EXTENSIONS.find((extension) =>
    existsSync(path.join(PHOTOS_DIR, `${name}${extension}`))
  ) ?? null

let done = 0
let skipped = 0
const failed = []
await mkdir(PHOTOS_DIR, { recursive: true })
for (const [name, id] of Object.entries(photos)) {
  const existing = existingExtension(name)
  if (existing && !(force && existing === ".jpg")) {
    skipped++
    continue
  }
  const file = path.join(PHOTOS_DIR, `${name}.jpg`)
  try {
    const size = await download(id, file)
    done++
    console.log(`products/${name}.jpg ← pexels ${id} (${size})`)
  } catch (error) {
    failed.push(`products/${name}.jpg (pexels ${id}): ${error.message}`)
  }
}

console.log(`\nحُمّلت ${done} صورة، و${skipped} موجودة من قبل.`)
if (failed.length) {
  console.error(`تعذّر تحميل ${failed.length}:\n- ${failed.join("\n- ")}`)
  process.exitCode = 1
}
