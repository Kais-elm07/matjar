import type { CSSProperties } from "react"

/**
 * The product's tone (DESIGN.md: stage-tone): the color of the light behind a product photo, as a hue in
 * degrees and a chroma (the strength of the color) in the OKLCH color space. The light is always drawn at
 * the same lightness, TONE_LIGHTNESS, so only the hue and the strength change from one product to another,
 * and white text keeps its contrast on every product.
 *
 * The formulas between sRGB and OKLab are Björn Ottosson's (https://bottosson.github.io/posts/oklab/).
 */
export type Tone = { hue: number; chroma: number }

/** The lightness of the light behind a product, in OKLCH (0 is black, 1 is white). */
export const TONE_LIGHTNESS = 0.4

/** A tone is between a faint tint and a strong light, within the colors a screen shows at TONE_LIGHTNESS. */
const MIN_CHROMA = 0.05
const MAX_CHROMA = 0.14

/** The store's blue (DESIGN.md: colors.primary): the light behind a photo without a clear color. */
const BRAND_HEX = "#4f8cff"
const BRAND_CHROMA = 0.1

const HEX_COLOR = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i

/** "#4f8cff" → [79, 140, 255], or null for anything that isn't a six-digit hex color. */
function hexToRgb(hex: string): [number, number, number] | null {
  const match = HEX_COLOR.exec(hex.trim())
  if (!match) return null
  return [
    Number.parseInt(match[1], 16),
    Number.parseInt(match[2], 16),
    Number.parseInt(match[3], 16),
  ]
}

const toLinear = (channel: number) => {
  const value = channel / 255
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

const fromLinear = (value: number) => {
  const encoded =
    value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055
  return Math.round(Math.min(1, Math.max(0, encoded)) * 255)
}

/** An sRGB color as OKLCH: lightness, chroma and hue in degrees. */
function rgbToOklch([red, green, blue]: [number, number, number]) {
  const r = toLinear(red)
  const g = toLinear(green)
  const b = toLinear(blue)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const hue = (Math.atan2(bb, a) * 180) / Math.PI
  return {
    lightness,
    chroma: Math.hypot(a, bb),
    hue: hue < 0 ? hue + 360 : hue,
  }
}

/** An OKLCH color as linear sRGB channels, which fall outside 0 to 1 when the screen cannot show it. */
function oklchToLinear(lightness: number, chroma: number, hue: number) {
  const angle = (hue * Math.PI) / 180
  const a = chroma * Math.cos(angle)
  const b = chroma * Math.sin(angle)
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

const inGamut = (channels: number[]) =>
  channels.every((value) => value >= -1e-4 && value <= 1 + 1e-4)

/** The strongest chroma a screen (sRGB) shows at this lightness and hue. */
function maxChroma(lightness: number, hue: number) {
  let low = 0
  let high = 0.4
  for (let step = 0; step < 24; step++) {
    const middle = (low + high) / 2
    if (inGamut(oklchToLinear(lightness, middle, hue))) low = middle
    else high = middle
  }
  return low
}

const round = (value: number, digits: number) => Number(value.toFixed(digits))

/**
 * The tone of a color, such as a photo's main color measured by pnpm images or a tone the store owner set
 * in the products file: its hue, and its chroma kept between a faint tint and a strong light that the
 * screen can show at TONE_LIGHTNESS. A gray, which has no hue, gives the store's blue (BRAND_TONE).
 * Returns null for a color that isn't a six-digit hex color.
 */
export function toneFromHex(hex: string): Tone | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  const { hue, chroma } = rgbToOklch(rgb)
  if (chroma < 0.02) return BRAND_TONE
  const strength = Math.min(MAX_CHROMA, Math.max(MIN_CHROMA, chroma))
  return {
    hue: round(hue, 1),
    chroma: round(Math.min(strength, maxChroma(TONE_LIGHTNESS, hue)), 3),
  }
}

/** The light behind a photo without a clear color: the store's blue (DESIGN.md: stage-tone). */
export const BRAND_TONE: Tone = {
  hue: round(rgbToOklch(hexToRgb(BRAND_HEX) ?? [0, 0, 0]).hue, 1),
  chroma: BRAND_CHROMA,
}

/**
 * A tone as an sRGB hex color at a given lightness, for the share images, which cannot draw OKLCH colors.
 * A chroma the screen cannot show at that lightness is lowered until it can, keeping the hue.
 */
export function toneColor(tone: Tone, lightness = TONE_LIGHTNESS) {
  const chroma = Math.min(tone.chroma, maxChroma(lightness, tone.hue))
  const hex = oklchToLinear(lightness, chroma, tone.hue)
    .map((channel) => fromLinear(channel).toString(16).padStart(2, "0"))
    .join("")
  return `#${hex}`
}

/** The CSS variables that the stage and photo box styles in globals.css read (--tone-h and --tone-c). */
export function toneStyle(tone: Tone): CSSProperties {
  return { "--tone-h": tone.hue, "--tone-c": tone.chroma }
}
