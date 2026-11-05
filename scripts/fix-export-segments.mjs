#!/usr/bin/env node
/**
 * Fixes the prefetch files after a build on Windows.
 *
 * Next.js 16.4 writes the fast navigation files (such as __next.!KHN0b3JlKQ.category.$d$slug.__PAGE__.txt)
 * on Windows into nested folders instead of a single name separated by dots, because Windows paths use "\".
 * The browser requests them by the correct name, gets a 404 and reloads the whole page instead.
 * This script renames the files the way the browser expects them. On Linux it finds nothing, so it changes nothing.
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

/** Turns the folder __next.X/a/b/c.txt into the file __next.X.a.b.c.txt next to it. */
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
