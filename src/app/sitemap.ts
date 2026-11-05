import type { MetadataRoute } from "next"

import { getCategories, getProducts } from "@/lib/catalog/catalog"
import { getContentPages } from "@/lib/content/pages"
import { categoryPath, contentPagePath, productPath } from "@/lib/routes"
import { absoluteImageUrl, absoluteUrl } from "@/lib/seo"

// Generated as a static file at build time: out/sitemap.xml
export const dynamic = "force-static"

type SitemapEntry = MetadataRoute.Sitemap[number]

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    {
      url: absoluteUrl("/products"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...getCategories().map((category): SitemapEntry => ({
      url: absoluteUrl(categoryPath(category.slug)),
      changeFrequency: "weekly",
      priority: 0.7,
    })),
    ...getProducts().map((product): SitemapEntry => ({
      url: absoluteUrl(productPath(product.slug)),
      lastModified: product.createdAt,
      changeFrequency: "monthly",
      priority: 0.6,
      images: product.images.map((image) => absoluteImageUrl(image.src)),
    })),
    ...getContentPages().map((page): SitemapEntry => ({
      url: absoluteUrl(contentPagePath(page.slug)),
      changeFrequency: "yearly",
      priority: 0.3,
    })),
  ]
}
