import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ListingView } from "@/components/listing/listing-view"
import { Breadcrumbs } from "@/components/store/breadcrumbs"
import { JsonLd } from "@/components/store/json-ld"
import { siteConfig } from "@/config/site"
import { PRODUCT_FORMS, pluralize } from "@/lib/arabic-plural"
import {
  getCategories,
  getCategory,
  getChildCategories,
  getProductCards,
} from "@/lib/catalog/catalog"
import { absoluteImageUrl, breadcrumbJsonLd } from "@/lib/seo"

// كل صفحات الفئات تُجهَّز وقت البناء، وأي رابط آخر يعرض صفحة 404
export const dynamicParams = false

export function generateStaticParams() {
  return getCategories().map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const category = getCategory(slug)
  if (!category) return {}

  const description =
    category.description ??
    `تسوّق ${category.name} من ${siteConfig.name}: ${pluralize(category.productCount, PRODUCT_FORMS)} بأسعار مميزة والدفع عند الاستلام.`
  return {
    title: category.name,
    description,
    alternates: { canonical: `/category/${category.slug}/` },
    openGraph: {
      title: category.name,
      description,
      url: `/category/${category.slug}/`,
      images: category.image
        ? [{ url: absoluteImageUrl(category.image), width: 1200, height: 1200 }]
        : undefined,
    },
  }
}

export default async function CategoryPage({
  params,
}: PageProps<"/category/[slug]">) {
  const { slug } = await params
  const category = getCategory(slug)
  if (!category) notFound()

  const products = getProductCards(category.slug)
  const children = getChildCategories(category)
  const parents = category.path.slice(0, -1).map((link) => ({
    name: link.name,
    href: `/category/${link.slug}`,
  }))

  return (
    <div className="page-container py-5 md:py-8">
      <Breadcrumbs items={[...parents, { name: category.name }]} />

      <header className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold md:text-3xl">{category.name}</h1>
        {category.description && (
          <p className="max-w-2xl leading-7 text-muted-foreground">
            {category.description}
          </p>
        )}
      </header>

      {children.length > 0 && (
        <nav
          aria-label="الفئات الفرعية"
          className="-mx-4 mb-8 [scrollbar-width:none] overflow-x-auto px-4 pb-1"
        >
          <ul className="flex gap-3">
            {children.map((child) => (
              <li key={child.slug} className="shrink-0">
                <Link
                  href={`/category/${child.slug}`}
                  className="flex items-center gap-3 rounded-full border bg-card py-1.5 ps-1.5 pe-4 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                >
                  {child.image && (
                    <span className="relative size-9 overflow-hidden rounded-full bg-muted">
                      <Image
                        src={child.image}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </span>
                  )}
                  {child.name}
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {child.productCount}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <ListingView products={products} />

      <JsonLd
        data={breadcrumbJsonLd(
          category.path.map((link) => ({
            name: link.name,
            path: `/category/${link.slug}`,
          }))
        )}
      />
    </div>
  )
}
