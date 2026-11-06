import "server-only"

import { existsSync } from "node:fs"
import path from "node:path"

import { categories as categoryData } from "@/data/categories"
import { products as productData } from "@/data/products"
import { photoLook, readImageMeta } from "@/lib/catalog/image-meta"
import { getOptionGroups } from "@/lib/catalog/options"
import type { ParsedCategory, ParsedProduct } from "@/lib/catalog/schema"
import type {
  Category,
  CategoryLink,
  CoverPhoto,
  ImageMeta,
  Product,
  Variant,
} from "@/lib/catalog/types"
import { validateCatalogData } from "@/lib/catalog/validate"
import { storeToday } from "@/lib/dates"
import { IMAGE_WIDTHS, imageFile } from "@/lib/image-loader"
import { discountPercent, toMinorUnits } from "@/lib/money"

/**
 * Builds the catalog once at build time from the src/data files, after validating them:
 * prices in the smallest unit, each category's path and product count, and ready-sorted lists.
 * Neither this file nor the full data files reach the visitor's browser.
 * The catalog is built when this module is first imported, so a mistake in the data throws there
 * and stops the build with its Arabic message.
 */

const byPopularity = (a: Product, b: Product) => b.popularity - a.popularity
const byNewest = (a: Product, b: Product) =>
  b.createdAt.localeCompare(a.createdAt)

function toProduct(
  input: ParsedProduct,
  pathOf: (slug: string) => CategoryLink[],
  meta: ImageMeta,
  today: string
): Product {
  // A sale that ended before the build day: every variant goes back to its price before discount.
  // That is why the site is rebuilt after any sale ends, so its prices update.
  const expired = input.saleEndsAt !== undefined && input.saleEndsAt < today

  const variants: Variant[] = input.variants.map((variant) => {
    const price =
      expired && variant.compareAtPrice !== undefined
        ? variant.compareAtPrice
        : variant.price
    const compareAtPrice = expired ? undefined : variant.compareAtPrice
    return {
      sku: variant.sku,
      options: variant.options,
      price: toMinorUnits(price),
      compareAtPrice:
        compareAtPrice === undefined ? null : toMinorUnits(compareAtPrice),
      stock: variant.stock,
    }
  })
  const cheapest = variants.reduce((min, v) => (v.price < min.price ? v : min))

  return {
    slug: input.slug,
    name: input.name,
    description: input.description,
    specs: input.specs,
    categoryPath: pathOf(input.category),
    images: input.images.map((image) => ({
      src: image.src,
      alt:
        image.alt ??
        (image.color ? `${input.name}، اللون ${image.color}` : input.name),
      color: image.color ?? null,
      ...photoLook(meta, image.src, image.tone),
    })),
    variants,
    optionGroups: getOptionGroups(variants),
    price: cheapest.price,
    // A discount under 1% is not shown as a discount
    compareAtPrice: discountPercent(cheapest.price, cheapest.compareAtPrice)
      ? cheapest.compareAtPrice
      : null,
    maxPrice: Math.max(...variants.map((v) => v.price)),
    inStock: variants.some((v) => v.stock > 0),
    popularity: input.popularity,
    createdAt: input.createdAt,
    saleEndsAt: expired ? null : (input.saleEndsAt ?? null),
  }
}

function toCategories(
  parsed: ParsedCategory[],
  products: Product[],
  pathOf: (slug: string) => CategoryLink[],
  meta: ImageMeta
): Category[] {
  const children = new Map<string, string[]>()
  for (const category of parsed) {
    if (!category.parent) continue
    children.set(category.parent, [
      ...(children.get(category.parent) ?? []),
      category.slug,
    ])
  }
  // A product counts in its category and in all of that category's parents
  const counts = new Map<string, number>()
  // The first photo of the most popular product in each category and its parents, the default cover
  const covers = new Map<string, CoverPhoto>()
  // Every product photo with its look, so a cover set to one of them keeps the tone set for it
  const productPhotos = new Map<string, CoverPhoto>()
  for (const product of [...products].sort(byPopularity)) {
    for (const image of product.images) {
      productPhotos.set(image.src, {
        src: image.src,
        tone: image.tone,
        cutout: image.cutout,
      })
    }
    const [photo] = product.images
    for (const link of product.categoryPath) {
      counts.set(link.slug, (counts.get(link.slug) ?? 0) + 1)
      const cover = photo && productPhotos.get(photo.src)
      if (cover && !covers.has(link.slug)) covers.set(link.slug, cover)
    }
  }

  return parsed.map((category) => ({
    slug: category.slug,
    name: category.name,
    description: category.description || null,
    image: category.image
      ? (productPhotos.get(category.image) ?? {
          src: category.image,
          ...photoLook(meta, category.image),
        })
      : (covers.get(category.slug) ?? null),
    parentSlug: category.parent ?? null,
    childSlugs: children.get(category.slug) ?? [],
    path: pathOf(category.slug),
    productCount: counts.get(category.slug) ?? 0,
  }))
}

/** In the production build, every image in the data must be prepared in public/images. */
function assertImagesExist(products: Product[], categories: Category[]) {
  if (process.env.NODE_ENV !== "production") return
  const missing: string[] = []
  const check = (src: string | null, owner: string) => {
    if (!src || /^https?:\/\//.test(src)) return
    const file = path.join(
      process.cwd(),
      "public",
      imageFile(src, IMAGE_WIDTHS[0])
    )
    if (!existsSync(file)) missing.push(`${owner}: الصورة "${src}"`)
  }
  for (const product of products) {
    for (const image of product.images) {
      check(image.src, `المنتج "${product.slug}"`)
    }
  }
  for (const category of categories) {
    check(category.image?.src ?? null, `الفئة "${category.slug}"`)
  }
  if (missing.length > 0) {
    throw new Error(
      `${missing.length} صورة غير موجودة. ضع الصورة الأصلية في assets/images بالاسم نفسه ثم شغّل pnpm images:\n- ${missing.join("\n- ")}`
    )
  }
}

function buildCatalog() {
  const parsed = validateCatalogData(categoryData, productData)

  const bySlug = new Map(parsed.categories.map((c) => [c.slug, c]))
  const pathOf = (slug: string): CategoryLink[] => {
    const links: CategoryLink[] = []
    let current = bySlug.get(slug)
    while (current) {
      links.unshift({ slug: current.slug, name: current.name })
      current = current.parent ? bySlug.get(current.parent) : undefined
    }
    return links
  }

  const today = storeToday()
  const meta = readImageMeta()
  const products = parsed.products
    .filter((product) => !product.hidden)
    .map((input) => toProduct(input, pathOf, meta, today))
  const categories = toCategories(parsed.categories, products, pathOf, meta)
  assertImagesExist(products, categories)

  return {
    categories,
    categoryBySlug: new Map(categories.map((c) => [c.slug, c])),
    products,
    productBySlug: new Map(products.map((p) => [p.slug, p])),
    /** Products from best selling down, sorted once for all pages */
    byPopularity: [...products].sort(byPopularity),
    /** Products from newest */
    byNewest: [...products].sort(byNewest),
  }
}

export const catalog = buildCatalog()
