import "server-only"

import { z } from "zod"

import { categories as categoryData } from "@/data/categories"
import { homeContent } from "@/data/home"
import { products as productData } from "@/data/products"
import { testimonials } from "@/data/testimonials"

import { normalizeForSearch } from "./arabic"
import { discountPercent, toMinorUnits } from "./money"
import { getOptionGroups, isColorOption } from "./options"
import type {
  CartCatalog,
  Category,
  CategoryBanner,
  CategoryBannerInput,
  CategoryLink,
  CategoryOption,
  Product,
  ProductBanner,
  ProductBannerInput,
  ProductCard,
  Variant,
} from "./types"

/**
 * طبقة البيانات الوحيدة في الموقع: كل الصفحات تقرأ الفئات والمنتجات من هنا.
 * تعمل وقت البناء فقط، فلا تصل ملفات البيانات الكاملة إلى متصفح الزائر.
 * عند إضافة خادم لاحقاً يكفي استبدال مصدر البيانات في هذا الملف.
 */

z.config(z.locales.ar())

// ---------------------------------------------------------------------------
// التحقق من ملفات البيانات
// ---------------------------------------------------------------------------

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
  error:
    "الرابط يجب أن يكون بأحرف إنجليزية صغيرة وأرقام وشرطات فقط، مثل classic-shirt",
})

const imageSrc = z
  .string()
  .refine((src) => src.startsWith("/") || /^https?:\/\//.test(src), {
    error: "مسار الصورة يجب أن يبدأ بـ / أو https://",
  })

const text = z.string().trim().min(1, { error: "لا يمكن أن يكون فارغاً" })

const categorySchema = z.object({
  slug,
  name: text,
  description: z.string().trim().optional(),
  image: imageSrc.optional(),
  parent: slug.optional(),
})

const variantSchema = z
  .object({
    sku: text,
    options: z.record(text, text).default({}),
    price: z.number().positive({ error: "السعر يجب أن يكون أكبر من صفر" }),
    compareAtPrice: z.number().positive().optional(),
    stock: z
      .number()
      .int({ error: "المخزون يجب أن يكون رقماً صحيحاً" })
      .min(0, { error: "المخزون لا يمكن أن يكون سالباً" }),
  })
  .refine(
    (variant) =>
      variant.compareAtPrice === undefined ||
      variant.compareAtPrice > variant.price,
    {
      error: "السعر قبل الخصم يجب أن يكون أكبر من السعر",
      path: ["compareAtPrice"],
    }
  )

const productSchema = z.object({
  slug,
  name: text,
  category: slug,
  description: z.string().default(""),
  specs: z.array(z.object({ label: text, value: text })).default([]),
  images: z
    .array(
      z.object({
        src: imageSrc,
        alt: z.string().trim().optional(),
        color: z.string().trim().optional(),
      })
    )
    .min(1, { error: "كل منتج يحتاج صورة واحدة على الأقل" }),
  variants: z
    .array(variantSchema)
    .min(1, { error: "كل منتج يحتاج متغيراً واحداً على الأقل" }),
  popularity: z.number().int().min(0).default(0),
  createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    error: "التاريخ يجب أن يكون بصيغة 2026-10-30",
  }),
  saleEndsAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      error: "تاريخ نهاية العرض يجب أن يكون بصيغة 2026-12-31",
    })
    .optional(),
  hidden: z.boolean().default(false),
})

type ParsedCategory = z.infer<typeof categorySchema>
type ParsedProduct = z.infer<typeof productSchema>

function parseData() {
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
        const field = issue.path.join(".") || "البيانات"
        problems.push(`${label(item, index)}، الحقل ${field}: ${issue.message}`)
      }
    })
    return parsed
  }

  const slugOf = (item: unknown, index: number) =>
    (item as { slug?: string })?.slug ?? `رقم ${index + 1}`

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

  // فحوص تربط الملفات ببعضها
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
    }

    const colorName = Object.keys(product.variants[0].options).find(
      isColorOption
    )
    const colorValues = new Set(
      product.variants.map((v) => (colorName ? v.options[colorName] : ""))
    )
    for (const image of product.images) {
      if (image.color && colorName && !colorValues.has(image.color)) {
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

// ---------------------------------------------------------------------------
// تحويل البيانات إلى الشكل الموحّد
// ---------------------------------------------------------------------------

function buildCatalog() {
  const parsed = parseData()

  const bySlug = new Map(parsed.categories.map((c) => [c.slug, c]))
  const pathOf = (slug: string): CategoryLink[] => {
    const path: CategoryLink[] = []
    let current = bySlug.get(slug)
    while (current) {
      path.unshift({ slug: current.slug, name: current.name })
      current = current.parent ? bySlug.get(current.parent) : undefined
    }
    return path
  }

  const products: Product[] = parsed.products
    .filter((product) => !product.hidden)
    .map((input) => {
      const variants: Variant[] = input.variants.map((variant) => ({
        sku: variant.sku,
        options: variant.options,
        price: toMinorUnits(variant.price),
        compareAtPrice:
          variant.compareAtPrice === undefined
            ? null
            : toMinorUnits(variant.compareAtPrice),
        stock: variant.stock,
      }))
      const cheapest = variants.reduce((min, v) =>
        v.price < min.price ? v : min
      )

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
        compareAtPrice: discountPercent(cheapest.price, cheapest.compareAtPrice)
          ? cheapest.compareAtPrice
          : null,
        maxPrice: Math.max(...variants.map((v) => v.price)),
        inStock: variants.some((v) => v.stock > 0),
        popularity: input.popularity,
        createdAt: input.createdAt,
        saleEndsAt: input.saleEndsAt ?? null,
      }
    })

  const categories: Category[] = parsed.categories.map((category) => ({
    slug: category.slug,
    name: category.name,
    description: category.description ?? null,
    image: category.image ?? null,
    parentSlug: category.parent ?? null,
    childSlugs: parsed.categories
      .filter((child) => child.parent === category.slug)
      .map((child) => child.slug),
    path: pathOf(category.slug),
    productCount: products.filter((product) =>
      product.categoryPath.some((link) => link.slug === category.slug)
    ).length,
  }))

  return {
    categories,
    categoryBySlug: new Map(categories.map((c) => [c.slug, c])),
    products,
    productBySlug: new Map(products.map((p) => [p.slug, p])),
  }
}

const catalog = buildCatalog()

// ---------------------------------------------------------------------------
// دوال القراءة
// ---------------------------------------------------------------------------

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

export function toProductCard(product: Product): ProductCard {
  const [onlyVariant] = product.variants
  return {
    slug: product.slug,
    name: product.name,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    priceVaries: product.maxPrice !== product.price,
    inStock: product.inStock,
    image: product.images[0] ?? null,
    categoryName: product.categoryPath.at(-1)?.name ?? null,
    quickAdd:
      product.variants.length === 1
        ? { sku: onlyVariant.sku, stock: onlyVariant.stock }
        : null,
    saleEndsAt: product.saleEndsAt,
    categorySlugs: product.categoryPath.map((link) => link.slug),
    variants: product.variants.map((variant) => ({
      options: variant.options,
      inStock: variant.stock > 0,
    })),
    popularity: product.popularity,
    createdAt: product.createdAt,
    searchText: normalizeForSearch(
      [
        product.name,
        ...product.categoryPath.map((link) => link.name),
        ...new Set(product.variants.flatMap((v) => Object.values(v.options))),
        ...product.specs.map((spec) => spec.value),
      ].join(" ")
    ),
  }
}

/** بطاقات منتجات فئة معينة وفئاتها الفرعية، أو كل المنتجات. */
export function getProductCards(categorySlug?: string) {
  const products = categorySlug
    ? catalog.products.filter((product) =>
        product.categoryPath.some((link) => link.slug === categorySlug)
      )
    : catalog.products
  return products.map(toProductCard)
}

const byPopularity = (a: Product, b: Product) => b.popularity - a.popularity

/** منتجات مشابهة: من نفس الفئة أولاً، ثم من نفس الفئة الرئيسية، ثم الأكثر مبيعاً. */
export function getRelatedProducts(product: Product, limit = 8) {
  const leaf = product.categoryPath.at(-1)?.slug
  const root = product.categoryPath[0]?.slug
  const others = catalog.products.filter((p) => p.slug !== product.slug)
  const inCategory = (slug?: string) => (p: Product) =>
    p.categoryPath.some((link) => link.slug === slug)

  const ordered = [
    ...others.filter(inCategory(leaf)).sort(byPopularity),
    ...others.filter(inCategory(root)).sort(byPopularity),
    ...[...others].sort(byPopularity),
  ]
  return [...new Map(ordered.map((p) => [p.slug, p])).values()]
    .slice(0, limit)
    .map(toProductCard)
}

/** أقسام المنتجات في الصفحة الرئيسية. */
export function getHomeSections(limit = 8) {
  const products = catalog.products
  // تاريخ البناء: العروض المنتهية قبله لا تُنشر أصلاً، والمتصفح يخفي ما ينتهي بعده
  const today = new Date().toISOString().slice(0, 10)
  return {
    newArrivals: [...products]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit)
      .map(toProductCard),
    bestSellers: [...products]
      .sort(byPopularity)
      .slice(0, limit)
      .map(toProductCard),
    onSale: products
      .filter((product) => product.compareAtPrice !== null)
      .sort(
        (a, b) =>
          (discountPercent(b.price, b.compareAtPrice) ?? 0) -
          (discountPercent(a.price, a.compareAtPrice) ?? 0)
      )
      .slice(0, limit)
      .map(toProductCard),
    deals: products
      .filter(
        (product) =>
          product.saleEndsAt !== null &&
          product.saleEndsAt >= today &&
          product.compareAtPrice !== null
      )
      .sort((a, b) => (a.saleEndsAt ?? "").localeCompare(b.saleEndsAt ?? ""))
      .slice(0, limit)
      .map(toProductCard),
    /** الأكثر مبيعاً في كل فئة رئيسية، لتبويبات "الرائج الآن" */
    trending: getRootCategories()
      .map((category) => ({
        category: { slug: category.slug, name: category.name },
        products: products
          .filter((product) => product.categoryPath[0]?.slug === category.slug)
          .sort(byPopularity)
          .slice(0, 6)
          .map(toProductCard),
      }))
      .filter((group) => group.products.length > 0),
  }
}

function toProductBanner(input: ProductBannerInput): ProductBanner {
  const product = catalog.productBySlug.get(input.product)
  if (!product) {
    throw new Error(
      `ملف الصفحة الرئيسية (src/data/home.ts): المنتج "${input.product}" غير موجود في ملف المنتجات.`
    )
  }
  const discount = discountPercent(product.price, product.compareAtPrice)
  return {
    href: `/product/${product.slug}`,
    title: input.title,
    text: input.text ?? null,
    tag: input.tag ?? (discount ? `خصم ${discount}%` : null),
    theme: input.theme,
    image: product.images[0] ?? null,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    priceVaries: product.maxPrice !== product.price,
  }
}

function toCategoryBanner(input: CategoryBannerInput): CategoryBanner {
  const category = catalog.categoryBySlug.get(input.category)
  if (!category) {
    throw new Error(
      `ملف الصفحة الرئيسية (src/data/home.ts): الفئة "${input.category}" غير موجودة في ملف الفئات.`
    )
  }
  return {
    href: `/category/${category.slug}`,
    title: input.title,
    text: input.text ?? null,
    theme: input.theme,
    image: category.image,
  }
}

/** الشرائح وبطاقات العروض في الصفحة الرئيسية، مربوطة ببيانات المنتجات والفئات. */
export function getHomeContent() {
  return {
    heroSlides: homeContent.heroSlides.map(toProductBanner),
    promos: homeContent.promos.map(toProductBanner),
    spotlights: homeContent.spotlights.map(toCategoryBanner),
    wideBanner: homeContent.wideBanner
      ? toProductBanner(homeContent.wideBanner)
      : null,
    testimonials,
  }
}

/** أسعار ومخزون كل متغير حسب رمزه، لمطابقة السلة المحفوظة في المتصفح مع بيانات الموقع. */
export function getCartCatalog(): CartCatalog {
  return Object.fromEntries(
    catalog.products.flatMap((product) =>
      product.variants.map((variant) => [
        variant.sku,
        {
          price: variant.price,
          compareAtPrice: variant.compareAtPrice,
          stock: variant.stock,
        },
      ])
    )
  )
}

/** فهرس البحث: بطاقات كل المنتجات، يُنشر كملف JSON يُحمَّل عند أول بحث. */
export function getSearchIndex() {
  return catalog.products.map(toProductCard)
}
