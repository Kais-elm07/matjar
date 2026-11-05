"use client"

import { MobileNavLink } from "@/components/layout/mobile-nav-link"
import type { NavLink } from "@/config/site"

interface MobileNavLinksProps {
  links: NavLink[]
  onNavigate: () => void
  itemClassName?: string
}

export function MobileNavLinks({
  links,
  onNavigate,
  itemClassName,
}: MobileNavLinksProps) {
  return (
    <ul>
      {links.map((link) => (
        <li key={link.href}>
          <MobileNavLink
            href={link.href}
            title={link.title}
            onNavigate={onNavigate}
            className={itemClassName}
          />
        </li>
      ))}
    </ul>
  )
}
