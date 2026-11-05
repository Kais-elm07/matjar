import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProductDetails } from "@/components/product/product-details"
import { ProductRail } from "@/components/product/product-rail"
import { ProductTabs } from "@/components/product/product-tabs"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { JsonLd } from "@/components/shared/json-ld"
import { SectionHeading } from "@/components/shared/section-heading"
import {
  getProduct,
  getProducts,
  getRelatedProducts,
} from "@/lib/catalog/catalog"
import {
  breadcrumbJsonLd,
  openGraph,
  plainDescription,
  productJsonLd,
  shareImages,
} from "@/lib/seo"

// Every product page is prepared at build time, and any other URL shows the 404 page
export const dynamicParams = false

export function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return {}

  const description = plainDescription(product.description)
  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.slug}/` },
    openGraph: openGraph({
      title: product.name,
      description,
      path: `/product/${product.slug}/`,
      image: shareImages.product(product.slug),
    }),
  }
}

export default async function ProductPage({
  params,
}: PageProps<"/product/[slug]">) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const related = getRelatedProducts(product)
  const trail = product.categoryPath.map((link) => ({
    name: link.name,
    href: `/category/${link.slug}`,
  }))

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
          ...product.categoryPath.map((link) => ({
            name: link.name,
            path: `/category/${link.slug}`,
          })),
          { name: product.name, path: `/product/${product.slug}` },
        ])}
      />
    </div>
  )
}
