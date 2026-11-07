import { getOptionGroups } from "@/lib/catalog/options"
import type {
  CatalogRows,
  CategoryRow,
  ProductImageRow,
  ProductRow,
} from "@/lib/catalog/rows"
import type {
  Category,
  CategoryLink,
  CoverPhoto,
  PhotoLook,
  Product,
  Variant,
} from "@/lib/catalog/types"
import { discountPercent } from "@/lib/money"
import { BRAND_TONE, toneFromHex } from "@/lib/tone"

/**
 * Builds the catalog the pages read from its rows (the database's, or the src/data files' in the unit
 * tests): each category's path and product count, the prices of deals that have ended, the look of
 * every photo, and ready-sorted lists. Pure: the same rows and day give the same catalog.
 */

const byPopularity = (a: Product, b: Product) => b.popularity - a.popularity
const byNewest = (a: Product, b: Product) =>
  b.createdAt.localeCompare(a.createdAt)

/** A photo's look: the tone stored with it, or the store's blue for a photo without a clear color. */
function photoLook(image: Pick<ProductImageRow, "tone" | "cutout">): PhotoLook {
  return {
    tone: (image.tone ? toneFromHex(image.tone) : null) ?? BRAND_TONE,
    cutout: image.cutout,
  }
}

/**
 * One product as the pages show it on the given day. The orders build their products the same way
 * from the database (src/lib/checkout/orders.ts), so a deal that has ended is priced alike everywhere.
 */
export function productFromRow(
  row: ProductRow,
  today: string,
  pathOf: (slug: string) => CategoryLink[] = () => []
): Product {
  // A deal whose last day has passed: every variant goes back to its price before the discount
  const expired = row.saleEndsAt !== null && row.saleEndsAt < today

  const variants: Variant[] = row.variants.map((variant) => ({
    sku: variant.sku,
    options: variant.options,
    price:
      expired && variant.compareAtPrice !== null
        ? variant.compareAtPrice
        : variant.price,
    compareAtPrice: expired ? null : variant.compareAtPrice,
    stock: variant.stock,
  }))
  const cheapest = variants.reduce((min, v) => (v.price < min.price ? v : min))

  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    specs: row.specs,
    categoryPath: pathOf(row.categorySlug),
    images: row.images.map((image) => ({
      src: image.src,
      alt:
        image.alt ??
        (image.color ? `${row.name}، اللون ${image.color}` : row.name),
      color: image.color,
      ...photoLook(image),
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
    popularity: row.popularity,
    createdAt: row.createdAt,
    saleEndsAt: expired ? null : row.saleEndsAt,
  }
}

function toCategories(
  rows: CategoryRow[],
  products: Product[],
  pathOf: (slug: string) => CategoryLink[]
): Category[] {
  const children = new Map<string, string[]>()
  for (const category of rows) {
    if (!category.parentSlug) continue
    children.set(category.parentSlug, [
      ...(children.get(category.parentSlug) ?? []),
      category.slug,
    ])
  }
  // A product counts in its category and in all of that category's parents
  const counts = new Map<string, number>()
  // The first photo of the most popular product in each category and its parents, the default cover
  const covers = new Map<string, CoverPhoto>()
  // Every product photo with its look, so a cover set to one of them keeps that photo's tone
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

  return rows.map((category) => ({
    slug: category.slug,
    name: category.name,
    description: category.description,
    image: category.imageSrc
      ? (productPhotos.get(category.imageSrc) ?? {
          src: category.imageSrc,
          ...photoLook({ tone: null, cutout: false }),
        })
      : (covers.get(category.slug) ?? null),
    parentSlug: category.parentSlug,
    childSlugs: children.get(category.slug) ?? [],
    path: pathOf(category.slug),
    productCount: counts.get(category.slug) ?? 0,
  }))
}

/**
 * The catalog for the given day (2026-11-07, in the store's time zone), which decides the deals that
 * have ended. Hidden products are left out: no page, list or file shows them.
 */
export function buildCatalog(rows: CatalogRows, today: string) {
  const categoryRows = [...rows.categories].sort(
    (a, b) => a.position - b.position
  )
  const bySlug = new Map(categoryRows.map((c) => [c.slug, c]))
  const pathOf = (slug: string): CategoryLink[] => {
    const links: CategoryLink[] = []
    let current = bySlug.get(slug)
    while (current) {
      links.unshift({ slug: current.slug, name: current.name })
      current = current.parentSlug ? bySlug.get(current.parentSlug) : undefined
    }
    return links
  }

  const products = rows.products
    .filter((row) => !row.hidden)
    .sort((a, b) => a.position - b.position)
    .map((row) => productFromRow(row, today, pathOf))
  const categories = toCategories(categoryRows, products, pathOf)

  return {
    categories,
    categoryBySlug: new Map(categories.map((c) => [c.slug, c])),
    products,
    productBySlug: new Map(products.map((p) => [p.slug, p])),
    /** Products from best selling down */
    byPopularity: [...products].sort(byPopularity),
    /** Products from newest */
    byNewest: [...products].sort(byNewest),
  }
}

export type Catalog = ReturnType<typeof buildCatalog>
