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

import { IMAGE_WIDTHS, imageFile } from "@/lib/image-loader"

/**
 * Build-time tools that draw the share images (Open Graph): Arabic text in the store's font, images with rounded corners, and badges.
 * Drawing uses the sharp library, and text goes through the Pango inside it, so Arabic letters join and each line runs from the right.
 */

export const OG_SIZE = { width: 1200, height: 630 }

/** DESIGN.md colors used in the share images: a dark background, white text, and orange for the price and badges */
export const OG_COLORS = {
  background: "#121214",
  surface: "#2a2a2e",
  foreground: "#ffffff",
  muted: "#a1a1a6",
  primary: "#ffa629",
  onPrimary: "#111111",
}

const ROOT = process.cwd()
const FONT_DIR = path.join(ROOT, "src", "fonts", "ibm-plex-sans-arabic")
// The two families as the pnpm fonts command names them: the digits and English letters file first, then the Arabic one,
// so each character takes its shape from the file that contains it
const FONT_FAMILIES = "IBM Plex Sans Arabic Latin,IBM Plex Sans Arabic"
type Weight = 400 | 500 | 700

const WEIGHT_NAMES: Record<Weight, string> = {
  400: "",
  500: "Medium",
  700: "Bold",
}

// The font library inside sharp cannot handle drawing text and reading SVG at the same time from two threads,
// and the build sometimes crashed with a memory error. So sharp runs on one thread,
// and every drawing operation goes through one queue for the whole process (globalThis),
// because each image route may load its own copy of this file.
sharp.concurrency(1)

/** What this file keeps on globalThis, shared by every copy of it in the process. */
interface SharedRenderState {
  matjarOgQueue?: Promise<unknown>
  matjarOgFonts?: Promise<void>
}

const shared: typeof globalThis & SharedRenderState = globalThis

/** Runs drawing operations one at a time. Never call it from a queued task, or it waits on itself. */
function serial<T>(task: () => Promise<T>): Promise<T> {
  const result = (shared.matjarOgQueue ?? Promise.resolve()).then(task)
  shared.matjarOgQueue = result.catch(() => undefined)
  return result
}

const toPng = (image: Sharp) => serial(() => image.png().toBuffer())

/**
 * Registers the font files with the text renderer once per process.
 * The files are first copied to a temporary folder whose path uses English letters,
 * because the font library on Windows cannot read Arabic paths such as the project folder.
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
        // Write, then rename, because parallel build processes may write the same file at the same time
        const temporary = `${file}.${process.pid}.tmp`
        await writeFile(temporary, contents[index])
        await rename(temporary, file).catch(() =>
          rm(temporary, { force: true })
        )
      }
      // The renderer adds the font file to its library on the first text drawn with it
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
  /** Maximum line width before wrapping to a new line */
  width?: number
  /** Maximum number of lines; anything longer is cut short with an ellipsis */
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
        // The direction mark (RLM) makes the paragraph right-to-left even if it starts with a digit or an English letter,
        // and with it "left" means right alignment, because Pango mirrors the alignment in Arabic paragraphs
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

/** The distance between two consecutive lines at the same size and weight. */
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

/** Text in the store's font, aligned from the right. */
export async function text(value: string, options: TextOptions) {
  let layer = await renderText(value, options)
  if (!options.maxLines) return layer

  // The image is trimmed to the edges of the drawn letters, not to the full line height,
  // so the height of n lines falls roughly between n - 1 and n times the line spacing
  const spacing = await lineSpacing(options.size, options.weight ?? 400)
  const limit = (options.maxLines + 0.15) * spacing
  const words = value.split(/\s+/)
  while (layer.height > limit && words.length > 1) {
    words.pop()
    layer = await renderText(`${words.join(" ")}…`, options)
  }
  return layer
}

export type PillOptions = TextOptions & {
  background?: string
  border?: string
  paddingX: number
  paddingY: number
}

/** Text inside a pill, such as the discount badge. border draws an outline instead of a fill. */
export async function pill(
  value: string,
  { background, border, paddingX, paddingY, ...options }: PillOptions
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

/** The image file on disk for a path from the data files, such as /images/products/x-1, or null. */
export function localImage(src: string) {
  if (/^https?:\/\//.test(src)) return null
  const largest = IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1]
  const file = path.join(ROOT, "public", imageFile(src, largest))
  return existsSync(file) ? file : null
}

/**
 * A square image with rounded corners. If the image is missing, the logo shows on a square in the surface color.
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
            background: OG_COLORS.surface,
          },
        }).composite([{ input: await logoMark(Math.round(size / 4)) }])
      )
  const input = await toPng(
    sharp(base).composite([{ input: mask, blend: "dest-in" }])
  )
  return { input, width: size, height: size }
}

/** The store logo (a dark bag in an orange square) from the site icon file src/app/icon.svg. */
export async function logoMark(size: number) {
  const svg = await readFile(path.join(ROOT, "src", "app", "icon.svg"))
  // The icon is drawn on a 32-pixel square, so the density is scaled up to draw it sharply at the requested size
  return toPng(sharp(svg, { density: (72 * size) / 32 }).resize(size, size))
}

/** Combines the layers on a dark 1200×630 background and saves a light JPEG that every platform accepts. */
export function renderShareImage(layers: OverlayOptions[]) {
  return serial(() =>
    sharp({
      create: { ...OG_SIZE, channels: 3, background: OG_COLORS.background },
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
