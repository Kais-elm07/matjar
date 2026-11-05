import Link from "next/link"
import { BanknoteIcon } from "lucide-react"

import { Logo } from "@/components/layout/logo"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"

/**
 * The dark full-width footer: the logo, the store statement and the "تواصل معنا" (Contact us)
 * button on the start side, the link columns on the end side, then the copyright line, and it
 * ends in an orange bar (DESIGN.md: footer-bar).
 */
export function SiteFooter() {
  return (
    <footer className="bg-card text-foreground">
      <div className="page-container grid gap-10 py-12 md:grid-cols-[1.2fr_minmax(0,2fr)] md:gap-16 md:py-16">
        <div className="flex flex-col items-start gap-5">
          <Logo />
          <p className="max-w-md text-lg leading-8 text-muted-foreground">
            {siteConfig.statement}
          </p>
          <Link
            href="/pages/contact"
            prefetch={false}
            className={buttonVariants({ variant: "cta", size: "xl" })}
          >
            تواصل معنا
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {siteConfig.footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-sm font-bold">{group.title}</h2>
              <ul className="mt-2 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className="inline-flex min-h-11 items-center rounded-sm text-muted-foreground transition-colors outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t">
        <div className="page-container flex flex-col gap-3 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. جميع الحقوق محفوظة.
          </p>
          <p className="flex items-center gap-1.5">
            <BanknoteIcon className="size-4 text-primary" aria-hidden />
            الدفع عند الاستلام متاح
          </p>
        </div>
      </div>
      <div aria-hidden className="h-3 bg-primary" />
    </footer>
  )
}
