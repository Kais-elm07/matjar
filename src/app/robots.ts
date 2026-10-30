import type { MetadataRoute } from "next"

import { absoluteUrl } from "@/lib/seo"

// يُولَّد كملف ثابت وقت البناء: out/robots.txt
export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // صفحات خاصة بكل زائر أو بلا محتوى ثابت، فلا فائدة من أرشفتها
        disallow: ["/search/", "/cart/", "/checkout/", "/wishlist/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  }
}
