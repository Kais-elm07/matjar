/** A timing curve: turns a move's progress (0 to 1) into how far the move has gone. */
export type Easing = (progress: number) => number

export const linear: Easing = (t) => t
export const easeOut: Easing = (t) => 1 - (1 - t) ** 3
export const easeIn: Easing = (t) => t ** 3
export const easeInOut: Easing = (t) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2

/** The value `t` of the way from `from` to `to`. */
export const lerp = (from: number, to: number, t: number) =>
  from + (to - from) * t

/** A point on a path from `from` to `to` that bends toward `control` (a quadratic Bézier curve). */
export const curve = (from: number, control: number, to: number, t: number) =>
  (1 - t) ** 2 * from + 2 * (1 - t) * t * control + t ** 2 * to

/**
 * Runs a move for `duration` milliseconds: `onFrame` gets the eased value and the raw progress on every
 * animation frame. With `instant` (for visitors who asked for reduced motion) it jumps straight to the end.
 */
export function tween(
  duration: number,
  easing: Easing,
  onFrame: (value: number, progress: number) => void,
  instant = false
): Promise<void> {
  if (instant || duration <= 0) {
    onFrame(1, 1)
    return Promise.resolve()
  }
  return new Promise((resolve) => {
    const start = performance.now()
    function step(now: number) {
      const progress = Math.min(1, Math.max(0, (now - start) / duration))
      onFrame(easing(progress), progress)
      if (progress < 1) requestAnimationFrame(step)
      else resolve()
    }
    requestAnimationFrame(step)
  })
}
