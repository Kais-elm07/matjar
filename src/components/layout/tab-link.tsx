import Link from "next/link"
import type { LucideIcon } from "lucide-react"

import { CountBadge } from "@/components/layout/count-badge"
import { cn } from "@/lib/utils"

import { TAB_BAR_ITEM as ITEM } from "./tab-bar-styles"

interface TabLinkProps {
  href: string
  icon: LucideIcon
  label: string
  count?: number
  active: boolean
}

export function TabLink({
  href,
  icon: Icon,
  label,
  count = 0,
  active,
}: TabLinkProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      aria-label={count > 0 ? `${label} (${count})` : undefined}
      className={cn(ITEM, active ? "text-primary" : "text-muted-foreground")}
    >
      <span className="relative">
        <Icon aria-hidden />
        <CountBadge count={count} className="-end-2.5 -top-2" />
      </span>
      {label}
    </Link>
  )
}
