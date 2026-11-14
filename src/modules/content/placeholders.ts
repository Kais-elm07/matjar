import "server-only"

import { siteConfig } from "@/config/site"
import { getCheckoutConfig } from "@/modules/checkout/config"
import { formatPrice } from "@/lib/money"

/** The analytics sentence on the privacy page, based on what is enabled in src/config/site.ts. */
function analyticsSentence() {
  const { analytics } = siteConfig
  if (!analytics) return "لا نستخدم أدوات تحليل ترصد تصفحك."
  const name = { plausible: "Plausible", umami: "Umami" }[analytics.provider]
  return `لا نستخدم أدوات تحليل ترصد تصفحك: نكتفي بعدّ الزيارات بأداة ${name}، دون ملفات تعريف ارتباط ودون حفظ ما يحدد هويتك.`
}

/**
 * Replaces {store}, {email}, {phone}, {freeShipping} and {analytics} with their current settings values,
 * in the static pages and the announcement bar. Any other {name} stays as written.
 */
export function fillPlaceholders(text: string) {
  const values: Record<string, string> = {
    store: siteConfig.name,
    email: siteConfig.contact.email,
    phone: siteConfig.contact.phone,
    freeShipping: formatPrice(getCheckoutConfig().freeShippingFrom),
    analytics: analyticsSentence(),
  }
  return text.replace(
    /\{(\w+)\}/g,
    (match, key: string) => values[key] ?? match
  )
}
