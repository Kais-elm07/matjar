import "server-only"

import { homeContent } from "@/data/home"
import { testimonials } from "@/data/testimonials"
import { catalog } from "@/lib/catalog/build"
import { toProductCard } from "@/lib/catalog/cards"
import { getRootCategories } from "@/lib/catalog/catalog"
import type {
  CategoryBanner,
  CategoryBannerInput,
  DealCard,
  Product,
  ProductBanner,
  ProductBannerInput,
} from "@/lib/catalog/types"
import { discountPercent } from "@/lib/money"
import { categoryPath, productPath } from "@/lib/routes"

/** Number of products in each row of the home page */
const RAIL_LIMIT = 8
/** Number of products in each tab of "الرائج الآن" (trending now) */
const TRENDING_LIMIT = 6

const hasEndDate = (
  product: Product
): product is Product & { saleEndsAt: string } => product.saleEndsAt !== null

function toDealCard(product: Product & { saleEndsAt: string }): DealCard {
  return { ...toProductCard(product), saleEndsAt: product.saleEndsAt }
}

function buildSections() {
  const { products, byNewest, byPopularity } = catalog
  const onSale = products.filter((product) => product.compareAtPrice !== null)
  return {
    newArrivals: byNewest.slice(0, RAIL_LIMIT).map(toProductCard),
    bestSellers: byPopularity.slice(0, RAIL_LIMIT).map(toProductCard),
    /** Sales with an end date, ending soonest first. Ended sales were removed at build time */
    deals: onSale
      .filter(hasEndDate)
      .sort((a, b) => a.saleEndsAt.localeCompare(b.saleEndsAt))
      .slice(0, RAIL_LIMIT)
      .map(toDealCard),
    /** The largest real discount among all discounted products, for the "خصومات تصل إلى" (discounts up to) card */
    maxDiscount: Math.max(
      0,
      ...onSale.map(
        (product) => discountPercent(product.price, product.compareAtPrice) ?? 0
      )
    ),
    /** Best sellers in each top-level category, for the "الرائج الآن" (trending now) tabs */
    trending: getRootCategories()
      .map((category) => ({
        category: { slug: category.slug, name: category.name },
        products: byPopularity
          .filter((product) => product.categoryPath[0]?.slug === category.slug)
          .slice(0, TRENDING_LIMIT)
          .map(toProductCard),
      }))
      .filter((group) => group.products.length > 0),
  }
}

let sections: ReturnType<typeof buildSections> | undefined

/** The product sections of the home page, computed once at build time. */
export function getHomeSections() {
  sections ??= buildSections()
  return sections
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
    href: productPath(product.slug),
    title: input.title,
    text: input.text ?? null,
    tag: input.tag ?? (discount ? `خصم ${discount}%` : null),
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
    href: categoryPath(category.slug),
    title: input.title,
    text: input.text ?? null,
    image: category.image,
  }
}

function buildContent() {
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

let content: ReturnType<typeof buildContent> | undefined

/** The slides and promo cards on the home page, linked to the product and category data. */
export function getHomeContent() {
  content ??= buildContent()
  return content
}
