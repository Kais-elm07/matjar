import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProductDetails } from "@/modules/catalog/components/product-details"
import { ProductRail } from "@/modules/catalog/components/product-rail"
import { ProductTabs } from "@/modules/catalog/components/product-tabs"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { JsonLd } from "@/components/shared/json-ld"
import { SectionHeading } from "@/components/shared/section-heading"
import {
  getProduct,
  getProducts,
  getRelatedProducts,
} from "@/modules/catalog/queries"
import { categoryTrail, productPath } from "@/lib/routes"
import {
  breadcrumbJsonLd,
  openGraph,
  plainDescription,
  productJsonLd,
  shareImages,
} from "@/lib/seo"

// Every product page is prepared at build time; a product added later is drawn on its first visit
// and kept (dynamicParams), and an unknown slug shows the 404 page (notFound below)
export const dynamicParams = true

export async function generateStaticParams() {
  return (await getProducts()).map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return {}

  const description = plainDescription(product.description)
  return {
    title: product.name,
    description,
    alternates: { canonical: productPath(product.slug) },
    openGraph: openGraph({
      title: product.name,
      description,
      path: productPath(product.slug),
      image: shareImages.product(product.slug),
    }),
  }
}

export default async function ProductPage({
  params,
}: PageProps<"/product/[slug]">) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const related = await getRelatedProducts(product)
  const trail = categoryTrail(product.categoryPath)

  return (
    // The info tabs and the related products are rendered only when they come near the screen
    // (section-later in globals.css), so a phone shows the photo and the price sooner
    <div className="page-container flex flex-col gap-12 py-5 md:gap-16 md:py-8">
      <div>
        <Breadcrumbs items={[...trail, { name: product.name }]} />
        <ProductDetails
          product={{
            slug: product.slug,
            name: product.name,
            images: product.images,
            variants: product.variants,
            optionGroups: product.optionGroups,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
          }}
        />
      </div>

      {/* A wrapper, because the tabs have a top border and padding of their own */}
      <div className="section-later">
        <ProductTabs product={product} />
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="section-later">
          <ProductRail
            label="منتجات قد تعجبك"
            header={
              <SectionHeading id="related-heading" title="منتجات قد تعجبك" />
            }
            products={related}
          />
        </section>
      )}

      <JsonLd data={productJsonLd(product)} />
      <JsonLd
        data={breadcrumbJsonLd([
          ...trail,
          { name: product.name, href: productPath(product.slug) },
        ])}
      />
    </div>
  )
}
