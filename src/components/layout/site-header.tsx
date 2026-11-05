import Link from "next/link"

import { CategoryMenu } from "@/components/layout/category-menu"
import { HeaderActions } from "@/components/layout/header-actions"
import { Logo } from "@/components/layout/logo"
import { MobileNav, type NavCategory } from "@/components/layout/mobile-nav"
import { MobileSearchButton } from "@/components/layout/mobile-search-button"
import { MobileSearchRow } from "@/components/layout/mobile-search-row"
import { SearchBox } from "@/components/layout/search-box"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { getChildCategories, getRootCategories } from "@/lib/catalog/catalog"
import { cn } from "@/lib/utils"

/** روابط صف التنقل على الحاسوب: نص فاتح يصبح برتقالياً عند المرور (DESIGN.md: header-link-hover). */
const NAV_LINK =
  "inline-flex h-10 items-center rounded-lg px-3 text-sm font-medium whitespace-nowrap text-foreground/85 transition-colors outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring aria-expanded:text-primary"

/**
 * رأس المتجر الداكن الثابت: صف فيه الشعار وحقل بحث عريض في المنتصف والمفضلة والسلة وزر "تسوّق الآن"،
 * وعلى الحاسوب صف ثانٍ بروابط التسوق والمساعدة، و"الفئات" يفتح لوحة بأعمدة.
 * على الجوال: زر القائمة والشعار وزر البحث والسلة في صف واحد.
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
    <header className="sticky top-0 z-40 border-b bg-card text-foreground">
      <div className="page-container flex h-16 items-center gap-2 md:gap-5">
        <MobileNav categories={navCategories} />
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
              buttonVariants({ variant: "cta" }),
              "ms-2 hidden h-10 px-5 text-sm font-bold lg:inline-flex"
            )}
          >
            تسوّق الآن
          </Link>
        </div>
      </div>

      {/* صف الروابط على الحاسوب. لوحة الفئات الكبيرة تمتد بعرضه، فهو الحاوية النسبية */}
      <nav
        aria-label="التسوق"
        className="relative hidden border-t border-border/60 md:block"
      >
        <div className="page-container flex h-10 items-center justify-center gap-1">
          <CategoryMenu categories={navCategories} className={NAV_LINK} />
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
