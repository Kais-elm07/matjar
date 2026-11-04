import "server-only"

import { catalog } from "./build"
import { toProductCard, toSearchCard } from "./cards"
import type { CartCatalog, Category, CategoryOption, Product } from "./types"
import { optionsKey } from "./variant-key"

/**
 * طبقة البيانات الوحيدة في الموقع: كل الصفحات تقرأ الفئات والمنتجات من هنا.
 * تعمل وقت البناء فقط، وعند إضافة خادم لاحقاً يكفي استبدال مصدر البيانات في build.ts.
 * محتوى الصفحة الرئيسية في home.ts.
 */

export function getCategories() {
  return catalog.categories
}

export function getRootCategories() {
  return catalog.categories.filter((category) => !category.parentSlug)
}

export function getCategory(slug: string) {
  return catalog.categoryBySlug.get(slug)
}

export function getChildCategories(category: Category) {
  return category.childSlugs
    .map((slug) => catalog.categoryBySlug.get(slug))
    .filter((child): child is Category => Boolean(child))
}

/** الفئات بأسمائها وفئاتها الأم، لعرض فلتر الفئات في صفحتي كل المنتجات والبحث. */
export function getCategoryOptions(): CategoryOption[] {
  return catalog.categories.map(({ slug, name, parentSlug }) => ({
    slug,
    name,
    parentSlug,
  }))
}

export function getProducts() {
  return catalog.products
}

export function getProduct(slug: string) {
  return catalog.productBySlug.get(slug)
}

const inCategory = (slug: string | undefined) => (product: Product) =>
  product.categoryPath.some((link) => link.slug === slug)

/** بطاقات منتجات فئة معينة وفئاتها الفرعية، أو كل المنتجات. */
export function getProductCards(categorySlug?: string) {
  const products = categorySlug
    ? catalog.products.filter(inCategory(categorySlug))
    : catalog.products
  return products.map(toProductCard)
}

/** منتجات مشابهة: من نفس الفئة أولاً، ثم من نفس الفئة الرئيسية، ثم الأكثر مبيعاً. */
export function getRelatedProducts(product: Product, limit = 8) {
  const picked = new Set([product.slug])
  const related: Product[] = []
  const groups = [
    inCategory(product.categoryPath.at(-1)?.slug),
    inCategory(product.categoryPath[0]?.slug),
    () => true,
  ]
  for (const matches of groups) {
    for (const candidate of catalog.byPopularity) {
      if (related.length >= limit) break
      if (!picked.has(candidate.slug) && matches(candidate)) {
        picked.add(candidate.slug)
        related.push(candidate)
      }
    }
  }
  return related.map(toProductCard)
}

/**
 * أسعار ومخزون كل متغير حسب رمزه، لمطابقة السلة المحفوظة في المتصفح مع بيانات الموقع.
 * مفتاح الخيارات يكشف متغيراً تغيّرت خياراته وبقي رمزه (بعد إعادة ترتيب المقاسات مثلاً).
 */
export function getCartCatalog(): CartCatalog {
  return Object.fromEntries(
    catalog.products.flatMap((product) =>
      product.variants.map((variant) => [
        variant.sku,
        {
          price: variant.price,
          compareAtPrice: variant.compareAtPrice,
          stock: variant.stock,
          options: optionsKey(variant.options),
        },
      ])
    )
  )
}

/** فهرس البحث: بطاقات كل المنتجات بنصوص البحث، يُنشر كملف JSON يُحمَّل عند أول بحث. */
export function getSearchIndex() {
  return catalog.products.map(toSearchCard)
}
