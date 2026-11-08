import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProductForm } from "@/components/admin/product-form"
import { adminCategories, adminProductForm } from "@/lib/admin/catalog"
import { categoryOptions } from "@/lib/admin/category-options"
import { verifyAdmin } from "@/lib/admin/session"
import { isUploadEnabled } from "@/lib/admin/uploads"

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
