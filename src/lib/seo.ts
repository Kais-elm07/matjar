import type { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { toSchemaPrice } from "@/lib/catalog/money"
import type { Product } from "@/lib/catalog/types"
import { IMAGE_WIDTHS } from "@/lib/image-loader"

/** صور المشاركة بمقاس 1200×630، تولّدها مسارات src/app/og وقت البناء. */
export const shareImages = {
  site: "/og/site.jpg",
  product: (slug: string) => `/og/product/${slug}.jpg`,
  category: (slug: string) => `/og/category/${slug}.jpg`,
}

/**
 * بيانات المشاركة على مواقع التواصل (Open Graph).
 * Next.js يستبدل openGraph كاملاً في كل صفحة تعرّفه، فيكرر هذا المساعد الحقول المشتركة.
 * دون path ترث الصفحة الصورة العامة دون رابط خاص، كما في السلة والبحث.
 */
export function openGraph({
  title,
  description,
  path,
  image = shareImages.site,
  imageAlt = title,
}: {
  title: string
  description: string
  path?: string
  image?: string
  imageAlt?: string
}): NonNullable<Metadata["openGraph"]> {
  return {
    type: "website",
    locale: "ar_AR",
    siteName: siteConfig.name,
    title,
    description,
    url: path,
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: imageAlt,
        type: "image/jpeg",
      },
    ],
  }
}

/**
 * رابط كامل لصفحة داخل الموقع، مع الشرطة المائلة في النهاية كما في الموقع المنشور.
 * الملفات (مثل icon.svg) تبقى دون شرطة.
 */
export function absoluteUrl(path: string) {
  const isFile = /\.[a-z0-9]+$/i.test(path)
  const normalized = isFile || path.endsWith("/") ? path : `${path}/`
  return `${siteConfig.url}${normalized}`
}

/** رابط كامل لأكبر نسخة من الصورة، لصور المشاركة والبيانات المنظمة. */
export function absoluteImageUrl(src: string) {
  if (/^https?:\/\//.test(src)) return src
  const hasExtension = /\.[a-z0-9]{2,5}$/i.test(src)
  const largest = IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1]
  return `${siteConfig.url}${hasExtension ? src : `${src}-${largest}.webp`}`
}

/** نص عادي مختصر من الوصف، لوصف الصفحة في نتائج البحث. نقاط القوائم تُفصل بفواصل. */
export function plainDescription(text: string, maxLength = 155) {
  const plain = text
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
      const items = lines.filter((line) => line.startsWith("- "))
      if (items.length === lines.length) {
        return `${items.map((line) => line.slice(2)).join("، ")}.`
      }
      return lines.join(" ")
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
  return plain.length > maxLength
    ? `${plain.slice(0, maxLength - 1).trimEnd()}…`
    : plain
}

export function productJsonLd(product: Product) {
  const url = absoluteUrl(`/product/${product.slug}`)
  const availability = product.inStock
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock"
  const priceCurrency = siteConfig.currency.code

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: plainDescription(product.description, 500),
    image: product.images.map((image) => absoluteImageUrl(image.src)),
    sku: product.variants[0]?.sku,
    category: product.categoryPath.map((link) => link.name).join(" > "),
    offers:
      product.maxPrice !== product.price
        ? {
            "@type": "AggregateOffer",
            priceCurrency,
            lowPrice: toSchemaPrice(product.price),
            highPrice: toSchemaPrice(product.maxPrice),
            offerCount: product.variants.length,
            availability,
            url,
          }
        : {
            "@type": "Offer",
            priceCurrency,
            price: toSchemaPrice(product.price),
            availability,
            itemCondition: "https://schema.org/NewCondition",
            url,
          },
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "الرئيسية", path: "/" }, ...items].map(
      (item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.path),
      })
    ),
  }
}

export function websiteJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: absoluteUrl("/"),
      inLanguage: "ar",
      potentialAction: {
        "@type": "SearchAction",
        target: `${absoluteUrl("/search")}?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
      logo: absoluteUrl("/icon.svg"),
    },
  ]
}
