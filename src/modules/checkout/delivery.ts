import { pluralize, type PluralForms } from "@/lib/arabic-plural"

const WORKING_DAY_FORMS: PluralForms = {
  /** Same-day delivery shows as one working day. */
  zero: "يوم عمل واحد",
  one: "يوم عمل واحد",
  two: "يومي عمل",
  few: "{n} أيام عمل",
  many: "{n} يوم عمل",
  other: "{n} يوم عمل",
}

/**
 * Delivery time in correct Arabic, such as "خلال يوم إلى يومين" (within one to two days)
 * or "خلال 3 إلى 5 أيام عمل" (within 3 to 5 working days).
 */
export function deliveryTime([min, max]: [number, number]) {
  if (min === 1 && max === 2) return "خلال يوم إلى يومين"
  const upTo = pluralize(max, WORKING_DAY_FORMS)
  if (min === max || max <= 2) return `خلال ${upTo}`
  // The counted noun follows the last number: "3 إلى 5 أيام عمل" and "7 إلى 14 يوم عمل" (3 to 5 / 7 to 14 working days).
  return `خلال ${min} إلى ${upTo}`
}
