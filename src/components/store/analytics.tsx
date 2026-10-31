import Script from "next/script"

import { siteConfig } from "@/config/site"

/**
 * سكربت الإحصاءات إن فُعّلت في src/config/site.ts.
 * يُحمَّل بعد اكتمال الصفحة فلا يبطئها، والأداتان تتابعان التنقل بين الصفحات تلقائياً.
 */
export function Analytics() {
  const { analytics } = siteConfig
  if (!analytics) return null

  if (analytics.provider === "plausible") {
    return (
      <Script
        src={analytics.src ?? "https://plausible.io/js/script.js"}
        data-domain={analytics.domain}
        strategy="lazyOnload"
      />
    )
  }
  return (
    <Script
      src={analytics.src ?? "https://cloud.umami.is/script.js"}
      data-website-id={analytics.websiteId}
      strategy="lazyOnload"
    />
  )
}
