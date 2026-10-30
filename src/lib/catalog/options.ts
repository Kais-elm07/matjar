import { normalizeForSearch } from "./arabic"

/** قيم خيارات المتغير: { "المقاس": "L", "اللون": "أزرق" } */
export type VariantOptions = Record<string, string>

export type OptionGroup = {
  name: string
  values: string[]
  isColor: boolean
}

/** قراءة آمنة لحقل الخيارات من قاعدة البيانات. */
export function parseVariantOptions(value: unknown): VariantOptions {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {}
  const options: VariantOptions = {}
  for (const [name, optionValue] of Object.entries(value)) {
    if (typeof optionValue === "string" && name.trim() && optionValue.trim()) {
      options[name.trim()] = optionValue.trim()
    }
  }
  return options
}

const COLOR_OPTION_NAMES = new Set(
  ["اللون", "لون", "الألوان", "ألوان", "color", "colour"].map(
    normalizeForSearch
  )
)

export function isColorOption(name: string) {
  return COLOR_OPTION_NAMES.has(normalizeForSearch(name))
}

/** درجات الألوان الشائعة لعرضها كدوائر ملونة. أضف ألوانك هنا. */
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

/** لون الدائرة لقيمة مثل "أزرق" أو "#2563eb"، أو null إن لم يكن اللون معروفاً. */
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

/** ترتيب منطقي للقيم: المقاسات من الأصغر، والأرقام تصاعدياً، والباقي أبجدياً. */
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

/** مجموعات الخيارات بترتيب ظهورها في المتغيرات، كما رتّبها صاحب المتجر. */
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

/** وصف المتغير للعرض: "L / أزرق". */
export function describeOptions(options: VariantOptions) {
  return Object.values(options).join(" / ")
}
