import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProductForm } from "@/modules/admin/components/product-form"
import { adminCategories, adminProductForm } from "@/modules/admin/catalog"
import { categoryOptions } from "@/modules/admin/category-options"
import { verifyAdmin } from "@/modules/admin/session"
import { isUploadEnabled } from "@/modules/admin/uploads"

export const metadata: Metadata = { title: "تعديل منتج" }

// Reads the product from the database on every request
export const dynamic = "force-dynamic"

export default async function EditProductPage({
  params,
}: PageProps<"/admin/products/[id]">) {
  await verifyAdmin()
  const id = Number((await params).id)
  if (!Number.isSafeInteger(id) || id <= 0) notFound()
  const [product, categories] = await Promise.all([
    adminProductForm(id),
    adminCategories(),
  ])
  if (!product) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold md:text-3xl">{product.name}</h1>
      <ProductForm
        id={id}
        initial={product}
        categories={categoryOptions(categories)}
        uploadEnabled={isUploadEnabled()}
      />
    </div>
  )
}
