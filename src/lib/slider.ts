import { scrollBehavior } from "@/lib/motion"

/**
 * Helpers for a row of full-width slides that swipes sideways with scroll-snap (the hero and the
 * product gallery), and the arithmetic of their stage (DESIGN.md: Elevation & Depth): how far each
 * photo has turned and which tones make the light behind them during a swipe.
 */

/**
 * How far the row has scrolled, counted in slides: 0 on the first slide, and 1.5 halfway between the
 * second and the third. In the right-to-left direction the scroll value runs from zero to negative
 * numbers, so its absolute value counts the slides.
 */
export function slidePosition(scrollLeft: number, slideWidth: number) {
  return slideWidth > 0 ? Math.abs(scrollLeft) / slideWidth : 0
}

/** The index of the slide in view. */
export function visibleSlide(track: HTMLElement) {
  return Math.round(slidePosition(track.scrollLeft, track.clientWidth))
}

/**
 * How far a slide has turned at this scroll position: 0 when it is in view, and up to 1 or -1 as it moves
 * away to the right or to the left of the screen. In the right-to-left direction the next slides lie to the
 * left, so a slide after the one in view has a negative turn.
 */
export function slideTurn(index: number, position: number, rtl: boolean) {
  const offset = (index - position) * (rtl ? -1 : 1)
  return Math.max(-1, Math.min(1, offset))
}

/**
 * The two slides whose tones make the light behind the row at this scroll position, and how much of the
 * second one shows: 0 while the first is in view, rising to 1 as the swipe reaches the second.
 */
export function toneBlend(position: number, count: number) {
  // A swipe that stops a hair short of a slide (a fraction of a pixel) counts as on it, so one tone shows
  const nearest = Math.round(position)
  const settled = Math.abs(position - nearest) < 0.01 ? nearest : position
  const from = Math.max(0, Math.min(count - 1, Math.floor(settled)))
  const to = Math.min(count - 1, from + 1)
  return { from, to, amount: Math.max(0, Math.min(1, settled - from)) }
}

/** Scrolls the row sideways until the slide is in view, without moving the page up or down. */
export function scrollToSlide(track: HTMLElement, slide: HTMLElement) {
  const offset =
    slide.getBoundingClientRect().left - track.getBoundingClientRect().left
  if (Math.abs(offset) > 2) {
    track.scrollBy({ left: offset, behavior: scrollBehavior() })
  }
}
