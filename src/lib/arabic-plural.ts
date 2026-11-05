export type PluralForms = {
  /** 0 */
  zero: string
  /** 1 */
  one: string
  /** 2 */
  two: string
  /** 3 to 10 */
  few: string
  /** 11 to 99 */
  many: string
  /** 100 and above */
  other: string
}

const rules = new Intl.PluralRules("ar")

/**
 * The correct Arabic plural form for a count. Use {n} in place of the number:
 * pluralize(5, PRODUCT_FORMS) gives "5 منتجات" (5 products), and pluralize(12, ...) gives "12 منتجاً" (12 products).
 */
export function pluralize(count: number, forms: PluralForms) {
  return forms[rules.select(count)].replace("{n}", String(count))
}

export const PRODUCT_FORMS: PluralForms = {
  zero: "لا توجد منتجات",
  one: "منتج واحد",
  two: "منتجان",
  few: "{n} منتجات",
  many: "{n} منتجاً",
  other: "{n} منتج",
}

/** Number of pieces in the cart and the order. */
export const PIECE_FORMS: PluralForms = {
  zero: "لا قطع",
  one: "قطعة واحدة",
  two: "قطعتان",
  few: "{n} قطع",
  many: "{n} قطعة",
  other: "{n} قطعة",
}
