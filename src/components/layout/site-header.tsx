import Link from "next/link"
import { BanknoteIcon } from "lucide-react"

import { CategoryMenu } from "@/components/layout/category-menu"
import { HeaderActions } from "@/components/layout/header-actions"
import { Logo } from "@/components/layout/logo"
import { MobileNav, type NavCategory } from "@/components/layout/mobile-nav"
import { SearchBox } from "@/components/layout/search-box"
import { siteConfig } from "@/config/site"
import { getChildCategories, getRootCategories } from "@/lib/catalog/catalog"

/**
 * رأس المتجر: صف كحلي فيه الشعار والبحث والمفضلة والسلة،
 * وتحته على الحاسوب صف أبيض فيه "كل الفئات" وروابط التسوق.
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
  const navLinks = [
    { title: "الرئيسية", href: "/" },
    ...siteConfig.shopNav,
    ...roots.map((category) => ({
      title: category.name,
      href: `/category/${category.slug}`,
    })),
  ]

  return (
    <header className="sticky top-0 z-40">
      <a
        href="#main-content"
        className="sr-only rounded-full bg-highlight px-4 py-2 text-highlight-foreground focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50"
      >
        انتقل إلى المحتوى
      </a>

      <div className="bg-primary text-primary-foreground">
        <div className="page-container flex h-16 items-center gap-2 md:h-[72px] md:gap-6">
          <MobileNav categories={navCategories} />
          <Logo tone="light" />
          <SearchBox className="hidden max-w-2xl flex-1 md:block" />
          <div className="ms-auto hidden shrink-0 items-center gap-2 lg:flex">
            <BanknoteIcon className="size-7 text-highlight" aria-hidden />
            <div className="text-sm leading-5">
              <p className="text-xs text-primary-foreground-muted">
                ادفع براحتك
              </p>
              <p className="font-bold">الدفع عند الاستلام</p>
            </div>
          </div>
          <HeaderActions className="ms-auto lg:ms-0" />
        </div>
        {/* البحث في سطر مستقل على الجوال ليكون واضحاً وسهل الوصول */}
        <div className="page-container pb-3 md:hidden">
          <SearchBox />
        </div>
      </div>

      <nav
        aria-label="التسوق"
        className="relative hidden border-b bg-background md:block"
      >
        <div className="page-container flex h-12 items-center gap-6">
          <CategoryMenu categories={navCategories} />
          <ul className="flex [scrollbar-width:none] items-center gap-6 overflow-x-auto text-sm font-medium whitespace-nowrap">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-sm py-1 underline-offset-8 outline-none hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}
