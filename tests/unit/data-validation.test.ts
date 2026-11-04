import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

/**
 * التحقق من ملفات البيانات وقت البناء: نستبدل ملفات src/data بنسخ فيها أخطاء،
 * ونتأكد أن البناء يتوقف برسالة عربية تدل صاحب المتجر على كل خطأ.
 */

const validProduct = {
  slug: "test-shirt",
  name: "قميص تجريبي",
  category: "men",
  images: [{ src: "/images/products/test-shirt-1" }],
  variants: [{ sku: "T-1", price: 100, stock: 5 }],
  createdAt: "2026-10-01",
}

/** رسالة الخطأ عند تحميل الوحدة، أو نص فارغ إن حُمّلت دون خطأ. */
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

describe("ملفات المنتجات والفئات", () => {
  it("يجمع كل أخطاء المنتجات في رسالة عربية واحدة", async () => {
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

    const message = await errorOf(import("@/lib/catalog/catalog"))
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

  it("يكتشف الفئة الأم المفقودة والتسلسل الدائري", async () => {
    vi.doMock("@/data/categories", () => ({
      categories: [
        { slug: "men", name: "رجالي" },
        { slug: "kids", name: "أطفال", parent: "family" },
        { slug: "a", name: "أ", parent: "b" },
        { slug: "b", name: "ب", parent: "a" },
      ],
    }))
    vi.doMock("@/data/products", () => ({ products: [validProduct] }))

    const message = await errorOf(import("@/lib/catalog/catalog"))
    expect(message).toContain('الفئة "kids": الفئة الأم "family" غير موجودة.')
    expect(message).toContain('الفئة "a": تسلسل الفئات الأم دائري.')
  })

  it("يرفض التواريخ غير الموجودة والأسعار بكسور زائدة والمتغيرات المكررة", async () => {
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
      ],
    }))

    const message = await errorOf(import("@/lib/catalog/catalog"))
    expect(message).toContain("الحقل createdAt: التاريخ غير موجود في التقويم")
    expect(message).toContain("الحقل variants[1].price")
    expect(message).toContain(`المتغير "T-4" يكرر خيارات متغير آخر`)
    expect(message).toContain(`للصورة لون "أزرق" لكن المنتج ليس له خيار لون`)
  })

  it("يعيد منتج العرض المنتهي إلى سعره قبل الخصم", async () => {
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
    const [product] = catalog.getProducts()
    expect(product.price).toBe(10000)
    expect(product.compareAtPrice).toBeNull()
    expect(product.saleEndsAt).toBeNull()
  })

  it("يقبل بيانات صحيحة", async () => {
    vi.doMock("@/data/categories", () => ({
      categories: [{ slug: "men", name: "رجالي" }],
    }))
    vi.doMock("@/data/products", () => ({ products: [validProduct] }))

    const catalog = await import("@/lib/catalog/catalog")
    expect(catalog.getProducts().map((product) => product.slug)).toEqual([
      "test-shirt",
    ])
  })
})

describe("ملفا الشحن والكوبونات", () => {
  it("يرفض مدينة مكررة", async () => {
    vi.doMock("@/data/shipping", () => ({
      shipping: {
        freeShippingFrom: 300,
        cities: [
          { name: "الرياض", fee: 25, days: [1, 2] },
          { name: "الرياض", fee: 30, days: [2, 3] },
        ],
        express: { extraFee: 20, label: "سريع" },
      },
    }))
    vi.doMock("@/data/coupons", () => ({ coupons: [] }))

    const message = await errorOf(import("@/lib/checkout/config"))
    expect(message).toContain('المدينة "الرياض" مكررة.')
  })

  it("يرفض رمز كوبون بأحرف صغيرة ونسبة خصم فوق 100", async () => {
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

  it("يرفض حقولاً لا تنطبق على نوع الكوبون", async () => {
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
