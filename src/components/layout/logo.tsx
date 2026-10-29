import Link from "next/link"
import { ShoppingBagIcon } from "lucide-react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export function Logo({
  className,
  onNavigate,
}: {
  className?: string
  onNavigate?: () => void
}) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-lg text-lg font-extrabold outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <ShoppingBagIcon className="size-5" aria-hidden />
      </span>
      {siteConfig.name}
    </Link>
  )
}
