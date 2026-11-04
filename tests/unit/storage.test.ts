import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useCartStore, type CartLine } from "@/lib/store/cart"
import { resetStorageProbe, safeStorage } from "@/lib/store/storage"
import { useWishlistStore } from "@/lib/store/wishlist"

/**
 * حفظ السلة والمفضلة في المتصفح: محفوظ تالف أو تخزين ممنوع لا يجب أن يعطّل الموقع،
 * وسلة قديمة لا تُطبَّق عليها بيانات متغير تغيّرت خياراته.
 */

const shirt: CartLine = {
  sku: "SHIRT-01",
  slug: "classic-cotton-shirt",
  name: "قميص قطني كلاسيكي",
  image: null,
  options: { المقاس: "M", اللون: "أبيض" },
  price: 12900,
  compareAtPrice: null,
  stock: 5,
  quantity: 2,
}

const cart = () => useCartStore.getState()

beforeEach(() => {
  localStorage.clear()
  resetStorageProbe()
  useCartStore.setState({ lines: [] })
  useWishlistStore.setState({ slugs: [] })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe("safeStorage", () => {
  it("يحفظ ويقرأ القيمة كما هي", () => {
    const storage = safeStorage<{ lines: CartLine[] }>()
    storage.setItem("test", { state: { lines: [shirt] }, version: 1 })
    expect(storage.getItem("test")).toEqual({
      state: { lines: [shirt] },
      version: 1,
    })
  })

  it("يحذف المحفوظ التالف بدل أن يرمي خطأ", () => {
    localStorage.setItem("test", "{not json")
    expect(safeStorage().getItem("test")).toBeNull()
    expect(localStorage.getItem("test")).toBeNull()
  })

  it("يعمل من الذاكرة حين يمنع المتصفح التخزين", () => {
    vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError")
    })
    const storage = safeStorage<{ slugs: string[] }>()
    storage.setItem("wishlist", { state: { slugs: ["watch"] }, version: 1 })
    expect(storage.getItem("wishlist")).toEqual({
      state: { slugs: ["watch"] },
      version: 1,
    })
  })
})

describe("استعادة السلة والمفضلة", () => {
  it("تستعيد الأسطر السليمة وتتجاهل التالفة", async () => {
    localStorage.setItem(
      "matjar-cart",
      JSON.stringify({
        state: {
          lines: [
            shirt,
            { ...shirt, sku: "BAD-1", quantity: 0 },
            { ...shirt, sku: "BAD-2", price: "رخيص" },
            "نص",
          ],
        },
        version: 1,
      })
    )
    await useCartStore.persist.rehydrate()
    expect(useCartStore.persist.hasHydrated()).toBe(true)
    expect(cart().lines).toEqual([shirt])
  })

  it("تكتمل الاستعادة بسلة فارغة حين يكون المحفوظ تالفاً", async () => {
    localStorage.setItem("matjar-cart", "تالف")
    await useCartStore.persist.rehydrate()
    expect(useCartStore.persist.hasHydrated()).toBe(true)
    expect(cart().lines).toEqual([])
  })

  it("تقبل من المفضلة الروابط النصية فقط دون تكرار", async () => {
    localStorage.setItem(
      "matjar-wishlist",
      JSON.stringify({
        state: { slugs: ["watch", 5, "watch", null, "shirt"] },
        version: 1,
      })
    )
    await useWishlistStore.persist.rehydrate()
    expect(useWishlistStore.getState().slugs).toEqual(["watch", "shirt"])
  })
})

describe("حماية السلة من القيم الخاطئة", () => {
  it("تتجاهل الإضافة بكمية غير صحيحة وتعديل الكمية بقيمة غير رقمية", () => {
    expect(cart().add(shirt, 0)).toBe(0)
    expect(cart().add(shirt, -2)).toBe(0)
    expect(cart().add(shirt, 1.5)).toBe(0)
    expect(cart().lines).toEqual([])

    cart().add(shirt, 2)
    cart().setQuantity(shirt.sku, Number.NaN)
    expect(cart().lines[0].quantity).toBe(2)
  })
})

describe("مطابقة السلة بعد تعديل المنتجات", () => {
  const entry = {
    price: 12900,
    compareAtPrice: null,
    stock: 5,
    options: "اللون=أبيض|المقاس=M",
  }

  it("تحذف سطراً صار رمزه يدل على خيارات أخرى", () => {
    cart().add(shirt, 1)
    const notices = cart().sync({
      [shirt.sku]: { ...entry, options: "اللون=أزرق|المقاس=S" },
    })
    expect(notices).toEqual([{ name: shirt.name, kind: "removed" }])
    expect(cart().lines).toEqual([])
  })

  it("لا تعيد كتابة السلة إن لم يتغير شيء", () => {
    cart().add(shirt, 1)
    const before = cart().lines
    expect(cart().sync({ [shirt.sku]: entry })).toEqual([])
    expect(cart().lines).toBe(before)
  })
})
