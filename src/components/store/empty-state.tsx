import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/** حالة فارغة ودّية: سلة فارغة، لا نتائج بحث، قسم لم يُملأ بعد. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon: LucideIcon
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center",
        className
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-6" aria-hidden />
      </span>
      <p className="mt-4 font-bold">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}
      {children && <div className="mt-5">{children}</div>}
    </div>
  )
}
