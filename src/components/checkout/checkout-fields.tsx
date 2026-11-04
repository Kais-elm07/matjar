import type { LucideIcon } from "lucide-react"

import { Label } from "@/components/ui/label"
import { formatPrice } from "@/lib/catalog/money"
import { cn } from "@/lib/utils"

/** الحقول 44 بكسل و16 بكسل للنص، حتى لا يكبّر الجوال الصفحة عند الكتابة. */
export const CHECKOUT_INPUT = "h-11 bg-background px-3 text-base md:text-base"

/** خطوة مرقمة في نموذج الطلب: دائرة برتقالية بالرقم وعنوان، داخل بطاقة بحد رفيع. */
export function CheckoutSection({
  step,
  title,
  children,
}: {
  step: number
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      aria-labelledby={`checkout-step-${step}`}
      className="rounded-xl border p-4 md:p-6"
    >
      <h2
        id={`checkout-step-${step}`}
        className="mb-4 flex items-center gap-3 text-lg font-bold"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}

/** حقل بتسمية فوقه، ورسالة الخطأ أو التلميح تحته. */
export function CheckoutField({
  id,
  label,
  optional = false,
  hint,
  error,
  className,
  children,
}: {
  id: string
  label: string
  optional?: boolean
  hint?: string
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {optional && (
          <span className="font-normal text-muted-foreground">(اختياري)</span>
        )}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

/** خيار شحن كبطاقة قابلة للنقر، والمختار بحد برتقالي. */
export function ShippingOption({
  icon: Icon,
  title,
  description,
  price,
  disabled = false,
  ...input
}: {
  icon: LucideIcon
  title: string
  description: string
  price: number | null
  disabled?: boolean
} & React.ComponentProps<"input">) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors has-checked:border-primary has-checked:bg-primary/5 has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <input
        type="radio"
        disabled={disabled}
        className="size-4 shrink-0 accent-primary"
        {...input}
      />
      <Icon className="size-5 shrink-0 text-primary" aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block font-bold">{title}</span>
        <span className="block text-sm text-muted-foreground">
          {description}
        </span>
      </span>
      <span className="shrink-0 text-sm font-bold text-primary">
        {price === null ? "" : price === 0 ? "مجاناً" : formatPrice(price)}
      </span>
    </label>
  )
}
