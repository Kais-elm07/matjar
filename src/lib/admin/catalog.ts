import "server-only"

import { productFormFrom } from "@/lib/admin/product-form"
import { isSpecs, isVariantOptions } from "@/lib/catalog/guards"
import type { ParsedCategory, ParsedProduct } from "@/lib/catalog/schema"
import { optionsKey } from "@/lib/catalog/variant-key"
import { getDb } from "@/lib/db"
import { toMinorUnits } from "@/lib/money"

/**
 * The admin panel's reads and writes. They go to the database directly, not through the catalog's
 * cache, so the owner sees hidden products and every change at once. The Server Actions in
 * actions.ts check the session and the values before calling the writes.
 */

const day = (date: Date) => date.toISOString().slice(0, 10)
const dayColumn = (value: string) => new Date(`${value}T00:00:00Z`)

/** Every product for the list, hidden ones included, in the store's order. */
export async function adminProducts() {
  const products = await getDb().product.findMany({
    orderBy: { position: "asc" },
    include: {
      category: { select: { name: true } },
      images: { orderBy: { position: "asc" }, take: 1 },
      variants: { orderBy: { position: "asc" } },
    },
  })
  return products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category.name,
    hidden: product.hidden,
    image: product.images[0]?.src ?? null,
    variants: product.variants.map((variant) => ({
      sku: variant.sku,
      options: isVariantOptions(variant.options) ? variant.options : {},
      price: variant.price,
      stock: variant.stock,
    })),
  }))
}

/** One product in the form's fields, or null when there is no product with this id. */
export async function adminProductForm(id: number) {
  const product = await getDb().product.findUnique({
    where: { id },
    include: {
      category: { select: { slug: true } },
      images: { orderBy: { position: "asc" } },
      variants: { orderBy: { position: "asc" } },
    },
  })
  if (!product) return null
  return productFormFrom({
    ...product,
    category: product.category.slug,
    specs: isSpecs(product.specs) ? product.specs : [],
    createdAt: day(product.createdAt),
    saleEndsAt: product.saleEndsAt ? day(product.saleEndsAt) : null,
    variants: product.variants.map((variant) => ({
      ...variant,
      options: isVariantOptions(variant.options) ? variant.options : {},
    })),
  })
}

/** Every category with its parent's slug, in the store's order. */
export async function adminCategories() {
  const categories = await getDb().category.findMany({
    orderBy: { position: "asc" },
    include: {
      parent: { select: { slug: true } },
      _count: { select: { products: true } },
    },
  })
  return categories.map((category) => ({
    slug: category.slug,
    name: category.name,
    description: category.description ?? "",
    imageSrc: category.imageSrc ?? "",
    parent: category.parent?.slug ?? "",
    products: category._count.products,
  }))
}

/**
 * Problems that only the database can see: a slug or a SKU that another product already uses, or a
 * category that doesn't exist. Empty when the product can be saved.
 */
export async function productConflicts(
  id: number | null,
  product: ParsedProduct
) {
  const db = getDb()
  const others = id === null ? {} : { NOT: { id } }
  const [category, sameSlug, sameSkus] = await Promise.all([
    db.category.findUnique({ where: { slug: product.category } }),
    db.product.findFirst({ where: { slug: product.slug, ...others } }),
    db.variant.findMany({
      where: {
        sku: { in: product.variants.map((variant) => variant.sku) },
        product: others,
      },
      include: { product: { select: { name: true } } },
    }),
  ])
  const problems: string[] = []
  if (!category) problems.push(`الفئة "${product.category}" غير موجودة.`)
  if (sameSlug) {
    problems.push(
      `الرابط "${product.slug}" مستخدم للمنتج "${sameSlug.name}". اختر رابطاً آخر.`
    )
  }
  for (const variant of sameSkus) {
    problems.push(
      `الرمز "${variant.sku}" مستخدم في المنتج "${variant.product.name}". اختر رمزاً آخر.`
    )
  }
  return problems
}

/**
 * Saves a product from the form, new (id null) or edited, with its photos and variants written again.
 * A photo already used by another product keeps the tone and the cut-out measured for it; any other
 * photo takes the store's blue until it is uploaded through the panel. Returns the product's id.
 */
export async function writeProduct(id: number | null, product: ParsedProduct) {
  return getDb().$transaction(async (tx) => {
    const category = await tx.category.findUniqueOrThrow({
      where: { slug: product.category },
    })
    const fields = {
      slug: product.slug,
      name: product.name,
      categoryId: category.id,
      description: product.description,
      specs: product.specs,
      popularity: product.popularity,
      createdAt: dayColumn(product.createdAt),
      saleEndsAt: product.saleEndsAt ? dayColumn(product.saleEndsAt) : null,
      hidden: product.hidden,
    }
    let productId: number
    if (id === null) {
      const last = await tx.product.findFirst({
        orderBy: { position: "desc" },
        select: { position: true },
      })
      const created = await tx.product.create({
        data: { ...fields, position: (last?.position ?? -1) + 1 },
      })
      productId = created.id
    } else {
      await tx.product.update({ where: { id }, data: fields })
      productId = id
    }

    const known = await tx.productImage.findMany({
      where: { src: { in: product.images.map((image) => image.src) } },
      select: { src: true, tone: true, cutout: true },
    })
    const looks = new Map(known.map((image) => [image.src, image]))

    await tx.productImage.deleteMany({ where: { productId } })
    await tx.variant.deleteMany({ where: { productId } })
    await tx.productImage.createMany({
      data: product.images.map((image, position) => ({
        productId,
        position,
        src: image.src,
        alt: image.alt ?? null,
        color: image.color ?? null,
        tone: image.tone ?? looks.get(image.src)?.tone ?? null,
        cutout: looks.get(image.src)?.cutout ?? false,
      })),
    })
    await tx.variant.createMany({
      data: product.variants.map((variant, position) => ({
        productId,
        position,
        sku: variant.sku,
        options: variant.options,
        optionsKey: optionsKey(variant.options),
        price: toMinorUnits(variant.price),
        compareAtPrice:
          variant.compareAtPrice === undefined
            ? null
            : toMinorUnits(variant.compareAtPrice),
        stock: variant.stock,
      })),
    })
    return productId
  })
}

/** New stock counts for some variants, by SKU. */
export async function writeStocks(stocks: { sku: string; stock: number }[]) {
  await getDb().$transaction(
    stocks.map(({ sku, stock }) =>
      getDb().variant.update({ where: { sku }, data: { stock } })
    )
  )
}

/** Hides a product from the store, or shows it again. It is never deleted, because orders name it. */
export async function writeHidden(id: number, hidden: boolean) {
  await getDb().product.update({ where: { id }, data: { hidden } })
}

/** Every category in the shape of src/data/categories.ts, to check a change against the others. */
export async function parsedCategories(): Promise<ParsedCategory[]> {
  return (await adminCategories()).map((category) => ({
    slug: category.slug,
    name: category.name,
    description: category.description || undefined,
    image: category.imageSrc || undefined,
    parent: category.parent || undefined,
  }))
}

/** Saves a category, new (original null) or edited by its slug before the change. */
export async function writeCategory(
  original: string | null,
  category: ParsedCategory
) {
  const db = getDb()
  const parent = category.parent
    ? await db.category.findUniqueOrThrow({ where: { slug: category.parent } })
    : null
  const fields = {
    slug: category.slug,
    name: category.name,
    description: category.description || null,
    imageSrc: category.image ?? null,
    parentId: parent?.id ?? null,
  }
  if (original === null) {
    const last = await db.category.findFirst({
      orderBy: { position: "desc" },
      select: { position: true },
    })
    await db.category.create({
      data: { ...fields, position: (last?.position ?? -1) + 1 },
    })
  } else {
    await db.category.update({ where: { slug: original }, data: fields })
  }
}
