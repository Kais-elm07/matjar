import { siteConfig } from "@/config/site"
import { isColorOption } from "@/modules/catalog/options"
import {
  categorySchema,
  productSchema,
  type ParsedCategory,
  type ParsedProduct,
} from "@/modules/catalog/schema"
import { optionsKey } from "@/modules/catalog/variant-key"
import { UTC_OFFSET_PATTERN } from "@/lib/dates"
import { isRecord } from "@/lib/guards"
import type { z } from "@/lib/zod"

/**
 * Checks the categories and products files together, beyond the rules for each field in schema.ts,
 * and gathers every problem into one Arabic message that points the store owner to the product and
 * the field. Any problem stops the build, so a store with broken data is never published.
 */

/** The field path as the store owner understands it: variants[2].price (counting from 1, not 0). */
function fieldPath(path: PropertyKey[]) {
  if (path.length === 0) return "البيانات"
  return path
    .map((part, index) =>
      typeof part === "number"
        ? `[${part + 1}]`
        : `${index === 0 ? "" : "."}${String(part)}`
    )
    .join("")
}

/** The items of a data file that follow the schema, and a message for every problem in the others. */
function parseList<T>(
  schema: z.ZodType<T>,
  items: unknown[],
  label: (item: unknown, index: number) => string
) {
  const parsed: T[] = []
  const problems: string[] = []
  items.forEach((item, index) => {
    const result = schema.safeParse(item)
    if (result.success) {
      parsed.push(result.data)
      return
    }
    for (const issue of result.error.issues) {
      problems.push(
        `${label(item, index)}، الحقل ${fieldPath(issue.path)}: ${issue.message}`
      )
    }
  })
  return { parsed, problems }
}

const slugOf = (item: unknown, index: number) =>
  isRecord(item) && typeof item.slug === "string"
    ? item.slug
    : `رقم ${index + 1}`

/** The store's time zone in src/config/site.ts, which decides the day a deal ends. */
function checkSiteSettings() {
  return UTC_OFFSET_PATTERN.test(siteConfig.utcOffset)
    ? []
    : [
        `فرق التوقيت utcOffset في src/config/site.ts يجب أن يكون بصيغة +03:00، والمكتوب "${siteConfig.utcOffset}".`,
      ]
}

/** Categories that repeat a slug, name a parent that does not exist, or are their own parent. */
function checkCategories(categories: ParsedCategory[]) {
  const problems: string[] = []
  const slugs = new Set<string>()
  for (const category of categories) {
    if (slugs.has(category.slug)) {
      problems.push(`رابط الفئة "${category.slug}" مكرر.`)
    }
    slugs.add(category.slug)
  }

  const parents = new Map(categories.map((c) => [c.slug, c.parent]))
  for (const category of categories) {
    if (!category.parent) continue
    if (!slugs.has(category.parent)) {
      problems.push(
        `الفئة "${category.slug}": الفئة الأم "${category.parent}" غير موجودة.`
      )
      continue
    }
    // Prevent cycles: a category that is its own parent, directly or indirectly
    const seen = new Set([category.slug])
    let current: string | undefined = category.parent
    while (current) {
      if (seen.has(current)) {
        problems.push(`الفئة "${category.slug}": تسلسل الفئات الأم دائري.`)
        break
      }
      seen.add(current)
      current = parents.get(current)
    }
  }
  return problems
}

/**
 * One product's variants, image colors and deal end date. `skus` holds every SKU seen so far with
 * its product's slug, so a SKU used by two products is caught.
 */
function checkProduct(product: ParsedProduct, skus: Map<string, string>) {
  const problems: string[] = []
  const where = `المنتج "${product.slug}"`

  const optionNames = Object.keys(product.variants[0].options).sort().join("|")
  const combinations = new Set<string>()
  for (const variant of product.variants) {
    const owner = skus.get(variant.sku)
    if (owner) {
      problems.push(
        `${where}: رمز المتغير "${variant.sku}" مستخدم أيضاً في "${owner}".`
      )
    }
    skus.set(variant.sku, product.slug)
    if (Object.keys(variant.options).sort().join("|") !== optionNames) {
      problems.push(
        `${where}: المتغير "${variant.sku}" له أسماء خيارات مختلفة عن باقي المتغيرات.`
      )
    }
    // Two variants with the same options: the second can never be chosen
    const combination = optionsKey(variant.options)
    if (combinations.has(combination)) {
      problems.push(
        `${where}: المتغير "${variant.sku}" يكرر خيارات متغير آخر (${Object.values(variant.options).join(" / ") || "دون خيارات"}).`
      )
    }
    combinations.add(combination)
  }

  const colorName = Object.keys(product.variants[0].options).find(isColorOption)
  const colorValues = new Set(
    product.variants.map((v) => (colorName ? v.options[colorName] : ""))
  )
  for (const image of product.images) {
    if (!image.color) continue
    if (!colorName) {
      problems.push(
        `${where}: للصورة لون "${image.color}" لكن المنتج ليس له خيار لون.`
      )
    } else if (!colorValues.has(image.color)) {
      problems.push(
        `${where}: لون الصورة "${image.color}" غير موجود في ألوان المتغيرات.`
      )
    }
  }

  if (
    product.saleEndsAt &&
    !product.variants.some((variant) => variant.compareAtPrice !== undefined)
  ) {
    problems.push(
      `${where}: تاريخ نهاية العرض يحتاج سعراً قبل الخصم في متغير واحد على الأقل.`
    )
  }
  return problems
}

/** The categories' checks (repeated slugs, missing parents, cycles), for a category saved from the admin panel. */
export function categoryProblems(categories: ParsedCategory[]) {
  return checkCategories(categories)
}

/**
 * One product's own checks (its options, image colors and deal), for a product saved from the admin
 * panel; the database then refuses a slug or a SKU that another product already has.
 */
export function productProblems(product: ParsedProduct) {
  return checkProduct(product, new Map())
}

/** Products that repeat a slug or name a category that does not exist, then each product's own checks. */
function checkProducts(products: ParsedProduct[], categorySlugs: Set<string>) {
  const problems: string[] = []
  const slugs = new Set<string>()
  const skus = new Map<string, string>()
  for (const product of products) {
    if (slugs.has(product.slug)) {
      problems.push(`رابط المنتج "${product.slug}" مكرر.`)
    }
    slugs.add(product.slug)
    if (!categorySlugs.has(product.category)) {
      problems.push(
        `المنتج "${product.slug}": الفئة "${product.category}" غير موجودة.`
      )
    }
    problems.push(...checkProduct(product, skus))
  }
  return problems
}

/** Validates the categories and products files together, and returns their parsed data. */
export function validateCatalogData(
  categoryData: unknown[],
  productData: unknown[]
) {
  const categories = parseList<ParsedCategory>(
    categorySchema,
    categoryData,
    (item, i) => `الفئة "${slugOf(item, i)}"`
  )
  const products = parseList<ParsedProduct>(
    productSchema,
    productData,
    (item, i) => `المنتج "${slugOf(item, i)}"`
  )
  const categorySlugs = new Set(
    categories.parsed.map((category) => category.slug)
  )

  const problems = [
    ...categories.problems,
    ...products.problems,
    ...checkSiteSettings(),
    ...checkCategories(categories.parsed),
    ...checkProducts(products.parsed, categorySlugs),
  ]
  if (problems.length > 0) {
    throw new Error(
      `ملفات بيانات المتجر فيها ${problems.length} مشكلة يجب إصلاحها:\n- ${problems.join("\n- ")}`
    )
  }

  return { categories: categories.parsed, products: products.parsed }
}
