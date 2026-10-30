import type { Metadata } from "next"

import { ListingView } from "@/components/listing/listing-view"
import { ProductsHeading } from "@/components/listing/products-heading"
import { Breadcrumbs } from "@/components/store/breadcrumbs"
import { siteConfig } from "@/config/site"
import { getCategoryOptions, getProductCards } from "@/lib/catalog/catalog"

export const metadata: Metadata = {
  title: "كل المنتجات",
  description: `تصفّح كل منتجات ${siteConfig.name}، وفلترها حسب الفئة والسعر والمقاس واللون، والدفع عند الاستلام.`,
  alternates: { canonical: "/products/" },
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
