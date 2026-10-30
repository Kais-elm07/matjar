import Link from "next/link"
import { BanknoteIcon, MessageCircleQuestionIcon } from "lucide-react"

import { Logo } from "@/components/layout/logo"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

/** التذييل: شريط مساعدة كهرماني، ثم أعمدة الروابط على الكحلي، ثم سطر الحقوق. */
export function SiteFooter() {
  return (
    <footer>
      <div className="bg-highlight text-highlight-foreground">
        <div className="page-container flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <MessageCircleQuestionIcon
              className="size-9 shrink-0"
              aria-hidden
            />
            <div>
              <p className="text-lg font-bold md:text-xl">
                عندك سؤال عن منتج أو طلب؟
              </p>
              <p className="text-sm">فريقنا يرد عليك بسرعة ويساعدك تختار.</p>
            </div>
          </div>
          <Link
            href="/pages/contact"
            prefetch={false}
            className={cn(
              buttonVariants({ size: "xl" }),
              "shrink-0 self-start sm:self-auto"
            )}
          >
            تواصل معنا
          </Link>
        </div>
      </div>

      <div className="bg-primary text-primary-foreground">
        <div className="page-container grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Logo tone="light" />
            <p className="max-w-xs text-sm leading-7 text-primary-foreground-muted">
              {siteConfig.description}
            </p>
          </div>

          {siteConfig.footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-base font-bold">{group.title}</h2>
              <ul className="mt-3 space-y-1 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className="inline-block rounded-sm py-1 text-primary-foreground-muted transition-colors outline-none hover:text-highlight focus-visible:ring-3 focus-visible:ring-ring"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-t border-white/10">
          <div className="page-container flex flex-col gap-2 py-5 text-xs text-primary-foreground-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. جميع الحقوق
              محفوظة.
            </p>
            <p className="flex items-center gap-1.5">
              <BanknoteIcon className="size-4 text-highlight" aria-hidden />
              الدفع عند الاستلام متاح
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
