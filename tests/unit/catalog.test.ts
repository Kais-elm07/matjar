import { describe, expect, it } from "vitest"

import { coupons } from "@/data/coupons"
import { shipping } from "@/data/shipping"
import { existsSync } from "node:fs"
import path from "node:path"

import {
  getCartCatalog,
  getCategories,
  getProduct,
  getProductCards,
  getProducts,
  getRelatedProducts,
  getSearchIndex,
} from "@/lib/catalog/catalog"
import { getHomeContent, getHomeSections } from "@/lib/catalog/home"
import { optionsKey } from "@/lib/catalog/variant-key"
import { getCheckoutConfig } from "@/lib/checkout/config"
import { storeToday } from "@/lib/dates"
import { discountPercent, toMinorUnits } from "@/lib/money"

/** Checks on the current store data: they fail if a product or category is added in a way that breaks the site. */
describe("actual store data", () => {
  const products = getProducts()
  const categories = getCategories()

  it("has unique product slugs and variant SKUs", () => {
    const skus = products.flatMap((product) =>
      product.variants.map((variant) => variant.sku)
    )
    expect(new Set(products.map((product) => product.slug)).size).toBe(
      products.length
    )
    expect(new Set(skus).size).toBe(skus.length)
  })

  it("has an image, a valid price and an existing category for every product", () => {
    const categorySlugs = new Set(categories.map((category) => category.slug))
    for (const product of products) {
      expect(product.images.length, product.slug).toBeGreaterThan(0)
      expect(product.price, product.slug).toBeGreaterThan(0)
      expect(product.maxPrice, product.slug).toBeGreaterThanOrEqual(
        product.price
      )
      if (product.compareAtPrice !== null) {
        expect(product.compareAtPrice, product.slug).toBeGreaterThan(
          product.price
        )
      }
      const category = product.categoryPath.at(-1)?.slug ?? ""
      expect(categorySlugs.has(category), product.slug).toBe(true)
    }
  })

  it("includes subcategories in each category's product count", () => {
    for (const category of categories) {
      expect(getProductCards(category.slug), category.slug).toHaveLength(
        category.productCount
      )
    }
  })

  it("covers every product and variant in the search index and the cart prices", () => {
    const cartCatalog = getCartCatalog()
    expect(getSearchIndex()).toHaveLength(products.length)
    for (const product of products) {
      for (const variant of product.variants) {
        expect(cartCatalog[variant.sku], variant.sku).toEqual({
          price: variant.price,
          compareAtPrice: variant.compareAtPrice,
          stock: variant.stock,
          options: optionsKey(variant.options),
        })
      }
    }
  })

  it("points the home page cards to existing products", () => {
    const { heroSlides, promos, wideBanner } = getHomeContent()
    for (const banner of [
      ...heroSlides,
      ...promos,
      ...(wideBanner ? [wideBanner] : []),
    ]) {
      const slug = banner.href.replace("/product/", "")
      expect(getProduct(slug), banner.href).toBeDefined()
    }
  })

  it("resets expired sales to their regular price at build time, and suggestions never repeat the product itself", () => {
    const today = storeToday()
    for (const product of products) {
      if (product.saleEndsAt === null) continue
      expect(product.saleEndsAt >= today, product.slug).toBe(true)
      expect(product.compareAtPrice, product.slug).not.toBeNull()
    }
    const { deals, maxDiscount } = getHomeSections()
    expect(deals.every((deal) => deal.saleEndsAt !== null)).toBe(true)
    // "خصومات تصل إلى" ("discounts up to") equals the largest discount among all discounted products
    expect(maxDiscount).toBe(
      Math.max(
        0,
        ...products.map(
          (product) =>
            discountPercent(product.price, product.compareAtPrice) ?? 0
        )
      )
    )
    for (const product of products) {
      expect(
        getRelatedProducts(product).map((related) => related.slug),
        product.slug
      ).not.toContain(product.slug)
    }
  })

  it("has a source file in assets/images for every image in the data", () => {
    const extensions = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"]
    const hasSource = (src: string) =>
      extensions.some((extension) =>
        existsSync(path.join("assets", `${src.slice(1)}${extension}`))
      )
    for (const product of products) {
      for (const image of product.images) {
        expect(hasSource(image.src), image.src).toBe(true)
      }
    }
    for (const category of categories) {
      if (category.image) {
        expect(hasSource(category.image), category.image).toBe(true)
      }
    }
  })

  it("keeps the search text out of the listing cards and in the search index", () => {
    expect(getProductCards()[0]).not.toHaveProperty("searchText")
    expect(getSearchIndex()[0].searchText.length).toBeGreaterThan(0)
  })

  it("converts the shipping and coupon settings to halalas", () => {
    const config = getCheckoutConfig()
    expect(config.freeShippingFrom).toBe(
      toMinorUnits(shipping.freeShippingFrom)
    )
    expect(config.cities).toHaveLength(shipping.cities.length)
    expect(config.coupons.map((coupon) => coupon.code)).toEqual(
      coupons.map((coupon) => coupon.code)
    )
  })
})
