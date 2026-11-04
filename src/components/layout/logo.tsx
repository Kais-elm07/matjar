import Link from "next/link"
import { ShoppingBagIcon } from "lucide-react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

/** الشعار: حقيبة داكنة في مربع برتقالي، ثم اسم المتجر بالأبيض. شكل واحد على كل الأسطح الداكنة. */
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
        "flex shrink-0 items-center gap-2 rounded-lg text-xl font-bold text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring",
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
