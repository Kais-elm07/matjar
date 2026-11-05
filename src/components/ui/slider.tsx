"use client"

import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "@/lib/utils"

/** The low and high ends of the range. */
export type SliderRange = readonly [number, number]

/** The range's two thumbs: their React keys, and their positions in the value. */
const THUMBS = [
  { id: "low", index: 0 },
  { id: "high", index: 1 },
]

interface SliderProps extends SliderPrimitive.Root.Props<SliderRange> {
  /** اسم كل مقبض لقارئات الشاشة، مثل "أقل سعر" و"أعلى سعر" */
  getThumbLabel?: (index: number) => string
}

/** A slider with two thumbs, for choosing a range such as a price range. */
function Slider({
  className,
  min = 0,
  max = 100,
  getThumbLabel,
  ...props
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-muted select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {THUMBS.map((thumb) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={thumb.id}
            index={thumb.index}
            getAriaLabel={getThumbLabel}
            className="relative block size-5 shrink-0 rounded-full border-2 border-primary bg-foreground shadow-sm ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
