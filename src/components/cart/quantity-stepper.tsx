"use client"

import { MinusIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface QuantityStepperProps {
  value: number
  max: number
  disabled?: boolean
  size?: "default" | "sm"
  /** Read out by screen readers, such as "كمية قميص قطني" (Cotton shirt quantity) */
  label?: string
  onChange: (value: number) => void
  className?: string
}

/** The buttons fill the stepper's height. The small stepper's 36 px buttons get an invisible ::after area, to reach 44 px. */
const BUTTON = {
  default: "h-full rounded-full",
  sm: "relative h-full rounded-full after:absolute after:-inset-1",
}

/** Quantity selector: one button to increase and another to decrease, without going past the limit. */
export function QuantityStepper({
  value,
  max,
  disabled = false,
  size = "default",
  label = "الكمية",
  onChange,
  className,
}: QuantityStepperProps) {
  const buttonSize = size === "sm" ? "icon-lg" : "icon-xl"
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        // An outline instead of a border, so the buttons get the full 44 px height
        "flex shrink-0 items-center rounded-full outline -outline-offset-1 outline-border",
        size === "sm" ? "h-9" : "h-11",
        className
      )}
    >
      <Button
        variant="ghost"
        size={buttonSize}
        className={BUTTON[size]}
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        aria-label="زيادة الكمية"
      >
        <PlusIcon aria-hidden />
      </Button>
      <output
        aria-live="polite"
        className={cn(
          "text-center font-bold tabular-nums",
          size === "sm" ? "w-6 text-sm" : "w-8 text-base"
        )}
      >
        {value}
      </output>
      <Button
        variant="ghost"
        size={buttonSize}
        className={BUTTON[size]}
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
        aria-label="إنقاص الكمية"
      >
        <MinusIcon aria-hidden />
      </Button>
    </div>
  )
}
