import "server-only"

import { existsSync } from "node:fs"
import path from "node:path"

import { categories as categoryData } from "@/data/categories"
import { products as productData } from "@/data/products"
import { IMAGE_WIDTHS, imageFile } from "@/lib/image-loader"

import { storeToday } from "./dates"
import { discountPercent, toMinorUnits } from "./money"
import { getOptionGroups } from "./options"
import type { ParsedCategory, ParsedProduct } from "./schema"
import type { Category, CategoryLink, Product, Variant } from "./types"
import { validateCatalogData } from "./validate"

/**
 * يبني الكتالوج مرة واحدة وقت البناء من ملفات src/data بعد التحقق منها:
 * الأسعار بأصغر وحدة، ومسار كل فئة، وعدد منتجاتها، وقوائم مرتبة جاهزة.
 * لا يصل هذا الملف ولا ملفات البيانات الكاملة إلى متصفح الزائر.
 */

const byPopularity = (a: Product, b: Product) => b.popularity - a.popularity
const byNewest = (a: Product, b: Product) =>
  b.createdAt.localeCompare(a.createdAt)

function toProduct(
  input: ParsedProduct,
  pathOf: (slug: string) => CategoryLink[],
  today: string
): Product {
  // عرض انتهى قبل يوم البناء: يعود كل متغير إلى سعره قبل الخصم.
  // لذلك يُعاد بناء الموقع بعد انتهاء أي عرض حتى تتحدث أسعاره.
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
    })),
    variants,
    optionGroups: getOptionGroups(variants),
    price: cheapest.price,
    // خصم يقل عن 1% لا يُعرض كخصم
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
  pathOf: (slug: string) => CategoryLink[]
): Category[] {
  const children = new Map<string, string[]>()
  for (const category of parsed) {
    if (!category.parent) continue
    children.set(category.parent, [
      ...(children.get(category.parent) ?? []),
      category.slug,
    ])
  }
  // المنتج يُحسب في فئته وكل فئاتها الأم
  const counts = new Map<string, number>()
  for (const product of products) {
    for (const link of product.categoryPath) {
      counts.set(link.slug, (counts.get(link.slug) ?? 0) + 1)
    }
  }

  return parsed.map((category) => ({
    slug: category.slug,
    name: category.name,
    description: category.description || null,
    image: category.image ?? null,
    parentSlug: category.parent ?? null,
    childSlugs: children.get(category.slug) ?? [],
    path: pathOf(category.slug),
    productCount: counts.get(category.slug) ?? 0,
  }))
}

/** في البناء النهائي: كل صورة في البيانات يجب أن تكون مجهزة في public/images. */
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
    check(category.image, `الفئة "${category.slug}"`)
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
  const products = parsed.products
    .filter((product) => !product.hidden)
    .map((input) => toProduct(input, pathOf, today))
  const categories = toCategories(parsed.categories, products, pathOf)
  assertImagesExist(products, categories)

  return {
    categories,
    categoryBySlug: new Map(categories.map((c) => [c.slug, c])),
    products,
    productBySlug: new Map(products.map((p) => [p.slug, p])),
    /** المنتجات من الأكثر مبيعاً، تُرتب مرة واحدة لكل الصفحات */
    byPopularity: [...products].sort(byPopularity),
    /** المنتجات من الأحدث */
    byNewest: [...products].sort(byNewest),
  }
}

export const catalog = buildCatalog()
