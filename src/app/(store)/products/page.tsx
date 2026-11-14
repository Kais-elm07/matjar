import type { Metadata } from "next"

import { ListingView } from "@/modules/listing/components/listing-view"
import { ProductsHeading } from "@/modules/listing/components/products-heading"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { siteConfig } from "@/config/site"
import { getCategoryOptions, getProductCards } from "@/modules/catalog/queries"
import { openGraph } from "@/lib/seo"

const title = "كل المنتجات"
const description = `تصفّح كل منتجات ${siteConfig.name}، وفلترها حسب الفئة والسعر والمقاس واللون، والدفع عند الاستلام.`

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/products/" },
  openGraph: openGraph({ title, description, path: "/products/" }),
}

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProductCards(),
    getCategoryOptions(),
  ])

  return (
    <div className="page-container py-5 md:py-8">
      <Breadcrumbs items={[{ name: "كل المنتجات" }]} />
      <ProductsHeading />
      <ListingView products={products} categories={categories} />
    </div>
  )
}
