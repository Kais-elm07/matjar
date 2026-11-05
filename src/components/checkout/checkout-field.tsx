import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface CheckoutFieldProps {
  id: string
  label: string
  optional?: boolean
  hint?: string
  error?: string
  className?: string
  children: React.ReactNode
}

/** A field with its label above it and the error message or hint below it. */
export function CheckoutField({
  id,
  label,
  optional = false,
  hint,
  error,
  className,
  children,
}: CheckoutFieldProps) {
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
