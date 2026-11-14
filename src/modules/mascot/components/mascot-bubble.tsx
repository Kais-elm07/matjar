import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface MascotBubbleProps {
  onClose: () => void
  /** True while the pointer or the keyboard focus is on the bubble, so it stays open while it is read */
  onHoldChange: (held: boolean) => void
  children: React.ReactNode
}

/**
 * Najm's speech bubble (DESIGN.md: mascot-bubble): a floating surface card with 16 px corners, a thin border and
 * a shadow, whose tail points at Najm on the start side. It pops in, except for visitors who asked for reduced motion.
 */
export function MascotBubble({
  onClose,
  onHoldChange,
  children,
}: MascotBubbleProps) {
  return (
    <div
      onPointerEnter={() => onHoldChange(true)}
      onPointerLeave={() => onHoldChange(false)}
      onFocus={() => onHoldChange(true)}
      onBlur={(event) => {
        const next = event.relatedTarget
        if (!(next instanceof Node && event.currentTarget.contains(next))) {
          onHoldChange(false)
        }
      }}
      className={cn(
        "pointer-events-auto relative w-60 max-w-[calc(100vw-9.5rem)] rounded-2xl border bg-popover p-3 pe-10 text-sm leading-6 text-popover-foreground shadow-lg md:w-72 md:max-w-none",
        "animate-in duration-200 fade-in-0 zoom-in-95 motion-reduce:animate-none",
        // The tail: a turned square half outside the bubble, with the border on its two outer sides
        "before:absolute before:-start-[7px] before:top-5 before:size-3 before:rotate-45 before:border-s before:border-t before:border-border before:bg-popover"
      )}
    >
      <button
        type="button"
        aria-label="إغلاق"
        onClick={onClose}
        className="absolute end-2 top-2 flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none after:absolute after:-inset-2 hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring"
      >
        <XIcon className="size-4" aria-hidden />
      </button>
      {children}
    </div>
  )
}
