#!/usr/bin/env node
/**
 * خطوط المتجر.
 *
 *   pnpm fonts   يصغّر ملفات الخط الأصلية في assets/fonts إلى ملفات أخف داخل src/fonts،
 *                تحوي فقط الحروف التي يحتاجها المتجر. الملفات الناتجة تُحفظ في Git لأن البناء يحتاجها.
 *
 * القواعد:
 *   - الملف الذي يحوي اسمه "-arabic-" يحتفظ بالحروف العربية والتشكيل وعلامات الترقيم العربية.
 *   - الملف الذي يحوي اسمه "-latin-" يحتفظ بالأرقام 0-9 والحروف الإنجليزية وعلامات الترقيم الأساسية.
 *   - أي ملف آخر، مثل ترخيص الخط، يُنسخ كما هو.
 *   - تُحذف تعليمات التلميح (hinting) كما في خطوط Google المتغيرة، لأن الشاشات الحديثة لا تحتاجها.
 *
 * النتيجة: حجم الخط بأوزانه الثلاثة 66 كيلوبايت بدل 190، فتظهر الصفحة أسرع على الجوال.
 * لإضافة حروف لغة أخرى: أضف نطاقها إلى القائمة المناسبة في CHARACTERS ثم شغّل pnpm fonts.
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
    // المسافة والمسافة غير القابلة للكسر
    0x20,
    0xa0,
    // ، ؛ ؟
    0x60c,
    0x61b,
    0x61f,
    // الحروف من ء إلى غ
    ...range(0x621, 0x63a),
    // التطويل، والحروف من ف إلى ي، والتشكيل والهمزة فوق الحرف وتحته
    ...range(0x640, 0x655),
    // الأرقام الهندية ٠-٩ وعلامات ٪ ٫ ٬
    ...range(0x660, 0x66d),
    // الألف الخنجرية وألف الوصل
    0x670,
    0x671,
    // پ چ ژ ک گ ی: تظهر أحياناً في الأسماء المعرّبة
    0x67e,
    0x686,
    0x698,
    0x6a9,
    0x6af,
    0x6cc,
    // محارف التحكم في وصل الحروف واتجاه النص
    ...range(0x200c, 0x200f),
    // الشرطة القصيرة، والأقواس المزخرفة ﴾ ﴿
    0x2010,
    0x2011,
    0xfd3e,
    0xfd3f,
  ],
  latin: [
    // الأرقام والحروف الإنجليزية وعلامات الترقيم الأساسية
    ...range(0x20, 0x7e),
    // مسافة غير قابلة للكسر، © « ° · » ×
    0xa0,
    0xa9,
    0xab,
    0xb0,
    0xb7,
    0xbb,
    0xd7,
    // الشرطات وعلامات التنصيص والنقطة والنقاط الثلاث وعلامة الطرح
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

// أسماء ملفات Fontsource بصيغة <الخط>-<المجموعة>-<الوزن>-<النمط>.woff2،
// واسم الخط نفسه قد يحوي "arabic"، فتُقرأ المجموعة من موضعها قبل الوزن.
function subsetOf(fileName) {
  const subset = fileName.match(
    /-([a-z]+)-\d{3}-(?:normal|italic)\.woff2$/
  )?.[1]
  return subset in CHARACTERS ? subset : undefined
}

const kilobytes = (bytes) => `${(bytes / 1024).toFixed(1)}KB`

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
    const subset = subsetOf(fileName)

    if (!subset) {
      await copyFile(source, output)
      continue
    }

    const original = await readFile(source)
    const smaller = await subsetFont(
      original,
      String.fromCodePoint(...CHARACTERS[subset]),
      { targetFormat: "woff2", noHinting: true }
    )
    await writeFile(output, smaller)
    console.log(
      `${family}/${fileName}: ${kilobytes(original.length)} → ${kilobytes(smaller.length)}`
    )
  }
}
