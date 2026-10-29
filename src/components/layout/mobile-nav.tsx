"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRightIcon, MenuIcon } from "lucide-react"

import { Logo } from "@/components/layout/logo"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { siteConfig, type NavLink } from "@/config/site"

/** قائمة الجوال: تنزلق من اليمين وتُغلق تلقائياً عند اختيار أي رابط. */
export function MobileNav() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon-xl"
            className="md:hidden"
            aria-label="فتح القائمة"
          />
        }
      >
        <MenuIcon aria-hidden />
      </SheetTrigger>
      <SheetContent side="right" className="w-[85%] gap-0 p-0">
        <SheetHeader className="border-b pe-14">
          <SheetTitle className="sr-only">القائمة الرئيسية</SheetTitle>
          <Logo onNavigate={close} />
        </SheetHeader>
        <nav
          aria-label="القائمة الرئيسية"
          className="flex-1 overflow-y-auto p-2"
        >
          <NavList links={siteConfig.mainNav} onNavigate={close} />
          <Separator className="my-2" />
          <NavList
            links={siteConfig.helpNav}
            onNavigate={close}
            className="text-muted-foreground"
          />
        </nav>
      </SheetContent>
    </Sheet>
  )
}

function NavList({
  links,
  onNavigate,
  className,
}: {
  links: NavLink[]
  onNavigate: () => void
  className?: string
}) {
  return (
    <ul className={className}>
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            onClick={onNavigate}
            className="flex h-12 items-center justify-between rounded-lg px-3 text-base font-medium outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {link.title}
            <ChevronRightIcon
              className="size-4 opacity-50 rtl:rotate-180"
              aria-hidden
            />
          </Link>
        </li>
      ))}
    </ul>
  )
}
