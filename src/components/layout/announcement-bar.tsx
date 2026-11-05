import Link from "next/link"

import { siteConfig } from "@/config/site"
import { formatPrice } from "@/lib/catalog/money"
import { getCheckoutConfig } from "@/lib/checkout/config"

/** Orange announcement bar at the top of every page. Its text and link are in src/config/site.ts; hidden if null. */
export function AnnouncementBar() {
  const { announcement } = siteConfig
  if (!announcement) return null

  const text = announcement.text.replace(
    "{freeShipping}",
    formatPrice(getCheckoutConfig().freeShippingFrom)
  )

  return (
    <div className="bg-primary text-primary-foreground">
      <p className="page-container flex min-h-8 items-center justify-center text-center text-xs font-bold">
        {announcement.href ? (
          // The link fills the bar's whole height, the largest target this thin bar allows (DESIGN.md: Layout)
          <Link
            href={announcement.href}
            className="flex min-h-8 items-center rounded-sm underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-primary-foreground/60"
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
