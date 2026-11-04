import Link from "next/link"

import { CategoryMenu } from "@/components/layout/category-menu"
import { HeaderActions } from "@/components/layout/header-actions"
import { HeaderFrame } from "@/components/layout/header-frame"
import { Logo } from "@/components/layout/logo"
import { MobileNav, type NavCategory } from "@/components/layout/mobile-nav"
import {
  MobileSearchButton,
  MobileSearchRow,
} from "@/components/layout/mobile-search"
import { SearchBox } from "@/components/layout/search-box"
import { siteConfig } from "@/config/site"
import { getChildCategories, getRootCategories } from "@/lib/catalog/catalog"
import { cn } from "@/lib/utils"

const NAV_LINK =
  "inline-flex h-10 items-center rounded-full px-3 text-sm font-medium whitespace-nowrap outline-none transition-colors hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring group-data-[tone=light]/hdr:hover:bg-white/10"

/**
 * رأس المتجر في صف واحد: الشعار في البداية، وروابط الأقسام في المنتصف على الحاسوب،
 * والبحث والمفضلة والسلة وزر "تسوّق الآن" في النهاية. شفاف فوق واجهة الرئيسية ثم أبيض عند التمرير.
 */
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

  return (
    <HeaderFrame>
      <div className="page-container flex h-16 items-center gap-2 md:h-[72px] md:gap-4">
        <MobileNav categories={navCategories} />
        <Logo tone="header" className="md:me-4" />

        <nav
          aria-label="التسوق"
          className="relative hidden flex-1 items-center justify-center gap-1 md:flex"
        >
          <CategoryMenu categories={navCategories} className={NAV_LINK} />
          {siteConfig.shopNav.map((link) => (
            <Link key={link.href} href={link.href} className={NAV_LINK}>
              {link.title}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-1 md:ms-0">
          <SearchBox variant="header" className="hidden md:block" />
          <MobileSearchButton className="md:hidden" />
          <HeaderActions />
          <Link
            href="/products"
            className={cn(
              "ms-2 hidden h-10 shrink-0 items-center rounded-full px-5 text-sm font-bold whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring lg:inline-flex",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "group-data-[tone=light]/hdr:bg-background group-data-[tone=light]/hdr:text-foreground group-data-[tone=light]/hdr:hover:bg-background/90"
            )}
          >
            تسوّق الآن
          </Link>
        </div>
      </div>
      <MobileSearchRow />
    </HeaderFrame>
  )
}
