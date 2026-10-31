import type { Metadata } from "next"

import { ListingView } from "@/components/listing/listing-view"
import { ProductsHeading } from "@/components/listing/products-heading"
import { Breadcrumbs } from "@/components/store/breadcrumbs"
import { siteConfig } from "@/config/site"
import { getCategoryOptions, getProductCards } from "@/lib/catalog/catalog"
import { openGraph } from "@/lib/seo"

const title = "كل المنتجات"
const description = `تصفّح كل منتجات ${siteConfig.name}، وفلترها حسب الفئة والسعر والمقاس واللون، والدفع عند الاستلام.`

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/products/" },
  openGraph: openGraph({ title, description, path: "/products/" }),
}

export default function ProductsPage() {
  const products = getProductCards()

  return (
    <div className="page-container py-5 md:py-8">
      <Breadcrumbs items={[{ name: "كل المنتجات" }]} />
      <ProductsHeading />
      <ListingView products={products} categories={getCategoryOptions()} />
    </div>
  )
}
