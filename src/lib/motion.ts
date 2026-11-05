/** Smooth scrolling, or instant if the visitor turned on reduced motion in their device settings. */
export function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth"
}
