import "server-only"

import type { Catalog } from "@/lib/catalog/build"
import { toProductCard, toSearchCard } from "@/lib/catalog/cards"
import { getCatalog } from "@/lib/catalog/load"
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
 * The catalog comes from the database through a cache (load.ts), so these functions are async.
 * The home page content is in home.ts.
 */

export async function getCategories() {
  return (await getCatalog()).categories
}

export async function getCategory(slug: string) {
  return (await getCatalog()).categoryBySlug.get(slug)
}

function childrenOf(catalog: Catalog, category: Category) {
  return category.childSlugs
    .map((slug) => catalog.categoryBySlug.get(slug))
    .filter((child): child is Category => Boolean(child))
}

export async function getChildCategories(category: Category) {
  return childrenOf(await getCatalog(), category)
}

/** The top-level categories with their subcategories' names, for the header menus. */
export async function getNavCategories(): Promise<NavCategory[]> {
  const catalog = await getCatalog()
  return catalog.categories
    .filter((category) => !category.parentSlug)
    .map((category) => ({
      slug: category.slug,
      name: category.name,
      children: childrenOf(catalog, category).map(({ slug, name }) => ({
        slug,
        name,
      })),
    }))
}

/** Categories with their names and parents, for the category filter on the all-products and search pages. */
export async function getCategoryOptions(): Promise<CategoryOption[]> {
  return (await getCatalog()).categories.map(({ slug, name, parentSlug }) => ({
    slug,
    name,
    parentSlug,
  }))
}

export async function getProducts() {
  return (await getCatalog()).products
}

export async function getProduct(slug: string) {
  return (await getCatalog()).productBySlug.get(slug)
}

const inCategory = (slug: string | undefined) => (product: Product) =>
  product.categoryPath.some((link) => link.slug === slug)

/** Product cards for a given category and its subcategories, or for all products. */
export async function getProductCards(categorySlug?: string) {
  const { products } = await getCatalog()
  return (
    categorySlug ? products.filter(inCategory(categorySlug)) : products
  ).map(toProductCard)
}

function relatedTo(catalog: Catalog, product: Product, limit: number) {
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

/** Related products: from the same category first, then the same top-level category, then the best sellers. */
export async function getRelatedProducts(product: Product, limit = 8) {
  return relatedTo(await getCatalog(), product, limit)
}

/**
 * Prices and stock of every variant by SKU, to sync the cart saved in the browser with the site's data.
 * The options key catches a variant whose options changed while its SKU stayed the same (after reordering sizes, for example).
 */
export async function getCartCatalog(): Promise<CartCatalog> {
  return cartCatalogOf((await getCatalog()).products)
}

/** The same prices and stock for the given products only, such as the ones an order names. */
export function cartCatalogOf(products: Product[]): CartCatalog {
  return Object.fromEntries(
    products.flatMap((product) =>
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
export async function getSimilarProducts(limit = 4): Promise<SimilarProducts> {
  const catalog = await getCatalog()
  return Object.fromEntries(
    catalog.products.map((product) => [
      product.slug,
      relatedTo(catalog, product, catalog.products.length)
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
export async function getSearchIndex() {
  return (await getCatalog()).products.map(toSearchCard)
}
