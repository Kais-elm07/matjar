import "server-only"

import { unstable_cache } from "next/cache"
import { PHASE_PRODUCTION_BUILD } from "next/constants"
import { randomUUID } from "node:crypto"
import { existsSync } from "node:fs"
import path from "node:path"
import { cache } from "react"

import { buildCatalog, type Catalog } from "@/lib/catalog/build"
import { isSpecs, isVariantOptions } from "@/lib/catalog/guards"
import type { CatalogRows, ProductRow } from "@/lib/catalog/rows"
import { storeToday } from "@/lib/dates"
import { getDb } from "@/lib/db"
import { IMAGE_WIDTHS, imageFile } from "@/lib/image-loader"

/**
 * The catalog from the database, without asking the database on every visit.
 *
 * The rows are read in one go and kept in Next.js's data cache under the tag "catalog". A page built
 * from them is kept too, with the same tag: visitors get the saved page, and the database is asked
 * again only after revalidateTag("catalog", "max") (a change from the admin panel, an order that lowers
 * the stock) or after a day, so deals that end reprice by themselves. If the database is down when a
 * page is refreshed, the last saved page keeps being served.
 *
 * The cache keeps JSON, so it holds the plain rows; the catalog, with its Maps, is built after reading
 * them, once per cached copy and day.
 */

const CATALOG_TAG = "catalog"

/** One day, in seconds */
const REFRESH_EVERY = 86_400

const day = (date: Date) => date.toISOString().slice(0, 10)

async function readRows(): Promise<CatalogRows & { version: string }> {
  const db = getDb()
  const [categories, products] = await Promise.all([
    db.category.findMany({
      orderBy: { position: "asc" },
      include: { parent: { select: { slug: true } } },
    }),
    db.product.findMany({
      where: { hidden: false },
      orderBy: { position: "asc" },
      include: {
        category: { select: { slug: true } },
        images: { orderBy: { position: "asc" } },
        variants: { orderBy: { position: "asc" } },
      },
    }),
  ])

  return {
    // Changes with every read from the database, so the catalog is rebuilt only for a new copy
    version: randomUUID(),
    categories: categories.map((category) => ({
      slug: category.slug,
      name: category.name,
      description: category.description,
      imageSrc: category.imageSrc,
      parentSlug: category.parent?.slug ?? null,
      position: category.position,
    })),
    products: products.map((product): ProductRow => ({
      slug: product.slug,
      name: product.name,
      categorySlug: product.category.slug,
      description: product.description,
      specs: isSpecs(product.specs) ? product.specs : [],
      popularity: product.popularity,
      createdAt: day(product.createdAt),
      saleEndsAt: product.saleEndsAt ? day(product.saleEndsAt) : null,
      hidden: product.hidden,
      position: product.position,
      images: product.images.map((image) => ({
        position: image.position,
        src: image.src,
        alt: image.alt,
        color: image.color,
        tone: image.tone,
        cutout: image.cutout,
      })),
      variants: product.variants.map((variant) => ({
        sku: variant.sku,
        options: isVariantOptions(variant.options) ? variant.options : {},
        optionsKey: variant.optionsKey,
        price: variant.price,
        compareAtPrice: variant.compareAtPrice,
        stock: variant.stock,
        position: variant.position,
      })),
    })),
  }
}

const loadRows = unstable_cache(readRows, ["catalog-rows"], {
  tags: [CATALOG_TAG],
  revalidate: REFRESH_EVERY,
})

/**
 * While the site is built (next build), every photo stored under /images must be prepared in
 * public/images. The running server never reads that folder, so the check is skipped there, and
 * turbopackIgnore keeps the whole folder out of the server's file tracing. Uploaded photos (https://)
 * live elsewhere.
 */
function assertImagesExist(catalog: Catalog) {
  if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) return
  const missing: string[] = []
  const check = (src: string | null, owner: string) => {
    if (!src || /^https?:\/\//.test(src)) return
    const file = path.join(
      process.cwd(),
      "public",
      imageFile(src, IMAGE_WIDTHS[0])
    )
    if (!existsSync(/* turbopackIgnore: true */ file))
      missing.push(`${owner}: الصورة "${src}"`)
  }
  for (const product of catalog.products) {
    for (const image of product.images) {
      check(image.src, `المنتج "${product.slug}"`)
    }
  }
  for (const category of catalog.categories) {
    check(category.image?.src ?? null, `الفئة "${category.slug}"`)
  }
  if (missing.length > 0) {
    throw new Error(
      `${missing.length} صورة غير موجودة. ضع الصورة الأصلية في assets/images بالاسم نفسه ثم شغّل pnpm images:\n- ${missing.join("\n- ")}`
    )
  }
}

let built: { key: string; catalog: Catalog } | undefined

/**
 * The catalog every page, file and API answer is built from. Read once per request (React's cache),
 * and built once per cached copy of the rows and per day.
 */
export const getCatalog = cache(async (): Promise<Catalog> => {
  const rows = await loadRows()
  const today = storeToday()
  const key = `${rows.version}|${today}`
  if (built?.key !== key) {
    const catalog = buildCatalog(rows, today)
    assertImagesExist(catalog)
    built = { key, catalog }
  }
  return built.catalog
})
