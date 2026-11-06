import Link from "next/link"

import { CategoryMenu } from "@/components/layout/category-menu"
import { HeaderActions } from "@/components/layout/header-actions"
import { Logo } from "@/components/layout/logo"
import { MobileMenuButton } from "@/components/layout/mobile-menu-button"
import { MobileSearchButton } from "@/components/layout/mobile-search-button"
import { MobileSearchRow } from "@/components/layout/mobile-search-row"
import { SearchBox } from "@/components/search/search-box"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import type { NavCategory } from "@/lib/catalog/types"
import { cn } from "@/lib/utils"

/** Links in the desktop navigation row: light text that turns orange on hover (DESIGN.md: header-link-hover). */
const NAV_LINK =
  "inline-flex h-11 items-center rounded-lg px-3 text-sm font-medium whitespace-nowrap text-foreground/85 transition-colors outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring aria-expanded:text-primary"

interface SiteHeaderProps {
  /** The categories of the desktop "الفئات" (Categories) panel */
  categories: NavCategory[]
}

/**
 * The dark sticky store header: a row with the logo, a wide search field in the middle, the wishlist,
 * the cart and the "تسوّق الآن" (Shop now) button, and on desktop a second row with the shopping and
 * help links, where "الفئات" (Categories) opens a panel with columns.
 * On mobile: the menu button, the logo, the search button and the cart in a single row.
 */
export function SiteHeader({ categories }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-card text-foreground">
      <div className="page-container flex h-16 items-center gap-2 md:gap-5">
        <MobileMenuButton />
        <Logo />

        <div className="hidden flex-1 justify-center md:flex">
          <SearchBox variant="header" className="max-w-xl" />
        </div>

        <div className="ms-auto flex items-center gap-1">
          <MobileSearchButton className="md:hidden" />
          <HeaderActions />
          <Link
            href="/products"
            className={cn(
              buttonVariants({ variant: "cta", size: "xl" }),
              "ms-2 hidden lg:inline-flex"
            )}
          >
            تسوّق الآن
          </Link>
        </div>
      </div>

      {/* The desktop link row. The large categories panel spans its width, so it is the relative container */}
      <nav
        aria-label="التسوق"
        className="relative hidden border-t border-border/60 md:block"
      >
        <div className="page-container flex h-11 items-center justify-center gap-1">
          <CategoryMenu categories={categories} className={NAV_LINK} />
          {[...siteConfig.shopNav, ...siteConfig.helpNav].map((link) => (
            <Link key={link.href} href={link.href} className={NAV_LINK}>
              {link.title}
            </Link>
          ))}
        </div>
      </nav>
      <MobileSearchRow />
    </header>
  )
}
