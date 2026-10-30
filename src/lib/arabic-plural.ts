export type PluralForms = {
  /** 0 */
  zero: string
  /** 1 */
  one: string
  /** 2 */
  two: string
  /** 3 إلى 10 */
  few: string
  /** 11 إلى 99 */
  many: string
  /** 100 فما فوق */
  other: string
}

const rules = new Intl.PluralRules("ar")

/**
 * صيغة الجمع العربية الصحيحة للعدد. استخدم {n} مكان الرقم:
 * pluralize(5, PRODUCT_FORMS) يعطي "5 منتجات"، و pluralize(12, ...) يعطي "12 منتجاً".
 */
export function pluralize(count: number, forms: PluralForms) {
  const form = forms[rules.select(count) as keyof PluralForms] ?? forms.other
  return form.replace("{n}", String(count))
}

export const PRODUCT_FORMS: PluralForms = {
  zero: "لا توجد منتجات",
  one: "منتج واحد",
  two: "منتجان",
  few: "{n} منتجات",
  many: "{n} منتجاً",
  other: "{n} منتج",
}

/** عدد القطع في السلة والطلب. */
export const PIECE_FORMS: PluralForms = {
  zero: "لا قطع",
  one: "قطعة واحدة",
  two: "قطعتان",
  few: "{n} قطع",
  many: "{n} قطعة",
  other: "{n} قطعة",
}
