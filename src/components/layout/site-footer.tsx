import Link from "next/link"

import { CopyrightYear } from "@/components/layout/copyright-year"
import { Logo } from "@/components/layout/logo"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/config/site"

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="page-container grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm leading-7 text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>

        {siteConfig.footerNav.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="text-sm font-bold">{group.title}</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block py-1 text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <Separator />

      <div className="page-container flex flex-col gap-1 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © <CopyrightYear /> {siteConfig.name}. جميع الحقوق محفوظة.
        </p>
        <p>الدفع عند الاستلام متاح</p>
      </div>
    </footer>
  )
}
