import { cn } from "@/lib/utils"

interface OrderDetailRowProps {
  label: string
  value: string
  /** Shows the value left to right, for phone numbers */
  ltr?: boolean
  className?: string
}

/** A label and value line in a description list (dt and dd). */
export function OrderDetailRow({
  label,
  value,
  ltr = false,
  className,
}: OrderDetailRowProps) {
  return (
    <div className={cn("flex justify-between gap-4", className)}>
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="text-end">
        {ltr ? <span dir="ltr">{value}</span> : value}
      </dd>
    </div>
  )
}
