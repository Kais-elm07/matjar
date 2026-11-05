"use client"

import Link from "next/link"
import { ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface NavItemProps {
  href: string
  title: string
  onNavigate: () => void
  className?: string
}

export function NavItem({ href, title, onNavigate, className }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex h-12 items-center justify-between rounded-lg px-3 text-base font-medium outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      {title}
      <ChevronRightIcon
        className="size-4 opacity-50 rtl:rotate-180"
        aria-hidden
      />
    </Link>
  )
}
