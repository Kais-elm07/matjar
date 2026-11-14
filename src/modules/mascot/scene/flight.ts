import { curve, easeInOut, lerp, tween } from "@/modules/mascot/scene/tween"

type ScreenPoint = { x: number; y: number }

/** The size of the flying photo when it leaves the button, in pixels. */
const START_SIZE = 72

type FlightOptions = {
  /** The address of the product's small photo */
  photo: string
  /** The button the visitor pressed */
  from: DOMRect
  /** Where the photo lands, read on every frame because Najm moves while he waits for it */
  to: () => ScreenPoint
  /** The photo's size when it lands, in pixels */
  size: number
  duration: number
  onFrame: (point: ScreenPoint, progress: number) => void
}

/**
 * Flies a copy of the product photo over the page, in an arc from the pressed button to Najm's paws.
 * The copy is a temporary image above the page that ignores the pointer, removed when it lands.
 */
export async function flyPhoto({
  photo,
  from,
  to,
  size,
  duration,
  onFrame,
}: FlightOptions) {
  const image = document.createElement("img")
  image.src = photo
  image.alt = ""
  image.decoding = "async"
  Object.assign(image.style, {
    position: "fixed",
    left: "0",
    top: "0",
    width: `${START_SIZE}px`,
    height: `${START_SIZE}px`,
    objectFit: "contain",
    pointerEvents: "none",
    zIndex: "40",
    willChange: "transform",
  })
  document.body.append(image)

  const start = { x: from.left + from.width / 2, y: from.top + from.height / 2 }
  try {
    await tween(duration, easeInOut, (eased, progress) => {
      const end = to()
      // The arc rises above the higher of its two ends
      const x = curve(start.x, (start.x + end.x) / 2, end.x, eased)
      const y = curve(start.y, Math.min(start.y, end.y) - 150, end.y, eased)
      const scale = lerp(1, size / START_SIZE, eased)
      const turn = (1 - eased) * -14
      image.style.transform = `translate(${x - START_SIZE / 2}px, ${y - START_SIZE / 2}px) scale(${scale}) rotate(${turn}deg)`
      onFrame({ x, y }, progress)
    })
  } finally {
    image.remove()
  }
}
