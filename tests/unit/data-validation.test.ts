import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

/**
 * Build-time validation of the data files: we replace the src/data files with copies that contain errors,
 * and check that the build stops with an Arabic message that points the store owner to every error.
 */

const validProduct = {
  slug: "test-shirt",
  name: "قميص تجريبي",
  category: "men",
  images: [{ src: "/images/products/test-shirt-1" }],
  variants: [{ sku: "T-1", price: 100, stock: 5 }],
  createdAt: "2026-10-01",
}

/** The error message when the module loads, or an empty string if it loads without an error. */
const errorOf = (load: Promise<unknown>) =>
  load.then(
    () => "",
    (error: Error) => error.message
  )

beforeEach(() => {
  vi.resetModules()
})

afterEach(() => {
  vi.doUnmock("@/data/categories")
  vi.doUnmock("@/data/products")
  vi.doUnmock("@/data/shipping")
  vi.doUnmock("@/data/coupons")
})

describe("product and category files", () => {
  it("collects all product errors in one Arabic message", async () => {
    vi.doMock("@/data/categories", () => ({
      categories: [{ slug: "men", name: "رجالي" }],
    }))
    vi.doMock("@/data/products", () => ({
      products: [
        validProduct,
        { ...validProduct, variants: [{ sku: "T-2", price: 100, stock: 5 }] },
        { ...validProduct, slug: "other-shirt", category: "women" },
        {
          ...validProduct,
          slug: "bad-price",
          variants: [{ sku: "T-4", price: 100, compareAtPrice: 90, stock: 1 }],
        },
        { ...validProduct, slug: "no-images", images: [] },
        {
          ...validProduct,
          slug: "Bad Slug",
          variants: [{ sku: "T-6", price: 100, stock: 1 }],
        },
      ],
    }))

    const message = await errorOf(
      import("@/lib/catalog/catalog").then((catalog) => catalog.getProducts())
    )
    expect(message).toContain("ملفات بيانات المتجر فيها")
    expect(message).toContain('رابط المنتج "test-shirt" مكرر.')
    expect(message).toContain('المنتج "other-shirt": الفئة "women" غير موجودة.')
    expect(message).toContain('رمز المتغير "T-1" مستخدم أيضاً في "test-shirt"')
    expect(message).toContain("السعر قبل الخصم يجب أن يكون أكبر من السعر")
    expect(message).toContain("كل منتج يحتاج صورة واحدة على الأقل")
    expect(message).toContain(
      "الرابط يجب أن يكون بأحرف إنجليزية صغيرة وأرقام وشرطات فقط"
    )
  })

  it("detects a missing parent category and a circular hierarchy", async () => {
    vi.doMock("@/data/categories", () => ({
      categories: [
        { slug: "men", name: "رجالي" },
        { slug: "kids", name: "أطفال", parent: "family" },
        { slug: "a", name: "أ", parent: "b" },
        { slug: "b", name: "ب", parent: "a" },
      ],
    }))
    vi.doMock("@/data/products", () => ({ products: [validProduct] }))

    const message = await errorOf(
      import("@/lib/catalog/catalog").then((catalog) => catalog.getProducts())
    )
    expect(message).toContain('الفئة "kids": الفئة الأم "family" غير موجودة.')
    expect(message).toContain('الفئة "a": تسلسل الفئات الأم دائري.')
  })

  it("rejects nonexistent dates, prices with extra decimal places and duplicate variants", async () => {
    vi.doMock("@/data/categories", () => ({
      categories: [{ slug: "men", name: "رجالي" }],
    }))
    vi.doMock("@/data/products", () => ({
      products: [
        { ...validProduct, createdAt: "2026-02-30" },
        {
          ...validProduct,
          slug: "odd-price",
          variants: [{ sku: "T-2", price: 99.999, stock: 1 }],
        },
        {
          ...validProduct,
          slug: "twins",
          variants: [
            { sku: "T-3", options: { المقاس: "M" }, price: 100, stock: 1 },
            { sku: "T-4", options: { المقاس: "M" }, price: 110, stock: 1 },
          ],
        },
        {
          ...validProduct,
          slug: "colored-image",
          images: [{ src: "/images/products/x-1", color: "أزرق" }],
          variants: [{ sku: "T-5", price: 100, stock: 1 }],
        },
        {
          ...validProduct,
          slug: "named-tone",
          images: [{ src: "/images/products/y-1", tone: "orange" }],
          variants: [{ sku: "T-6", price: 100, stock: 1 }],
        },
      ],
    }))

    const message = await errorOf(
      import("@/lib/catalog/catalog").then((catalog) => catalog.getProducts())
    )
    expect(message).toContain("الحقل createdAt: التاريخ غير موجود في التقويم")
    expect(message).toContain("الحقل variants[1].price")
    expect(message).toContain(`المتغير "T-4" يكرر خيارات متغير آخر`)
    expect(message).toContain(`للصورة لون "أزرق" لكن المنتج ليس له خيار لون`)
    expect(message).toContain(
      "الحقل images[1].tone: اللون يجب أن يكون رمزاً سداسياً"
    )
  })

  it("takes a photo's tone from the data, and a category's cover from its most popular product", async () => {
    vi.doMock("@/data/categories", () => ({
      categories: [
        { slug: "men", name: "رجالي" },
        { slug: "shoes", name: "أحذية", parent: "men" },
        // A cover set to a product photo keeps the tone set for that photo
        { slug: "sale", name: "عروض", image: "/images/products/red-1" },
      ],
    }))
    vi.doMock("@/data/products", () => ({
      products: [
        { ...validProduct, popularity: 10 },
        {
          ...validProduct,
          slug: "red-sneakers",
          category: "shoes",
          images: [{ src: "/images/products/red-1", tone: "#dc2626" }],
          variants: [{ sku: "T-2", price: 100, stock: 5 }],
          popularity: 50,
        },
      ],
    }))

    const catalog = await import("@/lib/catalog/catalog")
    const { toneFromHex } = await import("@/lib/tone")
    const sneakers = await catalog.getProduct("red-sneakers")
    expect(sneakers?.images[0].tone).toEqual(toneFromHex("#dc2626"))
    // The parent category shows its most popular product, which is in the subcategory
    expect((await catalog.getCategory("men"))?.image?.src).toBe(
      "/images/products/red-1"
    )
    expect((await catalog.getCategory("shoes"))?.image?.tone).toEqual(
      toneFromHex("#dc2626")
    )
    expect((await catalog.getCategory("sale"))?.image).toEqual({
      src: "/images/products/red-1",
      tone: toneFromHex("#dc2626"),
      cutout: false,
    })
  })

  it("resets a product whose sale has ended to its price before the discount", async () => {
    vi.doMock("@/data/categories", () => ({
      categories: [{ slug: "men", name: "رجالي" }],
    }))
    vi.doMock("@/data/products", () => ({
      products: [
        {
          ...validProduct,
          saleEndsAt: "2020-01-31",
          variants: [{ sku: "T-1", price: 80, compareAtPrice: 100, stock: 5 }],
        },
      ],
    }))

    const catalog = await import("@/lib/catalog/catalog")
    const [product] = await catalog.getProducts()
    expect(product.price).toBe(10000)
    expect(product.compareAtPrice).toBeNull()
    expect(product.saleEndsAt).toBeNull()
  })

  it("accepts valid data", async () => {
    vi.doMock("@/data/categories", () => ({
      categories: [{ slug: "men", name: "رجالي" }],
    }))
    vi.doMock("@/data/products", () => ({ products: [validProduct] }))

    const catalog = await import("@/lib/catalog/catalog")
    expect(
      (await catalog.getProducts()).map((product) => product.slug)
    ).toEqual(["test-shirt"])
  })
})

describe("shipping and coupon files", () => {
  it("rejects a duplicate city", async () => {
    vi.doMock("@/data/shipping", () => ({
      shipping: {
        freeShippingFrom: 300,
        cities: [
          { name: "الرياض", fee: 25, days: [1, 2] },
          { name: "الرياض", fee: 30, days: [2, 3] },
        ],
        express: { extraFee: 20, deliveryTime: "سريع" },
      },
    }))
    vi.doMock("@/data/coupons", () => ({ coupons: [] }))

    const message = await errorOf(import("@/lib/checkout/config"))
    expect(message).toContain('المدينة "الرياض" مكررة.')
  })

  it("rejects a lowercase coupon code and a discount percentage above 100", async () => {
    vi.doMock("@/data/coupons", () => ({
      coupons: [
        { code: "big", type: "fixed", value: 50, description: "خصم" },
        { code: "HALF", type: "percent", value: 150, description: "خصم" },
      ],
    }))

    const message = await errorOf(import("@/lib/checkout/config"))
    expect(message).toContain("الملف src/data/coupons.ts فيه أخطاء")
    expect(message).toContain("رمز الكوبون بأحرف إنجليزية كبيرة وأرقام فقط")
    expect(message).toContain("النسبة لا تتجاوز 100")
  })

  it("rejects fields that don't apply to the coupon type", async () => {
    vi.doMock("@/data/coupons", () => ({
      coupons: [
        {
          code: "FLAT",
          type: "fixed",
          value: 50,
          maxDiscount: 20,
          description: "خصم",
        },
        { code: "SHIP", type: "free-shipping", value: 10, description: "شحن" },
        {
          code: "ZERO",
          type: "percent",
          value: 10,
          maxDiscount: 0,
          description: "خصم",
        },
      ],
    }))

    const message = await errorOf(import("@/lib/checkout/config"))
    expect(message).toContain("أقصى خصم (maxDiscount) للكوبونات النسبية فقط")
    expect(message).toContain("كوبون الشحن المجاني لا يحتاج قيمة (value)")
    expect(message).toContain("أقصى خصم يجب أن يكون أكبر من صفر")
  })
})
