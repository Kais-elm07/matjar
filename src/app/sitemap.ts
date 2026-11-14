import type { MetadataRoute } from "next"

import { getCategories, getProducts } from "@/modules/catalog/queries"
import { getContentPages } from "@/modules/content/pages"
import { categoryPath, contentPagePath, productPath } from "@/lib/routes"
import { absoluteImageUrl, absoluteUrl } from "@/lib/seo"

// /sitemap.xml, computed on every request from the cached catalog, so a product added from the admin
// panel is listed at once (a file prepared at build time is not refreshed by the catalog's tag on Netlify)
export const dynamic = "force-dynamic"

type SitemapEntry = MetadataRoute.Sitemap[number]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ])
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    {
      url: absoluteUrl("/products"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...categories.map((category): SitemapEntry => ({
      url: absoluteUrl(categoryPath(category.slug)),
      changeFrequency: "weekly",
      priority: 0.7,
    })),
    ...products.map((product): SitemapEntry => ({
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
