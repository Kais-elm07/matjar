import "server-only"

import { createHash } from "node:crypto"
import { existsSync } from "node:fs"
import {
  mkdir,
  readdir,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises"
import os from "node:os"
import path from "node:path"

import sharp, { type OverlayOptions, type Sharp } from "sharp"

import { IMAGE_WIDTHS } from "@/lib/image-loader"

/**
 * أدوات رسم صور المشاركة (Open Graph) وقت البناء: نص عربي بخط المتجر، وصور بزوايا دائرية، وشارات.
 * الرسم بمكتبة sharp، والنص عبر Pango بداخلها، فيتصل الحرف العربي ويُرتب السطر من اليمين.
 */

export const OG_SIZE = { width: 1200, height: 630 }

/** ألوان DESIGN.md المستخدمة في صور المشاركة */
export const OG_COLORS = {
  primary: "#1d2733",
  onPrimary: "#ffffff",
  onPrimaryMuted: "#bbbec2",
  highlight: "#febd69",
  onHighlight: "#111111",
  surfaceMuted: "#f5f5f5",
}

const ROOT = process.cwd()
const FONT_DIR = path.join(ROOT, "src", "fonts", "ibm-plex-sans-arabic")
// العائلتان كما يسمّيهما الأمر pnpm fonts: ملف الأرقام والحروف الإنجليزية أولاً ثم العربية،
// فيأخذ كل حرف شكله من الملف الذي يحويه
const FONT_FAMILIES = "IBM Plex Sans Arabic Latin,IBM Plex Sans Arabic"
const WEIGHT_NAMES = { 400: "", 500: "Medium", 700: "Bold" } as const

type Weight = keyof typeof WEIGHT_NAMES

// مكتبة الخطوط داخل sharp لا تحتمل رسم نص وقراءة SVG في الوقت نفسه من خيطين،
// وكان البناء ينهار أحياناً بخطأ في الذاكرة. لذلك تعمل sharp بخيط واحد،
// وتمر كل عمليات الرسم في طابور واحد على مستوى العملية كلها (globalThis)،
// لأن كل مسار من مسارات الصور قد يحمل نسخته الخاصة من هذا الملف.
sharp.concurrency(1)

const shared = globalThis as typeof globalThis & {
  matjarOgQueue?: Promise<unknown>
  matjarOgFonts?: Promise<void>
}

/** ينفّذ عمليات الرسم واحدة تلو الأخرى. لا تُستدعى من داخل مهمة في الطابور، وإلا انتظرت نفسها. */
function serial<T>(task: () => Promise<T>): Promise<T> {
  const result = (shared.matjarOgQueue ?? Promise.resolve()).then(task)
  shared.matjarOgQueue = result.catch(() => undefined)
  return result
}

const toPng = (image: Sharp) => serial(() => image.png().toBuffer())

/**
 * يسجّل ملفات الخط عند أداة رسم النص مرة واحدة في كل عملية.
 * تُنسخ الملفات أولاً إلى مجلد مؤقت مساره بحروف إنجليزية،
 * لأن مكتبة الخطوط في Windows لا تقرأ المسارات العربية مثل مجلد المشروع.
 */
function prepareFonts() {
  shared.matjarOgFonts ??= (async () => {
    const names = (await readdir(FONT_DIR))
      .filter((name) => name.endsWith(".ttf"))
      .sort()
    if (names.length === 0) {
      throw new Error(
        "صور المشاركة: لا توجد ملفات TTF في src/fonts/ibm-plex-sans-arabic، شغّل pnpm fonts."
      )
    }
    const contents = await Promise.all(
      names.map((name) => readFile(path.join(FONT_DIR, name)))
    )
    const hash = createHash("sha256")
    for (const content of contents) hash.update(content)
    const dir = path.join(
      os.tmpdir(),
      `matjar-og-fonts-${hash.digest("hex").slice(0, 12)}`
    )
    await mkdir(dir, { recursive: true })

    for (const [index, name] of names.entries()) {
      const file = path.join(dir, name)
      if (!existsSync(file)) {
        // كتابة ثم إعادة تسمية، لأن عمليات البناء المتوازية قد تكتب الملف نفسه في الوقت نفسه
        const temporary = `${file}.${process.pid}.tmp`
        await writeFile(temporary, contents[index])
        await rename(temporary, file).catch(() =>
          rm(temporary, { force: true })
        )
      }
      // أداة الرسم تضيف ملف الخط إلى مكتبتها عند أول نص يُرسم به
      await toPng(
        sharp({ text: { text: "x", font: "sans 12", fontfile: file } })
      )
    }
  })()
  return shared.matjarOgFonts
}

export type Layer = { input: Buffer; width: number; height: number }

type TextOptions = {
  size: number
  weight?: Weight
  color: string
  /** أقصى عرض للسطر قبل الانتقال إلى سطر جديد */
  width?: number
  /** أقصى عدد للأسطر، وما يزيد يُختصر بثلاث نقاط */
  maxLines?: number
  strikethrough?: boolean
}

const escapeMarkup = (value: string) =>
  value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`)

async function renderText(
  value: string,
  { size, weight = 400, color, width, strikethrough }: TextOptions
): Promise<Layer> {
  await prepareFonts()
  const style = `foreground="${color}"${strikethrough ? ' strikethrough="true"' : ""}`
  const { data, info } = await serial(() =>
    sharp({
      text: {
        // علامة الاتجاه (RLM) تجعل الفقرة عربية الاتجاه حتى لو بدأت برقم أو حرف إنجليزي،
        // ومعها تعني "left" المحاذاة إلى اليمين، لأن Pango يعكس المحاذاة في الفقرات العربية
        text: `\u200f<span ${style}>${escapeMarkup(value)}</span>`,
        font: [FONT_FAMILIES, WEIGHT_NAMES[weight], size]
          .filter(Boolean)
          .join(" "),
        rgba: true,
        dpi: 72,
        width,
        wrap: "word",
        align: "left",
      },
    })
      .png()
      .toBuffer({ resolveWithObject: true })
  )
  return { input: data, width: info.width, height: info.height }
}

/** المسافة بين سطرين متتاليين بالمقاس والوزن نفسيهما. */
const lineSpacings = new Map<string, Promise<number>>()
function lineSpacing(size: number, weight: Weight) {
  const key = `${size}-${weight}`
  let spacing = lineSpacings.get(key)
  if (!spacing) {
    const options = { size, weight, color: "#000000" }
    spacing = Promise.all([
      renderText("ا", options),
      renderText("ا\nا", options),
    ]).then(([one, two]) => two.height - one.height)
    lineSpacings.set(key, spacing)
  }
  return spacing
}

/** نص بخط المتجر، مصفوف من اليمين. */
export async function text(value: string, options: TextOptions) {
  let layer = await renderText(value, options)
  if (!options.maxLines) return layer

  // الصورة تُقص على حدود الحروف المرسومة لا على ارتفاع السطر الكامل،
  // فارتفاع n سطر يقع تقريباً بين n - 1 وn من المسافة بين الأسطر
  const spacing = await lineSpacing(options.size, options.weight ?? 400)
  const limit = (options.maxLines + 0.15) * spacing
  const words = value.split(/\s+/)
  while (layer.height > limit && words.length > 1) {
    words.pop()
    layer = await renderText(`${words.join(" ")}…`, options)
  }
  return layer
}

/** نص داخل كبسولة، مثل شارة الخصم. border يرسم إطاراً بدل التعبئة. */
export async function pill(
  value: string,
  {
    background,
    border,
    paddingX,
    paddingY,
    ...options
  }: TextOptions & {
    background?: string
    border?: string
    paddingX: number
    paddingY: number
  }
): Promise<Layer> {
  const label = await text(value, options)
  const width = label.width + paddingX * 2
  const height = label.height + paddingY * 2
  const shape = border
    ? `fill="none" stroke="${border}" stroke-width="2"`
    : `fill="${background}"`
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${(height - 2) / 2}" ${shape}/></svg>`
  const input = await toPng(
    sharp(Buffer.from(svg)).composite([
      { input: label.input, left: paddingX, top: paddingY },
    ])
  )
  return { input, width, height }
}

/** ملف الصورة على القرص لمسار من ملفات البيانات، مثل /images/products/x-1، أو null. */
export function localImage(src: string) {
  if (/^https?:\/\//.test(src)) return null
  const hasExtension = /\.[a-z0-9]{2,5}$/i.test(src)
  const largest = IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1]
  const file = path.join(
    ROOT,
    "public",
    hasExtension ? src : `${src}-${largest}.webp`
  )
  return existsSync(file) ? file : null
}

/**
 * صورة مربعة بزوايا دائرية. إن لم تتوفر الصورة يظهر مربع رمادي فاتح عليه الشعار،
 * كما في بطاقات المنتجات بلا صور.
 */
export async function roundedImage(
  file: string | null,
  size: number,
  radius: number
): Promise<Layer> {
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}"/></svg>`
  )
  const base = file
    ? await toPng(sharp(file).resize(size, size, { fit: "cover" }))
    : await toPng(
        sharp({
          create: {
            width: size,
            height: size,
            channels: 4,
            background: OG_COLORS.surfaceMuted,
          },
        }).composite([{ input: await logoMark(Math.round(size / 4)) }])
      )
  const input = await toPng(
    sharp(base).composite([{ input: mask, blend: "dest-in" }])
  )
  return { input, width: size, height: size }
}

/** شعار المتجر (حقيبة كحلية في مربع كهرماني) من ملف أيقونة الموقع src/app/icon.svg. */
export async function logoMark(size: number) {
  const svg = await readFile(path.join(ROOT, "src", "app", "icon.svg"))
  // الأيقونة مرسومة على مربع 32 بكسل، فتُكبَّر الكثافة لترسم بالمقاس المطلوب بوضوح
  return toPng(sharp(svg, { density: (72 * size) / 32 }).resize(size, size))
}

/** يجمع الطبقات على خلفية كحلية بمقاس 1200×630، ويحفظها JPEG خفيفاً تقبله كل المنصات. */
export function renderCard(layers: OverlayOptions[]) {
  return serial(() =>
    sharp({
      create: { ...OG_SIZE, channels: 3, background: OG_COLORS.primary },
    })
      .composite(layers)
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer()
  )
}

export function jpegResponse(image: Buffer) {
  return new Response(new Uint8Array(image), {
    headers: { "Content-Type": "image/jpeg" },
  })
}
