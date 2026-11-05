import Script from "next/script"

import { siteConfig } from "@/config/site"

/**
 * The analytics script, if analytics is enabled in src/config/site.ts.
 * It loads after the page has finished loading, so it doesn't slow the page down,
 * and both tools track navigation between pages automatically.
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
