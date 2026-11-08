import Image from "next/image"
import Link from "next/link"

import {
  ADMIN_CARD,
  ADMIN_THUMB,
  ADMIN_THUMB_IMAGE,
} from "@/components/admin/admin-styles"
import { StockEditor } from "@/components/admin/stock-editor"
import { VisibilityButton } from "@/components/admin/visibility-button"
import { buttonVariants } from "@/components/ui/button"
import { formatOptions } from "@/lib/admin/product-form"
import { PIECE_FORMS, pluralize } from "@/lib/arabic-plural"
import { formatPrice } from "@/lib/money"
import { adminPaths, productPath } from "@/lib/routes"
import { cn } from "@/lib/utils"

interface AdminProductItemProps {
  product: {
    id: number
    slug: string
    name: string
    category: string
    hidden: boolean
    image: string | null
    variants: {
      sku: string
      options: Record<string, string>
      price: number
      stock: number
    }[]
  }
}

/** One product in the admin list: its photo, price range and stock, and what can be done with it. */
export function AdminProductItem({ product }: AdminProductItemProps) {
  const prices = product.variants.map((variant) => variant.price)
  const low = Math.min(...prices)
  const high = Math.max(...prices)
  const stock = product.variants.reduce((sum, v) => sum + v.stock, 0)

  return (
    <li className={cn(ADMIN_CARD, "space-y-4")}>
      <div className="flex flex-wrap items-center gap-4">
        <span className={ADMIN_THUMB}>
          {product.image && (
            <Image
              src={product.image}
              alt=""
              fill
              sizes="64px"
              className={ADMIN_THUMB_IMAGE}
            />
          )}
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="flex flex-wrap items-center gap-2 font-bold">
            <Link
              href={adminPaths.product(product.id)}
              className="hover:text-primary"
            >
              {product.name}
            </Link>
            {product.hidden && (
              <span className="rounded-full border px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
                مخفي
              </span>
            )}
          </h2>
          <p className="text-sm text-muted-foreground">
            {product.category} ·{" "}
            <span className="font-bold text-primary">
              {low === high
                ? formatPrice(low)
                : `${formatPrice(low)} - ${formatPrice(high)}`}
            </span>{" "}
            ·{" "}
            <span className={stock === 0 ? "text-destructive" : undefined}>
              {stock === 0 ? "نفد المخزون" : pluralize(stock, PIECE_FORMS)}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={adminPaths.product(product.id)}
            className={buttonVariants({ variant: "outline", size: "xl" })}
          >
            تعديل
          </Link>
          {!product.hidden && (
            <Link
              href={productPath(product.slug)}
              className={buttonVariants({ variant: "outline", size: "xl" })}
            >
              عرض
            </Link>
          )}
          <VisibilityButton
            id={product.id}
            name={product.name}
            hidden={product.hidden}
          />
        </div>
      </div>
      <details className="group">
        <summary className="inline-flex h-11 cursor-pointer items-center text-sm font-medium text-primary">
          تعديل المخزون
        </summary>
        <div className="pt-3">
          <StockEditor
            variants={product.variants.map((variant) => ({
              sku: variant.sku,
              label: formatOptions(variant.options) || variant.sku,
              stock: variant.stock,
            }))}
          />
        </div>
      </details>
    </li>
  )
}
