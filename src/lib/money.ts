import { siteConfig } from "@/config/site"

const { fractionDigits, symbol } = siteConfig.currency
const factor = 10 ** fractionDigits

function groupThousands(value: number) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/**
 * Formats a price from the currency's smallest unit as text such as "1,299.50 ر.س" (SAR).
 * Fixed manual formatting (instead of Intl) so the result is the same on the server and in every browser.
 * Fractions show only when there are any: 12900 becomes "129 ر.س".
 */
export function formatPrice(amountMinor: number) {
  // An invalid amount (NaN) shows as zero instead of broken text
  const rounded = Number.isFinite(amountMinor) ? Math.round(amountMinor) : 0
  const abs = Math.abs(rounded)
  const major = Math.floor(abs / factor)
  const minor = abs % factor
  const number =
    minor === 0
      ? groupThousands(major)
      : `${groupThousands(major)}.${String(minor).padStart(fractionDigits, "0")}`
  return `${rounded < 0 ? "-" : ""}${number}\u00A0${symbol}`
}

/** Whether the amount has no more decimal places than the currency: 129.5 yes, 129.555 no. */
export function fitsCurrency(amountMajor: number) {
  const scaled = amountMajor * factor
  return Math.abs(scaled - Math.round(scaled)) < 1e-6
}

/** Converts a price written in the major unit (such as 129.5) to the smallest unit (12950). */
export function toMinorUnits(amountMajor: number) {
  return Math.round(amountMajor * factor)
}

/** Converts from the smallest unit to the major unit (12950 becomes 129.5). */
export function toMajorUnits(amountMinor: number) {
  return amountMinor / factor
}

/** The rounded discount percentage, or null if there is no real discount. */
export function discountPercent(price: number, compareAtPrice?: number | null) {
  if (!compareAtPrice || compareAtPrice <= price) return null
  return Math.round((1 - price / compareAtPrice) * 100)
}

/** The price in schema.org format (such as "129.50") for structured data. */
export function toSchemaPrice(amountMinor: number) {
  return (amountMinor / factor).toFixed(fractionDigits)
}
