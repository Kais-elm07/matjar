import type { Metadata } from "next"
import Link from "next/link"

import { AdminProductItem } from "@/components/admin/admin-product-item"
import { buttonVariants } from "@/components/ui/button"
import { adminProducts } from "@/lib/admin/catalog"
import { verifyAdmin } from "@/lib/admin/session"
import { PRODUCT_FORMS, pluralize } from "@/lib/arabic-plural"
import { adminPaths } from "@/lib/routes"

export const metadata: Metadata = { title: "المنتجات" }

// Reads the database on every request, hidden products included
export const dynamic = "force-dynamic"

export default async function AdminProductsPage() {
  await verifyAdmin()
  const products = await adminProducts()
  const hidden = products.filter((product) => product.hidden).length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">المنتجات</h1>
          <p className="text-sm text-muted-foreground">
            {pluralize(products.length, PRODUCT_FORMS)}
            {hidden > 0 && `، المخفي منها عن الزوار: ${hidden}`}
          </p>
        </div>
        <Link
          href={adminPaths.newProduct}
          className={buttonVariants({ variant: "cta", size: "xl" })}
        >
          إضافة منتج
        </Link>
      </div>
      <ul className="space-y-3">
        {products.map((product) => (
          <AdminProductItem key={product.id} product={product} />
        ))}
      </ul>
    </div>
  )
}
