import Link from "next/link"
import { ShoppingBagIcon } from "lucide-react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

/**
 * الشعار: حقيبة بيضاء في مربع كحلي، ثم اسم المتجر.
 * tone="light" للخلفيات الكحلية (التذييل)، و"header" يتبع لون الرأس (أبيض فوق الواجهة ثم داكن)،
 * والافتراضي للخلفيات البيضاء.
 */
export function Logo({
  className,
  tone = "dark",
  onNavigate,
}: {
  className?: string
  tone?: "dark" | "light" | "header"
  onNavigate?: () => void
}) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-lg text-xl font-bold outline-none focus-visible:ring-3 focus-visible:ring-ring",
        tone === "light" && "text-primary-foreground",
        tone === "dark" && "text-foreground",
        tone === "header" && "text-current",
        className
      )}
    >
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-lg",
          tone === "dark" && "bg-primary text-primary-foreground",
          tone === "light" && "bg-background text-primary",
          tone === "header" &&
            "bg-primary text-primary-foreground transition-colors group-data-[tone=light]/hdr:bg-background group-data-[tone=light]/hdr:text-primary"
        )}
      >
        <ShoppingBagIcon className="size-5" aria-hidden />
      </span>
      {siteConfig.name}
    </Link>
  )
}
