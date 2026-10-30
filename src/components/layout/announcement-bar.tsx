import Link from "next/link"

import { siteConfig } from "@/config/site"
import { formatPrice } from "@/lib/catalog/money"
import { getCheckoutConfig } from "@/lib/checkout/config"

/** شريط الإعلان أعلى كل الصفحات. نصه ورابطه في src/config/site.ts، ويختفي إن كان null. */
export function AnnouncementBar() {
  const { announcement } = siteConfig
  if (!announcement) return null

  const text = announcement.text.replace(
    "{freeShipping}",
    formatPrice(getCheckoutConfig().freeShippingFrom)
  )

  return (
    <div className="bg-highlight text-highlight-foreground">
      <p className="page-container flex min-h-9 items-center justify-center py-1.5 text-center text-xs font-medium sm:text-sm">
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
