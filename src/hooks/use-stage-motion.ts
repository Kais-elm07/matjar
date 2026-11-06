"use client"

import { useEffect, useRef } from "react"

import { slidePosition, slideTurn, toneBlend } from "@/lib/slider"

/** How far the photos tilt toward the mouse at the edge of the stage, in degrees */
const TILT_SIDEWAYS = 10
const TILT_UP_DOWN = 8

const TONE_VARIABLES = ["--tone-h", "--tone-c"]

/**
 * Moves a stage (DESIGN.md: Elevation & Depth). On every frame of a swipe it turns each slide's photo in 3D
 * (--turn and --away on the slide, read by stage-photo in globals.css) and blends the light behind the row
 * from the tone of the slide in view into the next one's, so the color changes the moment the photo does.
 * On a computer with a mouse, it also tilts the photos toward the pointer (--tilt-x and --tilt-y on the row).
 *
 * Each slide carries its own tone in its style (toneStyle), and the two layers of the light (StageBackdrop)
 * copy it from there. The values are written straight to the elements' CSS variables, so React doesn't render
 * on every frame of a swipe. Anyone who asked for reduced motion sees the light change, without a turn or tilt.
 *
 * Returns the refs for the row of slides and for StageBackdrop.
 */
export function useStageMotion<Track extends HTMLElement>() {
  const trackRef = useRef<Track>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    const backdrop = backdropRef.current
    if (!track || !backdrop) return
    const [base, next] = Array.from(backdrop.children).filter(
      (layer): layer is HTMLElement => layer instanceof HTMLElement
    )
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    const rtl = getComputedStyle(track).direction === "rtl"
    let frame = 0
    let shownPair = ""

    function copyTone(layer: HTMLElement, slide: Element | undefined) {
      if (!(slide instanceof HTMLElement)) return
      for (const name of TONE_VARIABLES) {
        layer.style.setProperty(name, slide.style.getPropertyValue(name))
      }
    }

    function paint() {
      frame = 0
      if (!track) return
      const width = track.clientWidth
      // A hidden row has no width to measure
      if (width === 0) return
      const position = slidePosition(track.scrollLeft, width)
      const slides = track.children
      if (!reducedMotion) {
        for (let index = 0; index < slides.length; index++) {
          const slide = slides[index]
          if (!(slide instanceof HTMLElement)) continue
          const turn = slideTurn(index, position, rtl)
          slide.style.setProperty("--turn", turn.toFixed(3))
          slide.style.setProperty("--away", Math.abs(turn).toFixed(3))
        }
      }
      if (!base || !next) return
      // The layers' colors change only when the swipe reaches another pair of slides; during the swipe,
      // only the upper layer's opacity changes, which the browser draws without repainting the light
      const { from, to, amount } = toneBlend(position, slides.length)
      const pair = `${from}-${to}`
      if (pair !== shownPair) {
        shownPair = pair
        copyTone(base, slides[from])
        copyTone(next, slides[to])
      }
      next.style.opacity = amount.toFixed(3)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint)
    }
    track.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    schedule()

    // The tilt toward the mouse, only where there is a mouse
    const canTilt =
      !reducedMotion &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    let tiltFrame = 0
    let pointer: { x: number; y: number } | null = null

    function tilt() {
      tiltFrame = 0
      if (!track) return
      if (!pointer) {
        track.style.setProperty("--tilt-x", "0deg")
        track.style.setProperty("--tilt-y", "0deg")
        return
      }
      const rect = track.getBoundingClientRect()
      const sideways = (pointer.x - rect.left) / rect.width - 0.5
      const upDown = (pointer.y - rect.top) / rect.height - 0.5
      track.style.setProperty(
        "--tilt-y",
        `${(sideways * TILT_SIDEWAYS).toFixed(2)}deg`
      )
      track.style.setProperty(
        "--tilt-x",
        `${(-upDown * TILT_UP_DOWN).toFixed(2)}deg`
      )
    }
    function onPointerMove(event: PointerEvent) {
      pointer = { x: event.clientX, y: event.clientY }
      if (!tiltFrame) tiltFrame = requestAnimationFrame(tilt)
    }
    function onPointerLeave() {
      pointer = null
      if (!tiltFrame) tiltFrame = requestAnimationFrame(tilt)
    }
    if (canTilt) {
      track.addEventListener("pointermove", onPointerMove, { passive: true })
      track.addEventListener("pointerleave", onPointerLeave)
    }

    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(tiltFrame)
      track.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      track.removeEventListener("pointermove", onPointerMove)
      track.removeEventListener("pointerleave", onPointerLeave)
    }
  }, [])

  return { trackRef, backdropRef }
}
