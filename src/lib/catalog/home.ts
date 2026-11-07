import "server-only"

import { homeContent } from "@/data/home"
import { testimonials } from "@/data/testimonials"
import type { Catalog } from "@/lib/catalog/build"
import { toProductCard } from "@/lib/catalog/cards"
import { getCatalog } from "@/lib/catalog/load"
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

function buildSections(catalog: Catalog) {
  const { products, byNewest, byPopularity } = catalog
  const onSale = products.filter((product) => product.compareAtPrice !== null)
  return {
    newArrivals: byNewest.slice(0, RAIL_LIMIT).map(toProductCard),
    bestSellers: byPopularity.slice(0, RAIL_LIMIT).map(toProductCard),
    /** Sales with an end date, ending soonest first. Ended sales are no longer on sale in the catalog */
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
    trending: catalog.categories
      .filter((category) => !category.parentSlug)
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

const sections = new WeakMap<Catalog, ReturnType<typeof buildSections>>()

/** The product sections of the home page, computed once for each catalog. */
export async function getHomeSections() {
  const catalog = await getCatalog()
  const cached = sections.get(catalog)
  if (cached) return cached
  const built = buildSections(catalog)
  sections.set(catalog, built)
  return built
}

/**
 * A banner for a product, or null when the product is no longer in the catalog (hidden from the admin
 * panel, for example): the banner is left out instead of breaking the home page.
 */
function toProductBanner(
  catalog: Catalog,
  input: ProductBannerInput
): ProductBanner | null {
  const product = catalog.productBySlug.get(input.product)
  if (!product) {
    console.warn(
      `الصفحة الرئيسية (src/data/home.ts): المنتج "${input.product}" غير موجود، فلم يُعرض البانر الخاص به.`
    )
    return null
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

function toCategoryBanner(
  catalog: Catalog,
  input: CategoryBannerInput
): CategoryBanner | null {
  const category = catalog.categoryBySlug.get(input.category)
  if (!category) {
    console.warn(
      `الصفحة الرئيسية (src/data/home.ts): الفئة "${input.category}" غير موجودة، فلم يُعرض البانر الخاص بها.`
    )
    return null
  }
  return {
    href: categoryPath(category.slug),
    title: input.title,
    text: input.text ?? null,
    image: category.image,
  }
}

const isBanner = <T>(banner: T | null): banner is T => banner !== null

function buildContent(catalog: Catalog) {
  return {
    heroSlides: homeContent.heroSlides
      .map((input) => toProductBanner(catalog, input))
      .filter(isBanner),
    promos: homeContent.promos
      .map((input) => toProductBanner(catalog, input))
      .filter(isBanner),
    spotlights: homeContent.spotlights
      .map((input) => toCategoryBanner(catalog, input))
      .filter(isBanner),
    wideBanner: homeContent.wideBanner
      ? toProductBanner(catalog, homeContent.wideBanner)
      : null,
    testimonials,
  }
}

const contents = new WeakMap<Catalog, ReturnType<typeof buildContent>>()

/** The slides and promo cards on the home page, linked to the product and category data. */
export async function getHomeContent() {
  const catalog = await getCatalog()
  const cached = contents.get(catalog)
  if (cached) return cached
  const built = buildContent(catalog)
  contents.set(catalog, built)
  return built
}
