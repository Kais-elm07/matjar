import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ListingView } from "@/components/listing/listing-view"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { JsonLd } from "@/components/shared/json-ld"
import { siteConfig } from "@/config/site"
import { PRODUCT_FORMS, pluralize } from "@/lib/arabic-plural"
import {
  getCategories,
  getCategory,
  getChildCategories,
  getProductCards,
} from "@/lib/catalog/catalog"
import { categoryPath, categoryTrail } from "@/lib/routes"
import { breadcrumbJsonLd, openGraph, shareImages } from "@/lib/seo"

// Every category page is prepared at build time, and any other URL shows the 404 page
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
    alternates: { canonical: categoryPath(category.slug) },
    openGraph: openGraph({
      title: category.name,
      description,
      path: categoryPath(category.slug),
      image: shareImages.category(category.slug),
    }),
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
  const trail = categoryTrail(category.path)

  return (
    <div className="page-container py-5 md:py-8">
      <Breadcrumbs items={[...trail.slice(0, -1), { name: category.name }]} />

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
          className="-mx-4 mb-8 no-scrollbar overflow-x-auto px-4 pb-1"
        >
          <ul className="flex gap-3">
            {children.map((child) => (
              <li key={child.slug} className="shrink-0">
                <Link
                  href={categoryPath(child.slug)}
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

      <JsonLd data={breadcrumbJsonLd(trail)} />
    </div>
  )
}
