import Link from "next/link"
import { UserIcon } from "lucide-react"

import { CartLink } from "@/components/layout/cart-link"
import { Logo } from "@/components/layout/logo"
import { MobileNav } from "@/components/layout/mobile-nav"
import { SearchForm } from "@/components/layout/search-form"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50"
      >
        انتقل إلى المحتوى
      </a>

      <div className="page-container flex h-16 items-center gap-1 md:gap-6">
        <MobileNav />
        <Logo />
        <SearchForm className="hidden max-w-2xl flex-1 md:block" />

        <div className="ms-auto flex items-center gap-1">
          <Link
            href="/account"
            aria-label="حسابي"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-xl" }),
              "lg:w-auto lg:px-3"
            )}
          >
            <UserIcon aria-hidden />
            <span className="hidden lg:inline">حسابي</span>
          </Link>
          <CartLink />
        </div>
      </div>

      {/* البحث في سطر مستقل على الجوال ليكون واضحاً وسهل الوصول */}
      <div className="page-container pb-3 md:hidden">
        <SearchForm />
      </div>

      <nav aria-label="روابط التسوق" className="hidden border-t md:block">
        <ul className="page-container flex h-11 items-center gap-6 text-sm font-medium">
          {siteConfig.mainNav.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-primary"
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
