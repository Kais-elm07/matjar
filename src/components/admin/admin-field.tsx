import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface AdminFieldProps {
  /** The input's id, for the label */
  id: string
  label: string
  optional?: boolean
  hint?: React.ReactNode
  className?: string
  children: React.ReactNode
}

/** A field in an admin form: the label above it and a short hint under it, as in the checkout. */
export function AdminField({
  id,
  label,
  optional = false,
  hint,
  className,
  children,
}: AdminFieldProps) {
  return (
    <div className={cn("min-w-0 space-y-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {optional && (
          <span className="font-normal text-muted-foreground">(اختياري)</span>
        )}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
