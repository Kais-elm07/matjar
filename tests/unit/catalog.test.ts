import { describe, expect, it } from "vitest"

import { coupons } from "@/data/coupons"
import { shipping } from "@/data/shipping"
import {
  getCartCatalog,
  getCategories,
  getHomeContent,
  getHomeSections,
  getProduct,
  getProductCards,
  getProducts,
  getRelatedProducts,
  getSearchIndex,
} from "@/lib/catalog/catalog"
import { toMinorUnits } from "@/lib/catalog/money"
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

  it("العروض المحدودة لم تنته بعد، والمقترحات لا تكرر المنتج نفسه", () => {
    const today = new Date().toISOString().slice(0, 10)
    for (const deal of getHomeSections().deals) {
      expect(deal.saleEndsAt! >= today, deal.slug).toBe(true)
    }
    for (const product of products) {
      expect(
        getRelatedProducts(product).map((related) => related.slug),
        product.slug
      ).not.toContain(product.slug)
    }
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
