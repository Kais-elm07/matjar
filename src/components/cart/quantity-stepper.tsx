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
        "flex shrink-0 items-center rounded-full border",
        size === "sm" ? "h-9" : "h-11",
        className
      )}
    >
      <Button
        variant="ghost"
        size={buttonSize}
        className="h-full rounded-full"
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
        className="h-full rounded-full"
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
        aria-label="إنقاص الكمية"
      >
        <MinusIcon aria-hidden />
      </Button>
    </div>
  )
}
