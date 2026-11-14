import type { Metadata } from "next"

import { ProductForm } from "@/modules/admin/components/product-form"
import { adminCategories } from "@/modules/admin/catalog"
import { categoryOptions } from "@/modules/admin/category-options"
import { emptyProductForm } from "@/modules/admin/product-form"
import { verifyAdmin } from "@/modules/admin/session"
import { isUploadEnabled } from "@/modules/admin/uploads"
import { storeToday } from "@/lib/dates"

export const metadata: Metadata = { title: "إضافة منتج" }

// Reads the categories from the database on every request
export const dynamic = "force-dynamic"

export default async function NewProductPage() {
  await verifyAdmin()
  const categories = await adminCategories()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold md:text-3xl">إضافة منتج</h1>
      <ProductForm
        id={null}
        initial={emptyProductForm(storeToday())}
        categories={categoryOptions(categories)}
        uploadEnabled={isUploadEnabled()}
      />
    </div>
  )
}
