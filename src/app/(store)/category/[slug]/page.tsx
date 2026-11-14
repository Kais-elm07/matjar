import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ListingView } from "@/components/listing/listing-view"
import { SubcategoryNav } from "@/components/listing/subcategory-nav"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { JsonLd } from "@/components/shared/json-ld"
import { siteConfig } from "@/config/site"
import { PRODUCT_FORMS, pluralize } from "@/lib/arabic-plural"
import {
  getCategories,
  getCategory,
  getChildCategories,
  getProductCards,
} from "@/modules/catalog/queries"
import { categoryPath, categoryTrail } from "@/lib/routes"
import { breadcrumbJsonLd, openGraph, shareImages } from "@/lib/seo"

// Every category page is prepared at build time; a category added later is drawn on its first visit
// and kept (dynamicParams), and an unknown slug shows the 404 page (notFound below)
export const dynamicParams = true

export async function generateStaticParams() {
  return (await getCategories()).map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)
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
  const category = await getCategory(slug)
  if (!category) notFound()

  const [products, children] = await Promise.all([
    getProductCards(category.slug),
    getChildCategories(category),
  ])
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

      <SubcategoryNav subcategories={children} />

      <ListingView products={products} />

      <JsonLd data={breadcrumbJsonLd(trail)} />
    </div>
  )
}
