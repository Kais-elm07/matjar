import Link from "next/link"
import { BanknoteIcon } from "lucide-react"

import { Logo } from "@/components/layout/logo"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"

/**
 * التذييل الكحلي بعرض الشاشة: جملة كبيرة عن المتجر وزر "تواصل معنا" في جهة البداية،
 * وأعمدة الروابط في جهة النهاية، ثم سطر الحقوق والشعار بحد علوي خفيف.
 */
export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="page-container grid gap-12 py-14 md:grid-cols-[1.3fr_minmax(0,2fr)] md:gap-16 md:py-20">
        <div className="flex flex-col items-start gap-6">
          <p className="max-w-md text-2xl leading-snug font-bold md:text-3xl">
            {siteConfig.statement}
          </p>
          <Link
            href="/pages/contact"
            prefetch={false}
            className={buttonVariants({ variant: "on-image", size: "xl" })}
          >
            تواصل معنا
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {siteConfig.footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-sm font-bold">{group.title}</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className="inline-block rounded-sm py-0.5 text-primary-foreground-muted underline-offset-4 transition-colors outline-none hover:text-primary-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring"
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

      <div className="border-t border-white/10">
        <div className="page-container flex flex-col gap-3 py-6 text-xs text-primary-foreground-muted sm:flex-row sm:items-center sm:justify-between">
          <Logo
            tone="light"
            className="text-base [&_svg]:size-4 [&>span]:size-7"
          />
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. جميع الحقوق محفوظة.
          </p>
          <p className="flex items-center gap-1.5">
            <BanknoteIcon className="size-4" aria-hidden />
            الدفع عند الاستلام متاح
          </p>
        </div>
      </div>
    </footer>
  )
}
