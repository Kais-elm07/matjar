/** مدة التوصيل بصيغة عربية سليمة، مثل "خلال يوم إلى يومين" أو "خلال 3 إلى 5 أيام عمل". */
export function deliveryTime([min, max]: [number, number]) {
  if (max <= 1) return "خلال يوم عمل واحد"
  if (min === max) {
    return max === 2 ? "خلال يومي عمل" : `خلال ${max} أيام عمل`
  }
  if (min === 1 && max === 2) return "خلال يوم إلى يومين"
  return `خلال ${min} إلى ${max} أيام عمل`
}
