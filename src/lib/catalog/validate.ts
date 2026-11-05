import type { z } from "zod"

import { siteConfig } from "@/config/site"
import { isRecord } from "@/lib/guards"

import { UTC_OFFSET_PATTERN } from "./dates"
import { isColorOption } from "./options"
import {
  categorySchema,
  productSchema,
  type ParsedCategory,
  type ParsedProduct,
} from "./schema"
import { optionsKey } from "./variant-key"

/** مسار الحقل كما يفهمه صاحب المتجر: variants[2].price (العدّ من 1 لا من 0). */
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

/**
 * يتحقق من ملفي الفئات والمنتجات معاً، ويجمع كل الأخطاء في رسالة عربية واحدة
 * تدل صاحب المتجر على المنتج والحقل. أي خطأ يوقف البناء، فلا يُنشر متجر ببيانات معطوبة.
 */
export function validateCatalogData(
  categoryData: unknown[],
  productData: unknown[]
) {
  const problems: string[] = []

  function parseList<T>(
    schema: z.ZodType<T>,
    items: unknown[],
    label: (item: unknown, index: number) => string
  ) {
    const parsed: T[] = []
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
    return parsed
  }

  const slugOf = (item: unknown, index: number) =>
    isRecord(item) && typeof item.slug === "string"
      ? item.slug
      : `رقم ${index + 1}`

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

  if (!UTC_OFFSET_PATTERN.test(siteConfig.utcOffset)) {
    problems.push(
      `فرق التوقيت utcOffset في src/config/site.ts يجب أن يكون بصيغة +03:00، والمكتوب "${siteConfig.utcOffset}".`
    )
  }

  // فحوص تربط الفئات ببعضها
  const categorySlugs = new Set<string>()
  for (const category of categories) {
    if (categorySlugs.has(category.slug)) {
      problems.push(`رابط الفئة "${category.slug}" مكرر.`)
    }
    categorySlugs.add(category.slug)
  }

  const parents = new Map(categories.map((c) => [c.slug, c.parent]))
  for (const category of categories) {
    if (!category.parent) continue
    if (!categorySlugs.has(category.parent)) {
      problems.push(
        `الفئة "${category.slug}": الفئة الأم "${category.parent}" غير موجودة.`
      )
      continue
    }
    // منع الحلقات: فئة أم لنفسها بشكل مباشر أو غير مباشر
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

  // فحوص تربط المنتجات بالفئات وببعضها
  const productSlugs = new Set<string>()
  const skus = new Map<string, string>()
  for (const product of products) {
    const where = `المنتج "${product.slug}"`
    if (productSlugs.has(product.slug)) {
      problems.push(`رابط المنتج "${product.slug}" مكرر.`)
    }
    productSlugs.add(product.slug)

    if (!categorySlugs.has(product.category)) {
      problems.push(`${where}: الفئة "${product.category}" غير موجودة.`)
    }

    const optionNames = Object.keys(product.variants[0].options)
      .sort()
      .join("|")
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
      // متغيران بالخيارات نفسها: الثاني لا يمكن اختياره أبداً
      const combination = optionsKey(variant.options)
      if (combinations.has(combination)) {
        problems.push(
          `${where}: المتغير "${variant.sku}" يكرر خيارات متغير آخر (${Object.values(variant.options).join(" / ") || "دون خيارات"}).`
        )
      }
      combinations.add(combination)
    }

    const colorName = Object.keys(product.variants[0].options).find(
      isColorOption
    )
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
  }

  if (problems.length > 0) {
    throw new Error(
      `ملفات بيانات المتجر فيها ${problems.length} مشكلة يجب إصلاحها:\n- ${problems.join("\n- ")}`
    )
  }

  return { categories, products }
}
