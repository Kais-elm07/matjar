/**
 * Fills the catalog tables (categories, products, their photos and variants) from the src/data files.
 *
 *   pnpm db:seed           only when the database has no products yet; otherwise it changes nothing,
 *                          so it never overwrites what the store owner changed
 *   pnpm db:seed --force   writes the src/data products over the ones with the same slug (for the
 *                          local database and the tests); products that are not in src/data stay
 *
 * The data is validated first with the same rules as the build (src/lib/catalog/validate.ts), and each
 * photo takes its measured color from public/images/image-meta.json, which pnpm images writes (the
 * db:seed script runs it first). Everything is written in one transaction: all or nothing.
 * The messages are in Arabic, for the store owner.
 */
import "dotenv/config"

import { PrismaPg } from "@prisma/adapter-pg"

import { PrismaClient } from "@/generated/prisma/client"
import { pluralize, PRODUCT_FORMS, type PluralForms } from "@/lib/arabic-plural"
import { fileRows } from "@/lib/catalog/file-rows"
import { readImageMeta } from "@/lib/catalog/image-meta"

/** A date column (@db.Date) from 2026-10-30 */
const day = (value: string) => new Date(`${value}T00:00:00Z`)

const CATEGORY_FORMS: PluralForms = {
  zero: "لا فئات",
  one: "فئة واحدة",
  two: "فئتان",
  few: "{n} فئات",
  many: "{n} فئة",
  other: "{n} فئة",
}

const VARIANT_FORMS: PluralForms = {
  zero: "لا متغيرات",
  one: "متغير واحد",
  two: "متغيران",
  few: "{n} متغيرات",
  many: "{n} متغيراً",
  other: "{n} متغير",
}

async function main() {
  const force = process.argv.includes("--force")
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL غير معرّف. انسخ الملف .env.example إلى .env، ثم شغّل pnpm db:start."
    )
  }

  const { categories: categoryList, products: productList } =
    fileRows(readImageMeta())

  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  })
  try {
    const existing = await db.product.count()
    if (existing > 0 && !force) {
      console.log(
        `في قاعدة البيانات ${pluralize(existing, PRODUCT_FORMS)}، فلم يتغير شيء. لكتابة منتجات src/data فوقها: pnpm db:seed --force`
      )
      return
    }

    await db.$transaction(
      async (tx) => {
        const categoryIds = new Map<string, number>()
        for (const category of categoryList) {
          const fields = {
            name: category.name,
            description: category.description,
            imageSrc: category.imageSrc,
            position: category.position,
          }
          const { id } = await tx.category.upsert({
            where: { slug: category.slug },
            create: { slug: category.slug, ...fields },
            update: fields,
          })
          categoryIds.set(category.slug, id)
        }
        // The parents once every category has an id
        for (const category of categoryList) {
          await tx.category.update({
            where: { slug: category.slug },
            data: {
              parentId: category.parentSlug
                ? categoryIds.get(category.parentSlug)
                : null,
            },
          })
        }

        for (const product of productList) {
          const categoryId = categoryIds.get(product.categorySlug)
          if (categoryId === undefined) {
            throw new Error(
              `المنتج "${product.slug}": الفئة "${product.categorySlug}" غير موجودة.`
            )
          }
          const fields = {
            name: product.name,
            categoryId,
            description: product.description,
            specs: product.specs,
            popularity: product.popularity,
            createdAt: day(product.createdAt),
            saleEndsAt: product.saleEndsAt ? day(product.saleEndsAt) : null,
            hidden: product.hidden,
            position: product.position,
          }
          const { id } = await tx.product.upsert({
            where: { slug: product.slug },
            create: { slug: product.slug, ...fields },
            update: fields,
          })
          // The photos and variants are written again in full. Nothing points to their ids: an order
          // line keeps the SKU, the name and the price as they were.
          await tx.productImage.deleteMany({ where: { productId: id } })
          await tx.variant.deleteMany({ where: { productId: id } })
          await tx.productImage.createMany({
            data: product.images.map((image) => ({ productId: id, ...image })),
          })
          await tx.variant.createMany({
            data: product.variants.map((variant) => ({
              productId: id,
              ...variant,
            })),
          })
        }
      },
      // Far from the database (the Netlify build reaches Supabase across the world), each statement
      // takes a fraction of a second, so the transaction gets two minutes instead of five seconds
      { maxWait: 30_000, timeout: 120_000 }
    )

    const variants = productList.reduce(
      (sum, product) => sum + product.variants.length,
      0
    )
    console.log(
      `كُتب في قاعدة البيانات: ${pluralize(categoryList.length, CATEGORY_FORMS)}، و${pluralize(productList.length, PRODUCT_FORMS)}، و${pluralize(variants, VARIANT_FORMS)}.`
    )
  } finally {
    await db.$disconnect()
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
