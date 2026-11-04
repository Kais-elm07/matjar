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
import { storeToday } from "@/lib/catalog/dates"
import { getHomeContent, getHomeSections } from "@/lib/catalog/home"
import { discountPercent, toMinorUnits } from "@/lib/catalog/money"
import { optionsKey } from "@/lib/catalog/variant-key"
import { getCheckoutConfig } from "@/lib/checkout/config"

/** فحوص على بيانات المتجر الحالية: تفشل إن أُضيف منتج أو فئة بشكل يكسر الموقع. */
describe("بيانات المتجر الفعلية", () => {
  const products = getProducts()
  const categories = getCategories()

  it("روابط المنتجات ورموز المتغيرات فريدة", () => {
    const skus = products.flatMap((product) =>
      product.variants.map((variant) => variant.sku)
    )
    expect(new Set(products.map((product) => product.slug)).size).toBe(
      products.length
    )
    expect(new Set(skus).size).toBe(skus.length)
  })

  it("لكل منتج صورة وسعر صحيح وفئة موجودة", () => {
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

  it("عدد منتجات كل فئة يشمل فئاتها الفرعية", () => {
    for (const category of categories) {
      expect(getProductCards(category.slug), category.slug).toHaveLength(
        category.productCount
      )
    }
  })

  it("فهرس البحث وأسعار السلة يغطيان كل المنتجات والمتغيرات", () => {
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

  it("بطاقات الصفحة الرئيسية تشير إلى منتجات موجودة", () => {
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

  it("العروض المنتهية أُعيدت لسعرها وقت البناء، والمقترحات لا تكرر المنتج نفسه", () => {
    const today = storeToday()
    for (const product of products) {
      if (product.saleEndsAt === null) continue
      expect(product.saleEndsAt >= today, product.slug).toBe(true)
      expect(product.compareAtPrice, product.slug).not.toBeNull()
    }
    const { deals, maxDiscount } = getHomeSections()
    expect(deals.every((deal) => deal.saleEndsAt !== null)).toBe(true)
    // "خصومات تصل إلى" تساوي أكبر خصم بين كل المنتجات المخفضة
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

  it("لكل صورة في البيانات ملف أصلي في assets/images", () => {
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

  it("بطاقات القوائم لا تحمل نصوص البحث، وفهرس البحث يحملها", () => {
    expect(getProductCards()[0]).not.toHaveProperty("searchText")
    expect(getSearchIndex()[0].searchText.length).toBeGreaterThan(0)
  })

  it("إعدادات الشحن والكوبونات تُحوَّل إلى هللات", () => {
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
