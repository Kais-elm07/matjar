import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * أزرار المتجر (DESIGN.md: button-cta وbutton-secondary وbutton-outline).
 * زر أصلي من المتصفح دون مكتبة، فلا يُحمَّل كود إضافي في كل صفحة،
 * ونوعه "button" ما لم يُطلب "submit" صراحة، فلا يرسل نموذجاً بالخطأ.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // شفاف بحد أبيض للفعل الثاني، مثل "اشترِ الآن" و"عرض السلة" (button-secondary)
        default:
          "border-foreground/70 bg-transparent text-foreground hover:bg-foreground/10 aria-expanded:bg-foreground/10",
        // البرتقالي بنص داكن للفعل الأهم في المنطقة، وفوق الصور أيضاً (button-cta)
        cta: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:border-foreground focus-visible:ring-foreground/60",
        // شفاف بحد رمادي للأفعال البديلة، مثل "مسح الفلاتر" و"مشاركة" (button-outline)
        outline:
          "border-border bg-transparent hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        // بلا حد ولا خلفية، لأزرار الأيقونات الصغيرة مثل الحذف وإغلاق النوافذ
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
        // أحجام مريحة للمس على الجوال (44 بكسل)
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

function Button({
  className,
  variant = "default",
  size = "default",
  type = "button",
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      type={type}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
