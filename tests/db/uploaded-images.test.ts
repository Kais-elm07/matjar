import { afterAll, describe, expect, it } from "vitest"

import { writeProduct } from "@/lib/admin/catalog"
import { productSchema } from "@/lib/catalog/schema"
import { getDb } from "@/lib/db"

/**
 * Saving a product from the admin panel against the real database (pnpm test:db): a photo uploaded in
 * the panel takes the look measured when it was uploaded (the uploaded_images table), and a photo the
 * database doesn't know takes none, so the store gives it its blue. The product is saved hidden, so
 * the store never shows it, and is removed with the uploaded photo's row at the end.
 */

const db = getDb()
const stamp = Date.now()
const SRC = `https://project.supabase.co/storage/v1/object/public/product-images/products/db-test-${stamp}`
const UNKNOWN = "/images/products/no-such-photo"
const SLUG = `db-upload-test-${stamp}`

afterAll(async () => {
  await db.product.deleteMany({ where: { slug: SLUG } })
  await db.uploadedImage.deleteMany({ where: { src: SRC } })
})

describe("saving a product with an uploaded photo", () => {
  it("gives the photo the tone and cut-out measured when it was uploaded", async () => {
    await db.uploadedImage.create({
      data: { src: SRC, tone: "#c2410c", cutout: true },
    })
    const category = await db.category.findFirstOrThrow({
      orderBy: { position: "asc" },
    })
    const product = productSchema.parse({
      slug: SLUG,
      name: "اختبار الصورة المرفوعة",
      category: category.slug,
      createdAt: "2026-11-08",
      hidden: true,
      images: [{ src: SRC }, { src: UNKNOWN }],
      variants: [{ sku: `DB-UPLOAD-${stamp}`, price: 10, stock: 1 }],
    })

    const id = await writeProduct(null, product)

    const images = await db.productImage.findMany({
      where: { productId: id },
      orderBy: { position: "asc" },
    })
    expect(
      images.map(({ src, tone, cutout }) => ({ src, tone, cutout }))
    ).toEqual([
      { src: SRC, tone: "#c2410c", cutout: true },
      { src: UNKNOWN, tone: null, cutout: false },
    ])
  })
})
