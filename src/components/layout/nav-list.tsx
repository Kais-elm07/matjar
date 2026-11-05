"use client"

import { NavItem } from "@/components/layout/nav-item"
import type { NavLink } from "@/config/site"

interface NavListProps {
  links: NavLink[]
  onNavigate: () => void
  itemClassName?: string
}

export function NavList({ links, onNavigate, itemClassName }: NavListProps) {
  return (
    <ul>
      {links.map((link) => (
        <li key={link.href}>
          <NavItem
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
