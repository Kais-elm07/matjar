import "server-only"

import { catalog } from "@/lib/catalog/build"
import { toProductCard, toSearchCard } from "@/lib/catalog/cards"
import type {
  CartCatalog,
  Category,
  CategoryOption,
  NavCategory,
  Product,
  SimilarProducts,
} from "@/lib/catalog/types"
import { optionsKey } from "@/lib/catalog/variant-key"

/**
 * The site's only data layer: every page and the products API read categories and products from here.
 * The catalog is built once in memory from src/data (build.ts), both while pages are prepared at build
 * time and in the running server.
 * The home page content is in home.ts.
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

/** The top-level categories with their subcategories' names, for the header menus. */
export function getNavCategories(): NavCategory[] {
  return getRootCategories().map((category) => ({
    slug: category.slug,
    name: category.name,
    children: getChildCategories(category).map(({ slug, name }) => ({
      slug,
      name,
    })),
  }))
}

/** Categories with their names and parents, for the category filter on the all-products and search pages. */
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

/** Product cards for a given category and its subcategories, or for all products. */
export function getProductCards(categorySlug?: string) {
  const products = categorySlug
    ? catalog.products.filter(inCategory(categorySlug))
    : catalog.products
  return products.map(toProductCard)
}

/** Related products: from the same category first, then the same top-level category, then the best sellers. */
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
 * Prices and stock of every variant by SKU, to sync the cart saved in the browser with the site's data.
 * The options key catches a variant whose options changed while its SKU stayed the same (after reordering sizes, for example).
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

/**
 * For every product, up to `limit` similar products that are in stock (the same order as getRelatedProducts),
 * published as similar-products.json for Najm's suggestions after something is added to the cart.
 */
export function getSimilarProducts(limit = 4): SimilarProducts {
  return Object.fromEntries(
    catalog.products.map((product) => [
      product.slug,
      getRelatedProducts(product, catalog.products.length)
        .filter((card) => card.inStock)
        .slice(0, limit)
        .map((card) => ({
          slug: card.slug,
          name: card.name,
          price: card.price,
          compareAtPrice: card.compareAtPrice,
          priceVaries: card.priceVaries,
          quickAdd: card.quickAdd,
          image: card.image
            ? { src: card.image.src, alt: card.image.alt }
            : null,
        })),
    ])
  )
}

/** The search index: every product card with its search text, served by the products API (src/lib/api/products.ts). */
export function getSearchIndex() {
  return catalog.products.map(toSearchCard)
}
