import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProductDetails } from "@/components/product/product-details"
import { ProductRail } from "@/components/product/product-grid"
import { ProductTabs } from "@/components/product/product-tabs"
import { Breadcrumbs } from "@/components/store/breadcrumbs"
import { JsonLd } from "@/components/store/json-ld"
import { SectionHeading } from "@/components/store/section-heading"
import {
  getProduct,
  getProducts,
  getRelatedProducts,
} from "@/lib/catalog/catalog"
import {
  absoluteImageUrl,
  breadcrumbJsonLd,
  plainDescription,
  productJsonLd,
} from "@/lib/seo"

// كل صفحات المنتجات تُجهَّز وقت البناء، وأي رابط آخر يعرض صفحة 404
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
  const image = product.images[0]
  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.slug}/` },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: `/product/${product.slug}/`,
      images: image
        ? [
            {
              url: absoluteImageUrl(image.src),
              width: 1200,
              height: 1200,
              alt: image.alt,
            },
          ]
        : undefined,
    },
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
    <div className="page-container space-y-12 py-5 md:space-y-16 md:py-8">
      <div>
        <Breadcrumbs items={[...trail, { name: product.name }]} />
        <ProductDetails product={product} />
      </div>

      <ProductTabs product={product} />

      {related.length > 0 && (
        <section aria-labelledby="related-heading">
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
