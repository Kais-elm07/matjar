/** تمرير ناعم، إلا إن طلب الزائر تقليل الحركة من إعدادات جهازه فيكون فورياً. */
export function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth"
}
