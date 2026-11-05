import { beforeEach, describe, expect, it } from "vitest"

import {
  cartSubtotal,
  lineLimit,
  MAX_LINE_QUANTITY,
  useCartStore,
  type CartLine,
} from "@/lib/state/cart"
import { useWishlistStore } from "@/lib/state/wishlist"

type NewLine = Omit<CartLine, "quantity">

const line = (fields: Partial<NewLine> & Pick<NewLine, "sku" | "name">) => ({
  slug: fields.sku.toLowerCase(),
  image: null,
  options: {},
  price: 10000,
  compareAtPrice: null,
  stock: 5,
  ...fields,
})

const shirt = line({
  sku: "SHIRT-M",
  name: "قميص قطني كلاسيكي",
  price: 12900,
  stock: 3,
})
const charger = line({
  sku: "CHARGER",
  name: "شاحن سريع 65 واط",
  price: 14900,
  stock: 50,
})

const cart = () => useCartStore.getState()
const wishlist = () => useWishlistStore.getState()

beforeEach(() => {
  useCartStore.setState({ lines: [] })
  useWishlistStore.setState({ slugs: [] })
})

describe("adding to the cart", () => {
  it("adds the quantity and returns the number of pieces actually added, given the stock", () => {
    expect(cart().add(shirt, 2)).toBe(2)
    expect(cart().add(shirt, 5)).toBe(1)
    expect(cart().add(shirt, 1)).toBe(0)
    expect(cart().lines).toEqual([{ ...shirt, quantity: 3 }])
  })

  it(`does not go over ${MAX_LINE_QUANTITY} pieces of a single variant`, () => {
    expect(cart().add(charger, 15)).toBe(MAX_LINE_QUANTITY)
    expect(lineLimit(50)).toBe(MAX_LINE_QUANTITY)
    expect(lineLimit(3)).toBe(3)
    expect(lineLimit(0)).toBe(0)
  })

  it("does not add a sold-out product", () => {
    expect(cart().add({ ...shirt, stock: 0 }, 1)).toBe(0)
    expect(cart().lines).toEqual([])
  })

  it("updates the line's data when it is added again", () => {
    cart().add(shirt, 1)
    cart().add({ ...shirt, price: 11900 }, 1)
    expect(cart().lines).toEqual([{ ...shirt, price: 11900, quantity: 2 }])
  })
})

describe("editing the cart", () => {
  it("keeps the quantity between one piece and the stock", () => {
    cart().add(shirt, 1)
    cart().setQuantity("SHIRT-M", 0)
    expect(cart().lines[0].quantity).toBe(1)
    cart().setQuantity("SHIRT-M", 99)
    expect(cart().lines[0].quantity).toBe(3)
  })

  it("removes a line and empties the cart", () => {
    cart().add(shirt, 1)
    cart().add(charger, 1)
    cart().remove("SHIRT-M")
    expect(cart().lines.map((item) => item.sku)).toEqual(["CHARGER"])
    cart().clear()
    expect(cart().lines).toEqual([])
  })

  it("adds up the cart prices in halalas", () => {
    cart().add(shirt, 2)
    cart().add(charger, 1)
    expect(cartSubtotal(cart().lines)).toBe(2 * 12900 + 14900)
  })
})

describe("syncing the cart with the site data", () => {
  it("applies the current prices and stock and reports every change", () => {
    const wallet = line({ sku: "WALLET", name: "محفظة جلدية" })
    const speaker = line({ sku: "SPEAKER", name: "سماعة بلوتوث محمولة" })
    const lamp = line({ sku: "LAMP", name: "مصباح طاولة خشبي", price: 15900 })
    cart().add(shirt, 3)
    cart().add(charger, 2)
    cart().add(wallet, 1)
    cart().add(speaker, 1)
    cart().add(lamp, 1)

    // The lines here have no options, so their options key is an empty string
    const notices = cart().sync({
      "SHIRT-M": { price: 12900, compareAtPrice: null, stock: 1, options: "" },
      CHARGER: { price: 15900, compareAtPrice: null, stock: 50, options: "" },
      SPEAKER: { price: 10000, compareAtPrice: null, stock: 0, options: "" },
      LAMP: { price: 13900, compareAtPrice: 15900, stock: 5, options: "" },
    })

    expect(notices).toEqual([
      { sku: "SHIRT-M", name: "قميص قطني كلاسيكي", kind: "reduced" },
      { sku: "CHARGER", name: "شاحن سريع 65 واط", kind: "price-up" },
      { sku: "WALLET", name: "محفظة جلدية", kind: "removed" },
      { sku: "SPEAKER", name: "سماعة بلوتوث محمولة", kind: "sold-out" },
      { sku: "LAMP", name: "مصباح طاولة خشبي", kind: "price-down" },
    ])
    expect(
      cart().lines.map(({ sku, quantity, price }) => ({ sku, quantity, price }))
    ).toEqual([
      { sku: "SHIRT-M", quantity: 1, price: 12900 },
      { sku: "CHARGER", quantity: 2, price: 15900 },
      { sku: "LAMP", quantity: 1, price: 13900 },
    ])
  })
})

describe("wishlist", () => {
  it("adds and removes, newest first", () => {
    expect(wishlist().toggle("watch")).toBe(true)
    expect(wishlist().toggle("shirt")).toBe(true)
    expect(wishlist().slugs).toEqual(["shirt", "watch"])
    expect(wishlist().toggle("watch")).toBe(false)
    expect(wishlist().slugs).toEqual(["shirt"])
  })
})
