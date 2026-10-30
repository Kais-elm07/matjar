import Link from "next/link"

import { CartLink } from "@/components/layout/cart-link"
import { Logo } from "@/components/layout/logo"
import { MobileNav, type NavCategory } from "@/components/layout/mobile-nav"
import { SearchBox } from "@/components/layout/search-box"
import { siteConfig } from "@/config/site"
import { getChildCategories, getRootCategories } from "@/lib/catalog/catalog"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const roots = getRootCategories()
  const navCategories: NavCategory[] = roots.map((category) => ({
    slug: category.slug,
    name: category.name,
    children: getChildCategories(category).map(({ slug, name }) => ({
      slug,
      name,
    })),
  }))
  const [allProducts, ...shopLinks] = siteConfig.shopNav
  const desktopLinks = [
    allProducts,
    ...roots.map((category) => ({
      title: category.name,
      href: `/category/${category.slug}`,
    })),
    ...shopLinks,
  ]

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50"
      >
        انتقل إلى المحتوى
      </a>

      <div className="page-container flex h-16 items-center gap-1 md:gap-6">
        <MobileNav categories={navCategories} />
        <Logo />
        <SearchBox className="hidden max-w-2xl flex-1 md:block" />

        <div className="ms-auto flex items-center gap-1">
          <CartLink />
        </div>
      </div>

      {/* البحث في سطر مستقل على الجوال ليكون واضحاً وسهل الوصول */}
      <div className="page-container pb-3 md:hidden">
        <SearchBox />
      </div>

      <nav aria-label="الفئات" className="hidden border-t md:block">
        <ul className="page-container flex h-11 [scrollbar-width:none] items-center gap-6 overflow-x-auto text-sm font-medium whitespace-nowrap">
          {desktopLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "transition-colors hover:text-primary",
                  link.href.includes("sale=1")
                    ? "text-destructive"
                    : "text-muted-foreground"
                )}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
