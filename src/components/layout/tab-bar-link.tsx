import Link from "next/link"
import type { LucideIcon } from "lucide-react"

import { CountBadge } from "@/components/layout/count-badge"
import { TAB_BAR_ITEM } from "@/components/layout/tab-bar-styles"
import { cn } from "@/lib/utils"

interface TabBarLinkProps {
  href: string
  icon: LucideIcon
  label: string
  count?: number
  active: boolean
}

export function TabBarLink({
  href,
  icon: Icon,
  label,
  count = 0,
  active,
}: TabBarLinkProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      aria-label={count > 0 ? `${label} (${count})` : undefined}
      className={cn(
        TAB_BAR_ITEM,
        active ? "text-primary" : "text-muted-foreground"
      )}
    >
      <span className="relative">
        <Icon aria-hidden />
        <CountBadge count={count} className="-end-2.5 -top-2" />
      </span>
      {label}
    </Link>
  )
}
