import { normalizeForSearch } from "./arabic"
import type { Product, ProductCardData, SearchCardData } from "./types"

/**
 * بيانات البطاقات التي تصل إلى المتصفح: أصغر ما يكفي للعرض والفلترة،
 * فلا تُرسل أوصاف المنتجات ومواصفاتها مع كل بطاقة.
 * تُحسب مرة واحدة لكل منتج وتُعاد في كل الصفحات.
 */

const cards = new WeakMap<Product, ProductCardData>()
const searchCards = new WeakMap<Product, SearchCardData>()

export function toProductCard(product: Product): ProductCardData {
  const cached = cards.get(product)
  if (cached) return cached

  const [onlyVariant] = product.variants
  const image = product.images[0]
  const card: ProductCardData = {
    slug: product.slug,
    name: product.name,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    priceVaries: product.maxPrice !== product.price,
    inStock: product.inStock,
    image: image ? { src: image.src, alt: image.alt } : null,
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
  }
  cards.set(product, card)
  return card
}

/** بطاقة فهرس البحث: البطاقة مع نص مطبّع يجمع الاسم والفئات والخيارات والمواصفات. */
export function toSearchCard(product: Product): SearchCardData {
  const cached = searchCards.get(product)
  if (cached) return cached

  const card: SearchCardData = {
    ...toProductCard(product),
    searchText: normalizeForSearch(
      [
        product.name,
        ...product.categoryPath.map((link) => link.name),
        ...new Set(product.variants.flatMap((v) => Object.values(v.options))),
        ...product.specs.map((spec) => spec.value),
      ].join(" ")
    ),
  }
  searchCards.set(product, card)
  return card
}
