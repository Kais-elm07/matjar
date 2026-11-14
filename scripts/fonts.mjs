#!/usr/bin/env node
/**
 * The store's fonts.
 *
 *   pnpm fonts   shrinks the original font files in assets/fonts into lighter files in src/fonts
 *                that contain only the characters the store needs. The output files are kept in Git because the build needs them:
 *                WOFF2 for the site's pages, and TTF with the same characters for drawing text in the share images.
 *
 * Rules:
 *   - A file whose name contains "-arabic-" keeps the Arabic letters, the diacritics and Arabic punctuation.
 *   - A file whose name contains "-latin-" keeps the digits 0-9, English letters and basic punctuation.
 *   - Any other file, such as the font license, is copied as it is.
 *   - Hinting instructions are removed, as in Google's variable fonts, because modern screens don't need them.
 *
 * Result: the font in its three weights is 66 KB instead of 190, so the page appears faster on phones.
 * To add the letters of another language: add its range to the matching list in CHARACTERS, then run pnpm fonts.
 */
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises"
import path from "node:path"

import subsetFont from "subset-font"

const ROOT = process.cwd()
const SOURCE_DIR = path.join(ROOT, "assets", "fonts")
const OUTPUT_DIR = path.join(ROOT, "src", "fonts")

const range = (from, to) =>
  Array.from({ length: to - from + 1 }, (_, index) => from + index)

const CHARACTERS = {
  arabic: [
    // Space and non-breaking space
    0x20,
    0xa0,
    // ، ؛ ؟ (Arabic comma, semicolon and question mark)
    0x60c,
    0x61b,
    0x61f,
    // The letters from ء to غ
    ...range(0x621, 0x63a),
    // Tatweel, the letters from ف to ي, the diacritics, and hamza above and below a letter
    ...range(0x640, 0x655),
    // Arabic-Indic digits ٠-٩ and the signs ٪ ٫ ٬
    ...range(0x660, 0x66d),
    // Superscript (dagger) alef and alef wasla
    0x670,
    0x671,
    // پ چ ژ ک گ ی: these sometimes appear in Arabized names
    0x67e,
    0x686,
    0x698,
    0x6a9,
    0x6af,
    0x6cc,
    // Control characters for letter joining and text direction
    ...range(0x200c, 0x200f),
    // Hyphen, and the ornate parentheses ﴾ ﴿
    0x2010,
    0x2011,
    0xfd3e,
    0xfd3f,
  ],
  latin: [
    // Digits, English letters and basic punctuation
    ...range(0x20, 0x7e),
    // Non-breaking space, © « ° · » ×
    0xa0,
    0xa9,
    0xab,
    0xb0,
    0xb7,
    0xbb,
    0xd7,
    // Dashes, quotation marks, the bullet, the ellipsis and the minus sign
    0x2013,
    0x2014,
    0x2018,
    0x2019,
    0x201c,
    0x201d,
    0x2022,
    0x2026,
    0x2212,
  ],
}

// Fontsource file names have the form <font>-<subset>-<weight>-<style>.woff2,
// and the font name itself may contain "arabic", so the subset is read from its position before the weight.
function parseFileName(fileName) {
  const match = fileName.match(/-([a-z]+)-(\d{3})-(normal|italic)\.woff2$/)
  if (!match || !(match[1] in CHARACTERS)) return undefined
  return {
    subset: match[1],
    weight: Number(match[2]),
    italic: match[3] === "italic",
  }
}

const kilobytes = (bytes) => `${(bytes / 1024).toFixed(1)}KB`

// ---------------------------------------------------------------------------
// TTF files for the share images
// ---------------------------------------------------------------------------
// The tool that draws text in the share images (Pango inside sharp) can't read WOFF2, so a TTF copy with the same characters is saved.
// The Arabic and Latin files originally carry the same family name, so the tool chooses between them
// by the order they were loaded in, and may draw the digits in another font. So each subset's file gets its own family name
// (such as "IBM Plex Sans Arabic Latin"), and src/modules/share-images/render.ts asks for the two families in order.
// The weight is also written in name IDs 16 and 17, so that weight 500 is chosen by its name.

const FAMILY_SUFFIX = { arabic: "", latin: " Latin" }

const WEIGHT_NAMES = {
  100: "Thin",
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
  800: "ExtraBold",
  900: "Black",
}

function checksum(buffer) {
  let sum = 0
  for (let i = 0; i < buffer.length; i += 4) {
    sum = (sum + buffer.readUInt32BE(i)) >>> 0
  }
  return sum
}

function readTables(font) {
  const tables = new Map()
  for (let i = 0; i < font.readUInt16BE(4); i++) {
    const record = 12 + i * 16
    const offset = font.readUInt32BE(record + 8)
    const length = font.readUInt32BE(record + 12)
    tables.set(
      font.toString("latin1", record, record + 4),
      font.subarray(offset, offset + length)
    )
  }
  return tables
}

/** The font's names in the Windows encoding (UTF-16), keyed by name ID. */
function readNames(table) {
  const names = new Map()
  const storage = table.readUInt16BE(4)
  for (let i = 0; i < table.readUInt16BE(2); i++) {
    const record = 6 + i * 12
    if (table.readUInt16BE(record) !== 3) continue
    const start = storage + table.readUInt16BE(record + 10)
    const length = table.readUInt16BE(record + 8)
    const utf16be = Buffer.from(table.subarray(start, start + length))
    names.set(
      table.readUInt16BE(record + 6),
      utf16be.swap16().toString("utf16le")
    )
  }
  return names
}

function buildNameTable(names) {
  const entries = [...names].sort(([a], [b]) => a - b)
  const strings = entries.map(([, value]) =>
    Buffer.from(value, "utf16le").swap16()
  )
  const header = Buffer.alloc(6 + entries.length * 12)
  header.writeUInt16BE(entries.length, 2)
  header.writeUInt16BE(header.length, 4)
  let offset = 0
  entries.forEach(([nameId], i) => {
    const record = 6 + i * 12
    header.writeUInt16BE(3, record) // Windows
    header.writeUInt16BE(1, record + 2) // Unicode
    header.writeUInt16BE(0x409, record + 4) // en-US
    header.writeUInt16BE(nameId, record + 6)
    header.writeUInt16BE(strings[i].length, record + 8)
    header.writeUInt16BE(offset, record + 10)
    offset += strings[i].length
  })
  return Buffer.concat([header, ...strings])
}

/** Rebuilds the font file from its tables, computing the offsets and checksums again. */
function buildFont(font, tables) {
  const tags = [...tables.keys()].sort()
  const directory = Buffer.alloc(12 + tags.length * 16)
  font.copy(directory, 0, 0, 12)
  const parts = []
  let offset = directory.length
  tags.forEach((tag, i) => {
    const data = tables.get(tag)
    const padded = Buffer.alloc((data.length + 3) & ~3)
    data.copy(padded)
    if (tag === "head") padded.writeUInt32BE(0, 8)
    const record = 12 + i * 16
    directory.write(tag, record, "latin1")
    directory.writeUInt32BE(checksum(padded), record + 4)
    directory.writeUInt32BE(offset, record + 8)
    directory.writeUInt32BE(data.length, record + 12)
    parts.push(padded)
    offset += padded.length
  })
  const result = Buffer.concat([directory, ...parts])
  const head = result.readUInt32BE(12 + tags.indexOf("head") * 16 + 8)
  result.writeUInt32BE((0xb1b0afba - checksum(result)) >>> 0, head + 8)
  return result
}

function renameFamily(font, { subset, weight, italic }) {
  const tables = readTables(font)
  const names = readNames(tables.get("name"))
  const weightName = WEIGHT_NAMES[weight] ?? "Regular"
  const weightWords = new RegExp(` (${Object.values(WEIGHT_NAMES).join("|")})$`)
  const original = names.get(16) ?? names.get(1)
  if (!original) {
    throw new Error(
      "ملف الخط لا يحوي اسم العائلة (الجدول name)، فلا يمكن تجهيزه. استخدم ملفات Fontsource الأصلية."
    )
  }
  const family = original.replace(weightWords, "") + FAMILY_SUFFIX[subset]
  const style = !italic
    ? weightName
    : weight === 400
      ? "Italic"
      : `${weightName} Italic`
  const isBasicStyle = weight === 400 || weight === 700

  names.set(1, isBasicStyle ? family : `${family} ${weightName}`)
  names.set(2, isBasicStyle ? style : italic ? "Italic" : "Regular")
  names.set(4, `${family} ${style}`)
  names.set(6, `${family}-${style}`.replaceAll(" ", ""))
  names.set(3, names.get(6))
  names.set(16, family)
  names.set(17, style)
  tables.set("name", buildNameTable(names))
  return buildFont(font, tables)
}

const families = (await readdir(SOURCE_DIR, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

for (const family of families) {
  const sourceDir = path.join(SOURCE_DIR, family)
  const outputDir = path.join(OUTPUT_DIR, family)
  await rm(outputDir, { recursive: true, force: true })
  await mkdir(outputDir, { recursive: true })

  for (const fileName of (await readdir(sourceDir)).sort()) {
    const source = path.join(sourceDir, fileName)
    const output = path.join(outputDir, fileName)
    const info = parseFileName(fileName)

    if (!info) {
      await copyFile(source, output)
      continue
    }

    const original = await readFile(source)
    const characters = String.fromCodePoint(...CHARACTERS[info.subset])
    const smaller = await subsetFont(original, characters, {
      targetFormat: "woff2",
      noHinting: true,
    })
    await writeFile(output, smaller)

    const truetype = renameFamily(
      await subsetFont(original, characters, {
        targetFormat: "truetype",
        noHinting: true,
        preserveNameIds: [16, 17],
      }),
      info
    )
    await writeFile(output.replace(/\.woff2$/, ".ttf"), truetype)
    console.log(
      `${family}/${fileName}: ${kilobytes(original.length)} → ${kilobytes(smaller.length)} (TTF ${kilobytes(truetype.length)})`
    )
  }
}
