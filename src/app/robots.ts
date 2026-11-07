import type { MetadataRoute } from "next"

import { absoluteUrl } from "@/lib/seo"

// Prerendered at build time and served as a file: /robots.txt
export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Pages specific to each visitor or without static content, the private order pages, the API's JSON,
        // and the admin panel
        disallow: [
          "/search/",
          "/cart/",
          "/checkout/",
          "/wishlist/",
          "/orders/",
          "/api/",
          "/admin/",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  }
}
