import Link from "next/link"
import { ShoppingBagIcon } from "lucide-react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

/**
 * الشعار: حقيبة كحلية في مربع كهرماني، ثم اسم المتجر.
 * tone="light" للخلفيات الكحلية (الرأس والتذييل)، والافتراضي للخلفيات البيضاء.
 */
export function Logo({
  className,
  tone = "dark",
  onNavigate,
}: {
  className?: string
  tone?: "dark" | "light"
  onNavigate?: () => void
}) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-lg text-xl font-bold outline-none focus-visible:ring-3 focus-visible:ring-ring",
        tone === "light" ? "text-primary-foreground" : "text-foreground",
        className
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-highlight text-primary">
        <ShoppingBagIcon className="size-5" aria-hidden />
      </span>
      {siteConfig.name}
    </Link>
  )
}
