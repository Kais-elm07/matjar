#!/usr/bin/env node
/**
 * Downloads the real demo photos listed in assets/images/sources.json from Pexels
 * into assets/images/products and assets/images/categories; after that, pnpm images is enough to prepare them.
 *
 *   node scripts/fetch-demo-photos.mjs            downloads only the missing photos
 *   node scripts/fetch-demo-photos.mjs --force    downloads all of them again
 *
 * The photos are licensed by Pexels for free use without attribution, and they are for display until they are replaced with photos of your products.
 */
import { existsSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const ROOT = process.cwd()
const force = process.argv.includes("--force")
const SOURCES_FILE = path.join(ROOT, "assets", "images", "sources.json")

/** The photo list: the file name without an extension and the photo's ID on Pexels, for products and categories. */
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
  for (const key of ["products", "categories"]) {
    const entries = sources[key]
    const valid =
      entries &&
      typeof entries === "object" &&
      Object.values(entries).every((id) => Number.isInteger(id) && id > 0)
    if (!valid) {
      console.error(
        `assets/images/sources.json: الحقل "${key}" يجب أن يكون قائمة أسماء وأرقام صور، مثل { "shirt-1": 5746087 }.`
      )
      process.exit(1)
    }
  }
  return sources
}

const sources = await readSources()

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

let done = 0
let skipped = 0
const failed = []
for (const [folder, entries] of Object.entries({
  products: sources.products,
  categories: sources.categories,
})) {
  const dir = path.join(ROOT, "assets", "images", folder)
  await mkdir(dir, { recursive: true })
  for (const [name, id] of Object.entries(entries)) {
    const file = path.join(dir, `${name}.jpg`)
    if (!force && existsSync(file)) {
      skipped++
      continue
    }
    try {
      const size = await download(id, file)
      done++
      console.log(`${folder}/${name}.jpg ← pexels ${id} (${size})`)
    } catch (error) {
      failed.push(`${folder}/${name}.jpg (pexels ${id}): ${error.message}`)
    }
  }
}

console.log(`\nحُمّلت ${done} صورة، و${skipped} موجودة من قبل.`)
if (failed.length) {
  console.error(`تعذّر تحميل ${failed.length}:\n- ${failed.join("\n- ")}`)
  process.exitCode = 1
}
