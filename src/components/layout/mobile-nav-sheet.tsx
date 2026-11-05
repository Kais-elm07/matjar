"use client"

import { Logo } from "@/components/layout/logo"
import type { NavCategory } from "@/components/layout/mobile-nav"
import { NavItem } from "@/components/layout/nav-item"
import { NavList } from "@/components/layout/nav-list"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { siteConfig } from "@/config/site"
import { useUiStore } from "@/lib/store/ui"

interface MobileNavSheetProps {
  categories: NavCategory[]
}

/** محتوى قائمة الجوال: تنزلق من اليمين وتُغلق تلقائياً عند اختيار أي رابط. */
export function MobileNavSheet({ categories }: MobileNavSheetProps) {
  const open = useUiStore((state) => state.menuOpen)
  const setOpen = useUiStore((state) => state.setMenuOpen)
  const close = () => setOpen(false)
  const [allProducts, ...shopLinks] = siteConfig.shopNav

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
