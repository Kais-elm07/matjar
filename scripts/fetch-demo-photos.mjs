#!/usr/bin/env node
/**
 * يحمّل الصور التجريبية الحقيقية المذكورة في assets/images/sources.json من Pexels
 * إلى assets/images/products و assets/images/categories، ثم يكفي pnpm images لتجهيزها.
 *
 *   node scripts/fetch-demo-photos.mjs            يحمّل الناقص فقط
 *   node scripts/fetch-demo-photos.mjs --force    يعيد تحميل الكل
 *
 * الصور مرخصة من Pexels للاستخدام الحر دون نسب، وهي للعرض حتى تُستبدل بصور منتجاتك.
 */
import { existsSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const ROOT = process.cwd()
const force = process.argv.includes("--force")
const sources = JSON.parse(
  await readFile(path.join(ROOT, "assets", "images", "sources.json"), "utf8")
)

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
