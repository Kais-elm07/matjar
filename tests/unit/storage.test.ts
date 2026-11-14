import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useCartStore, type CartLine } from "@/modules/cart/store"
import { resetStorageProbe, safeStorage } from "@/lib/state/storage"
import { useWishlistStore } from "@/modules/wishlist/store"

/**
 * Saving the cart and wishlist in the browser: a corrupt save or blocked storage must not break the site,
 * and an old cart must not get the data of a variant whose options have changed.
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
  it("saves and reads the value as it is", () => {
    const storage = safeStorage()
    storage.setItem("test", { state: { lines: [shirt] }, version: 1 })
    expect(storage.getItem("test")).toEqual({
      state: { lines: [shirt] },
      version: 1,
    })
  })

  it("removes a corrupt save instead of throwing", () => {
    localStorage.setItem("test", "{not json")
    expect(safeStorage().getItem("test")).toBeNull()
    expect(localStorage.getItem("test")).toBeNull()
  })

  it("removes a save that is JSON but not an object", () => {
    localStorage.setItem("test", "[1, 2]")
    expect(safeStorage().getItem("test")).toBeNull()
    expect(localStorage.getItem("test")).toBeNull()
  })

  it("works from memory when the browser blocks storage", () => {
    vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError")
    })
    const storage = safeStorage()
    storage.setItem("wishlist", { state: { slugs: ["watch"] }, version: 1 })
    expect(storage.getItem("wishlist")).toEqual({
      state: { slugs: ["watch"] },
      version: 1,
    })
  })
})

describe("restoring the cart and wishlist", () => {
  it("restores the valid lines and ignores the corrupt ones", async () => {
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

  it("finishes restoring with an empty cart when the save is corrupt", async () => {
    localStorage.setItem("matjar-cart", "تالف")
    await useCartStore.persist.rehydrate()
    expect(useCartStore.persist.hasHydrated()).toBe(true)
    expect(cart().lines).toEqual([])
  })

  it("accepts only string slugs in the wishlist, without duplicates", async () => {
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
