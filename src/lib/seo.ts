import type { Metadata } from "next"

import { siteConfig } from "@/config/site"
import type { Product } from "@/modules/catalog/types"
import { toPlainText, type FaqGroup } from "@/lib/text-format"
import { IMAGE_WIDTHS, imageFile } from "@/lib/image-loader"
import { toSchemaPrice } from "@/lib/money"
import { productPath } from "@/lib/routes"

/** Share images at 1200×630, generated at build time by the routes in src/app/og. */
export const shareImages = {
  site: "/og/site.jpg",
  product: (slug: string) => `/og/product/${slug}.jpg`,
  category: (slug: string) => `/og/category/${slug}.jpg`,
}

/**
 * Social media sharing data (Open Graph).
 * Next.js replaces openGraph entirely in every page that defines it, so this helper repeats the shared fields.
 * Without path, the page inherits the general image and has no URL of its own, as in the cart and search.
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
 * Full URL of a page on the site, with the trailing slash as on the published site.
 * Files (such as icon.svg) stay without a slash.
 */
export function absoluteUrl(path: string) {
  const isFile = /\.[a-z0-9]+$/i.test(path)
  const normalized = isFile || path.endsWith("/") ? path : `${path}/`
  return `${siteConfig.url}${normalized}`
}

/** Full URL of the largest copy of an image, for share images and structured data. */
export function absoluteImageUrl(src: string) {
  const file = imageFile(src, IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1])
  return /^https?:\/\//.test(file) ? file : `${siteConfig.url}${file}`
}

/** Short plain text from a description, for search result snippets. List items are joined by commas. */
export function plainDescription(text: string, maxLength = 155) {
  const plain = toPlainText(text)
  return plain.length > maxLength
    ? `${plain.slice(0, maxLength - 1).trimEnd()}…`
    : plain
}

export function productJsonLd(product: Product) {
  const url = absoluteUrl(productPath(product.slug))
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

/** The FAQPage data that search engines read, with the answers as plain text. */
export function faqJsonLd(groups: FaqGroup[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: toPlainText(item.answer) },
      }))
    ),
  }
}

/** The breadcrumb that search engines read, starting with the home page. */
export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "الرئيسية", href: "/" }, ...items].map(
      (item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.href),
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
