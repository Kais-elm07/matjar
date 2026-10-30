import { siteConfig } from "@/config/site"

const { fractionDigits, symbol } = siteConfig.currency
const factor = 10 ** fractionDigits

function groupThousands(value: number) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/**
 * تنسيق السعر من أصغر وحدة للعملة إلى نص مثل "1,299.50 ر.س".
 * تنسيق يدوي ثابت (بدلاً من Intl) حتى تتطابق النتيجة في الخادم وكل المتصفحات.
 * الكسور تظهر فقط عند وجودها: 12900 تصبح "129 ر.س".
 */
export function formatPrice(amountMinor: number) {
  const abs = Math.abs(Math.round(amountMinor))
  const major = Math.floor(abs / factor)
  const minor = abs % factor
  const number =
    minor === 0
      ? groupThousands(major)
      : `${groupThousands(major)}.${String(minor).padStart(fractionDigits, "0")}`
  return `${amountMinor < 0 ? "-" : ""}${number}\u00A0${symbol}`
}

/** تحويل سعر مكتوب بالوحدة الكبرى (مثل 129.5) إلى أصغر وحدة (12950). */
export function toMinorUnits(amountMajor: number) {
  return Math.round(amountMajor * factor)
}

/** تحويل من أصغر وحدة إلى الوحدة الكبرى (12950 تصبح 129.5). */
export function toMajorUnits(amountMinor: number) {
  return amountMinor / factor
}

/** نسبة الخصم المئوية مقربة، أو null إذا لم يكن هناك خصم حقيقي. */
export function discountPercent(price: number, compareAtPrice?: number | null) {
  if (!compareAtPrice || compareAtPrice <= price) return null
  return Math.round((1 - price / compareAtPrice) * 100)
}

/** السعر بصيغة schema.org (مثل "129.50") للبيانات المنظمة. */
export function toSchemaPrice(amountMinor: number) {
  return (amountMinor / factor).toFixed(fractionDigits)
}
