import type { MetadataRoute } from "next"

import { absoluteUrl } from "@/lib/seo"

// Generated as a static file at build time: out/robots.txt
export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Pages specific to each visitor or without static content, so there is no point indexing them
        disallow: ["/search/", "/cart/", "/checkout/", "/wishlist/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  }
}
