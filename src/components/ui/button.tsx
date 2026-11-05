import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * The store's buttons (DESIGN.md: button-cta, button-secondary and button-outline).
 * A native browser button with no library, so no extra code loads on every page,
 * and its type is "button" unless "submit" is set explicitly, so it doesn't submit a form by mistake.
 */
const variants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Transparent with a white border, for the secondary action,
        // such as "اشترِ الآن" (Buy now) and "عرض السلة" (View cart) (button-secondary)
        default:
          "border-foreground/70 bg-transparent text-foreground hover:bg-foreground/10 aria-expanded:bg-foreground/10",
        // Orange with dark text, for an area's most important action, and over images too (button-cta)
        cta: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:border-foreground focus-visible:ring-foreground/60",
        // Transparent with a gray border, for alternative actions,
        // such as "مسح الفلاتر" (Clear filters) and "مشاركة" (Share) (button-outline)
        outline:
          "border-border bg-transparent hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        // No border and no background, for small icon buttons such as delete and closing dialogs
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        icon: "size-8",
        "icon-sm": "size-7 rounded-[min(var(--radius-md),12px)]",
        "icon-lg": "size-9",
        // Comfortable touch sizes on mobile (44px)
        xl: "h-11 gap-2 px-5 text-base has-data-[icon=inline-end]:pe-4 has-data-[icon=inline-start]:ps-4",
        "icon-xl": "size-11 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * The classes for a button, or for a link that looks like one. They are merged, so a variant's
 * border and focus colors replace the base's transparent border even when used directly on a link.
 */
function buttonVariants(props?: Parameters<typeof variants>[0]) {
  return cn(variants(props))
}

interface ButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {}

function Button({
  className,
  variant = "default",
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      data-slot="button"
      type={type}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  )
}

export { Button, buttonVariants }
