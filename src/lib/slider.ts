import { scrollBehavior } from "@/lib/motion"

/**
 * Helpers for a row of full-width slides that swipes sideways with scroll-snap (the hero and the
 * product gallery).
 */

/**
 * The index of the slide in view. In the right-to-left direction the scroll value runs from zero to
 * negative numbers, so its absolute value counts the slides.
 */
export function visibleSlide(track: HTMLElement) {
  return Math.round(Math.abs(track.scrollLeft) / track.clientWidth)
}

/** Scrolls the row sideways until the slide is in view, without moving the page up or down. */
export function scrollToSlide(track: HTMLElement, slide: HTMLElement) {
  const offset =
    slide.getBoundingClientRect().left - track.getBoundingClientRect().left
  if (Math.abs(offset) > 2) {
    track.scrollBy({ left: offset, behavior: scrollBehavior() })
  }
}
