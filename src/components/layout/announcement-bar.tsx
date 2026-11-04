import Link from "next/link"

import { siteConfig } from "@/config/site"
import { formatPrice } from "@/lib/catalog/money"
import { getCheckoutConfig } from "@/lib/checkout/config"

/** شريط الإعلان الداكن أعلى كل الصفحات. نصه ورابطه في src/config/site.ts، ويختفي إن كان null. */
export function AnnouncementBar() {
  const { announcement } = siteConfig
  if (!announcement) return null

  const text = announcement.text.replace(
    "{freeShipping}",
    formatPrice(getCheckoutConfig().freeShippingFrom)
  )

  return (
    <div className="bg-foreground text-background">
      <p className="page-container flex min-h-8 items-center justify-center py-1.5 text-center text-xs font-medium">
        {announcement.href ? (
          <Link
            href={announcement.href}
            className="rounded-sm underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"
          >
            {text}
          </Link>
        ) : (
          text
        )}
      </p>
    </div>
  )
}
