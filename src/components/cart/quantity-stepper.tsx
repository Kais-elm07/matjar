"use client"

import { MinusIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** محدد الكمية: زر للزيادة وآخر للإنقاص، مع منع تجاوز الحد. */
export function QuantityStepper({
  value,
  max,
  disabled = false,
  size = "default",
  label = "الكمية",
  onChange,
  className,
}: {
  value: number
  max: number
  disabled?: boolean
  size?: "default" | "sm"
  /** يُقرأ لقارئات الشاشة، مثل "كمية قميص قطني" */
  label?: string
  onChange: (value: number) => void
  className?: string
}) {
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
        className="h-full"
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
        className="h-full"
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
        aria-label="إنقاص الكمية"
      >
        <MinusIcon aria-hidden />
      </Button>
    </div>
  )
}
