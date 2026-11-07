import type { Metadata } from "next"

import { CategoryForm } from "@/components/admin/category-form"
import { adminCategories } from "@/lib/admin/catalog"
import { emptyCategoryForm } from "@/lib/admin/category-form"
import { categoryOptions } from "@/lib/admin/category-options"
import { verifyAdmin } from "@/lib/admin/session"
import { PRODUCT_FORMS, pluralize } from "@/lib/arabic-plural"

export const metadata: Metadata = { title: "الفئات" }

// Reads the categories from the database on every request
export const dynamic = "force-dynamic"

export default async function AdminCategoriesPage() {
  await verifyAdmin()
  const categories = await adminCategories()
  const options = categoryOptions(categories)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold md:text-3xl">الفئات</h1>
      <CategoryForm
        original={null}
        initial={emptyCategoryForm}
        parents={options}
        title="إضافة فئة"
      />
      <ul className="space-y-3">
        {categories.map((category) => (
          <li key={category.slug}>
            <CategoryForm
              original={category.slug}
              initial={{
                slug: category.slug,
                name: category.name,
                description: category.description,
                imageSrc: category.imageSrc,
                parent: category.parent,
              }}
              parents={options.filter(
                (option) => option.slug !== category.slug
              )}
              title={`${category.name} (${pluralize(category.products, PRODUCT_FORMS)})`}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
