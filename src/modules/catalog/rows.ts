import type { ParsedCategory, ParsedProduct } from "@/modules/catalog/schema"
import type { ImageMeta } from "@/modules/catalog/types"
import { optionsKey } from "@/modules/catalog/variant-key"
import { toMinorUnits } from "@/lib/money"

/**
 * The catalog as the database's tables keep it (prisma/schema.prisma): plain values only, prices in
 * halalas, dates as 2026-10-30, and each category and product pointing to the others by slug.
 * pnpm db:seed (prisma/seed.ts) turns the src/data files into these rows and writes them.
 */

export interface CategoryRow {
  slug: string
  name: string
  description: string | null
  /** The cover photo's path, or null for the photo of the category's most popular product */
  imageSrc: string | null
  parentSlug: string | null
  position: number
}

export interface ProductImageRow {
  position: number
  src: string
  /** null builds it from the product's name and the photo's color */
  alt: string | null
  /** The color option the photo shows */
  color: string | null
  /** The light behind the photo, such as #c2410c, or null for the store's blue */
  tone: string | null
  cutout: boolean
}

export interface VariantRow {
  sku: string
  options: Record<string, string>
  optionsKey: string
  price: number
  compareAtPrice: number | null
  stock: number
  position: number
}

export interface ProductRow {
  slug: string
  name: string
  categorySlug: string
  description: string
  specs: { label: string; value: string }[]
  popularity: number
  createdAt: string
  saleEndsAt: string | null
  hidden: boolean
  position: number
  images: ProductImageRow[]
  variants: VariantRow[]
}

/** The whole catalog as rows: what the server caches (src/modules/catalog/load.ts) and the seed writes. */
export interface CatalogRows {
  categories: CategoryRow[]
  products: ProductRow[]
}

export function categoryRows(categories: ParsedCategory[]): CategoryRow[] {
  return categories.map((category, position) => ({
    slug: category.slug,
    name: category.name,
    description: category.description || null,
    imageSrc: category.image ?? null,
    parentSlug: category.parent ?? null,
    position,
  }))
}

/**
 * The products with their photos and variants. Each photo keeps the tone the data sets for it, or else
 * the color pnpm images measured in it (public/images/image-meta.json), so the database holds what the
 * page needs and the server never reads that file. Prices stay as written: a deal that has ended is
 * priced when the catalog is read, not here.
 */
export function productRows(
  products: ParsedProduct[],
  meta: ImageMeta
): ProductRow[] {
  return products.map((product, position) => ({
    slug: product.slug,
    name: product.name,
    categorySlug: product.category,
    description: product.description,
    specs: product.specs,
    popularity: product.popularity,
    createdAt: product.createdAt,
    saleEndsAt: product.saleEndsAt ?? null,
    hidden: product.hidden,
    position,
    images: product.images.map((image, index) => ({
      position: index,
      src: image.src,
      alt: image.alt ?? null,
      color: image.color ?? null,
      tone: image.tone ?? meta[image.src]?.color ?? null,
      cutout: meta[image.src]?.cutout ?? false,
    })),
    variants: product.variants.map((variant, index) => ({
      sku: variant.sku,
      options: variant.options,
      optionsKey: optionsKey(variant.options),
      price: toMinorUnits(variant.price),
      compareAtPrice:
        variant.compareAtPrice === undefined
          ? null
          : toMinorUnits(variant.compareAtPrice),
      stock: variant.stock,
      position: index,
    })),
  }))
}
