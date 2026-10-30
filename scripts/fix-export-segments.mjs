#!/usr/bin/env node
/**
 * تصحيح ملفات التحميل المسبق بعد البناء على Windows.
 *
 * Next.js 16.4 يكتب ملفات التنقل السريع (مثل __next.!KHN0b3JlKQ.category.$d$slug.__PAGE__.txt)
 * على Windows داخل مجلدات متداخلة بدل اسم واحد تفصله نقاط، لأن مسارات Windows تستخدم "\".
 * المتصفح يطلبها بالاسم الصحيح فيحصل على 404 ويعيد تحميل الصفحة كاملة بدلاً منها.
 * هذا السكربت يعيد تسمية الملفات كما يتوقعها المتصفح. على Linux لا يجد شيئاً فلا يغيّر شيئاً.
 */
import { existsSync } from "node:fs"
import { readdir, rename, rm } from "node:fs/promises"
import path from "node:path"

const OUT_DIR = path.join(process.cwd(), "out")

async function filesIn(dir) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true })
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath, entry.name))
}

/** يحوّل مجلد __next.X/a/b/c.txt إلى ملف __next.X.a.b.c.txt بجانبه. */
async function flatten(segmentDir) {
  let moved = 0
  for (const file of await filesIn(segmentDir)) {
    const parts = path.relative(segmentDir, file).split(path.sep)
    const target = path.join(
      path.dirname(segmentDir),
      [path.basename(segmentDir), ...parts].join(".")
    )
    await rename(file, target)
    moved++
  }
  await rm(segmentDir, { recursive: true, force: true })
  return moved
}

async function main() {
  if (!existsSync(OUT_DIR)) return
  const entries = await readdir(OUT_DIR, {
    withFileTypes: true,
    recursive: true,
  })
  const segmentDirs = entries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("__next."))
    .map((entry) => path.join(entry.parentPath, entry.name))

  let moved = 0
  for (const dir of segmentDirs) moved += await flatten(dir)
  if (moved > 0) {
    console.log(`تصحيح ملفات التنقل السريع: ${moved} ملف أُعيدت تسميته.`)
  }
}

await main()
