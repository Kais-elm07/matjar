import type { MetadataRoute } from "next"

import { getCategories, getProducts } from "@/lib/catalog/catalog"
import { absoluteImageUrl, absoluteUrl } from "@/lib/seo"

// يُولَّد كملف ثابت وقت البناء: out/sitemap.xml
export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    {
      url: absoluteUrl("/products"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...getCategories().map((category) => ({
      url: absoluteUrl(`/category/${category.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...getProducts().map((product) => ({
      url: absoluteUrl(`/product/${product.slug}`),
      lastModified: product.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: product.images.map((image) => absoluteImageUrl(image.src)),
    })),
  ]
}
