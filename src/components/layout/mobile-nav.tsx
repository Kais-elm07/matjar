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
import { cn } from "@/lib/utils"

export type NavCategory = {
  slug: string
  name: string
  children: { slug: string; name: string }[]
}

/** قائمة الجوال: تنزلق من اليمين وتُغلق تلقائياً عند اختيار أي رابط. */
export function MobileNav({ categories }: { categories: NavCategory[] }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const [allProducts, ...shopLinks] = siteConfig.shopNav

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
          <NavList links={[allProducts]} onNavigate={close} />
          <ul>
            {categories.map((category) => (
              <li key={category.slug}>
                <NavItem
                  href={`/category/${category.slug}`}
                  title={category.name}
                  onNavigate={close}
                />
                {category.children.length > 0 && (
                  <ul className="ms-4 border-s ps-1">
                    {category.children.map((child) => (
                      <li key={child.slug}>
                        <NavItem
                          href={`/category/${child.slug}`}
                          title={child.name}
                          onNavigate={close}
                          className="h-10 text-sm font-normal text-muted-foreground"
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <NavList links={shopLinks} onNavigate={close} />
          <Separator className="my-2" />
          <NavList
            links={siteConfig.helpNav}
            onNavigate={close}
            itemClassName="text-muted-foreground"
          />
        </nav>
      </SheetContent>
    </Sheet>
  )
}

function NavList({
  links,
  onNavigate,
  itemClassName,
}: {
  links: NavLink[]
  onNavigate: () => void
  itemClassName?: string
}) {
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

function NavItem({
  href,
  title,
  onNavigate,
  className,
}: {
  href: string
  title: string
  onNavigate: () => void
  className?: string
}) {
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
