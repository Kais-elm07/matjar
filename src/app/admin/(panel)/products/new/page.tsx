import type { Metadata } from "next"

import { ProductForm } from "@/components/admin/product-form"
import { adminCategories } from "@/lib/admin/catalog"
import { categoryOptions } from "@/lib/admin/category-options"
import { emptyProductForm } from "@/lib/admin/product-form"
import { verifyAdmin } from "@/lib/admin/session"
import { isUploadEnabled } from "@/lib/admin/uploads"
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
