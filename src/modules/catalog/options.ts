import { normalizeForSearch } from "@/modules/search/normalize"

/** A variant's option values: { "المقاس": "L", "اللون": "أزرق" } (size L, color blue) */
export type VariantOptions = Record<string, string>

/** A variant's options as one line of text, such as "المقاس: L، اللون: أزرق" (size: L, color: blue), or "" without options. */
export function formatOptions(options: VariantOptions) {
  return Object.entries(options)
    .map(([name, value]) => `${name}: ${value}`)
    .join("، ")
}

export type OptionGroup = {
  name: string
  values: string[]
  isColor: boolean
}

const COLOR_OPTION_NAMES = new Set(
  ["اللون", "لون", "الألوان", "ألوان", "color", "colour"].map(
    normalizeForSearch
  )
)

export function isColorOption(name: string) {
  return COLOR_OPTION_NAMES.has(normalizeForSearch(name))
}

/** Common color shades, shown as colored circles. Add your colors here. */
const COLOR_SWATCHES: Record<string, string> = Object.fromEntries(
  Object.entries({
    أحمر: "#dc2626",
    عنابي: "#7f1d1d",
    وردي: "#ec4899",
    برتقالي: "#f97316",
    أصفر: "#facc15",
    ذهبي: "#d4af37",
    أخضر: "#16a34a",
    زيتي: "#556b2f",
    تركواز: "#14b8a6",
    سماوي: "#38bdf8",
    أزرق: "#2563eb",
    كحلي: "#1e3a5f",
    بنفسجي: "#7c3aed",
    بني: "#8b5a2b",
    بيج: "#e8d8b8",
    كريمي: "#f5f0e1",
    أبيض: "#ffffff",
    فضي: "#c0c0c0",
    رمادي: "#9ca3af",
    أسود: "#111827",
    red: "#dc2626",
    pink: "#ec4899",
    orange: "#f97316",
    yellow: "#facc15",
    gold: "#d4af37",
    green: "#16a34a",
    blue: "#2563eb",
    navy: "#1e3a5f",
    purple: "#7c3aed",
    brown: "#8b5a2b",
    beige: "#e8d8b8",
    white: "#ffffff",
    silver: "#c0c0c0",
    gray: "#9ca3af",
    grey: "#9ca3af",
    black: "#111827",
  }).map(([name, hex]) => [normalizeForSearch(name), hex])
)

/** The circle color for a value such as "أزرق" (blue) or "#2563eb", or null if the color is unknown. */
export function getColorHex(value: string) {
  const trimmed = value.trim()
  if (/^#[0-9a-f]{3,8}$/i.test(trimmed)) return trimmed
  return COLOR_SWATCHES[normalizeForSearch(trimmed)] ?? null
}

const SIZE_ORDER = [
  "xxs",
  "xs",
  "s",
  "m",
  "l",
  "xl",
  "xxl",
  "2xl",
  "xxxl",
  "3xl",
  "4xl",
  "5xl",
]

function sizeRank(value: string) {
  const normalized = normalizeForSearch(value).replace(/\s+/g, "")
  const index = SIZE_ORDER.indexOf(normalized)
  if (index >= 0) return index
  const number = Number.parseFloat(normalized)
  return Number.isFinite(number) ? 100 + number : null
}

/** A logical order for values: sizes from smallest, numbers ascending, and the rest alphabetically. */
export function sortOptionValues(values: string[]) {
  return [...values].sort((a, b) => {
    const rankA = sizeRank(a)
    const rankB = sizeRank(b)
    if (rankA !== null && rankB !== null) return rankA - rankB
    if (rankA !== null) return -1
    if (rankB !== null) return 1
    return a.localeCompare(b, "ar")
  })
}

/** Option groups in the order they appear in the variants, as the store owner ordered them. */
export function getOptionGroups(
  variants: { options: VariantOptions }[]
): OptionGroup[] {
  const groups = new Map<string, string[]>()
  for (const variant of variants) {
    for (const [name, value] of Object.entries(variant.options)) {
      const values = groups.get(name) ?? []
      if (!values.includes(value)) values.push(value)
      groups.set(name, values)
    }
  }
  return [...groups].map(([name, values]) => ({
    name,
    values,
    isColor: isColorOption(name),
  }))
}
