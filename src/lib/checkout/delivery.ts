import { pluralize, type PluralForms } from "@/lib/arabic-plural"

const WORKING_DAY_FORMS: PluralForms = {
  /** التوصيل في اليوم نفسه يُعرض كيوم عمل واحد. */
  zero: "يوم عمل واحد",
  one: "يوم عمل واحد",
  two: "يومي عمل",
  few: "{n} أيام عمل",
  many: "{n} يوم عمل",
  other: "{n} يوم عمل",
}

/** مدة التوصيل بصيغة عربية سليمة، مثل "خلال يوم إلى يومين" أو "خلال 3 إلى 5 أيام عمل". */
export function deliveryTime([min, max]: [number, number]) {
  if (min === 1 && max === 2) return "خلال يوم إلى يومين"
  const upTo = pluralize(max, WORKING_DAY_FORMS)
  if (min === max || max <= 2) return `خلال ${upTo}`
  // المعدود يتبع العدد الأخير: "3 إلى 5 أيام عمل" و"7 إلى 14 يوم عمل".
  return `خلال ${min} إلى ${upTo}`
}
