import { beforeEach, describe, expect, it, vi } from "vitest"

import type { SimilarProduct, SimilarProducts } from "@/lib/catalog/types"
import { basketItems } from "@/lib/mascot/basket"
import {
  announceAddedProduct,
  listenForAddedProducts,
} from "@/lib/mascot/events"
import { mascotPhrases } from "@/lib/mascot/messages"
import { personaFor, showsCart } from "@/lib/mascot/persona"
import { pickSuggestions } from "@/lib/mascot/suggestions"
import { useMascotPreferences } from "@/lib/state/mascot"

const product = (slug: string): SimilarProduct => ({
  slug,
  name: slug,
  price: 10000,
  compareAtPrice: null,
  priceVaries: false,
  quickAdd: { sku: slug.toUpperCase(), stock: 5 },
  image: null,
})

describe("Najm's persona on each page", () => {
  it("knows the page from its address, with or without the trailing slash", () => {
    expect(personaFor("/")).toBe("welcome")
    expect(personaFor("/products/")).toBe("shopping")
    expect(personaFor("/category/electronics/")).toBe("shopping")
    expect(personaFor("/product/portable-speaker")).toBe("shopping")
    expect(personaFor("/search/")).toBe("shopping")
    expect(personaFor("/wishlist/")).toBe("shopping")
    expect(personaFor("/cart/")).toBe("cart")
    expect(personaFor("/checkout")).toBe("checkout")
    expect(personaFor("/checkout/success/")).toBe("order-placed")
    expect(personaFor("/pages/faq/")).toBe("elsewhere")
  })

  it("brings his cart only where products are bought", () => {
    expect(showsCart(personaFor("/"))).toBe(false)
    expect(showsCart(personaFor("/pages/about/"))).toBe(false)
    expect(showsCart(personaFor("/products/"))).toBe(true)
    expect(showsCart(personaFor("/cart/"))).toBe(true)
    expect(showsCart(personaFor("/checkout/success/"))).toBe(true)
  })
})

describe("Najm's suggestions", () => {
  const similar: SimilarProducts = {
    headset: [product("earbuds"), product("speaker"), product("power-bank")],
  }

  it("suggests similar products that aren't in the cart, two at most", () => {
    expect(
      pickSuggestions(similar, "headset", new Set()).map((item) => item.slug)
    ).toEqual(["earbuds", "speaker"])
    expect(
      pickSuggestions(similar, "headset", new Set(["earbuds"])).map(
        (item) => item.slug
      )
    ).toEqual(["speaker", "power-bank"])
  })

  it("suggests nothing for an unknown product", () => {
    expect(pickSuggestions(similar, "unknown", new Set())).toEqual([])
  })
})

describe("telling Najm about an added product", () => {
  const added = {
    sku: "WATCH",
    slug: "watch",
    name: "ساعة",
    image: null,
    origin: null,
  }

  it("returns false while Najm isn't listening, so the cart panel opens instead", () => {
    expect(announceAddedProduct(added)).toBe(false)
  })

  it("reaches Najm while he listens, and stops when he leaves", () => {
    const listener = vi.fn()
    const stop = listenForAddedProducts(listener)
    expect(announceAddedProduct(added)).toBe(true)
    expect(listener).toHaveBeenCalledWith(added)
    stop()
    expect(announceAddedProduct(added)).toBe(false)
  })
})

describe("Najm's basket", () => {
  it("draws the small photo of every cart line that has one", () => {
    expect(
      basketItems([
        {
          sku: "SPEAKER",
          image: { src: "/images/products/portable-speaker-1", alt: "" },
        },
        { sku: "NO-PHOTO", image: null },
      ])
    ).toEqual([
      { sku: "SPEAKER", photo: "/images/products/portable-speaker-1-200.webp" },
    ])
  })
})

describe("Najm's sentences", () => {
  it("counts the cart's pieces with the right Arabic plural", () => {
    expect(mascotPhrases.cart(0)).toContain("فارغة")
    expect(mascotPhrases.cart(1)).toContain("قطعة واحدة")
    expect(mascotPhrases.cart(3)).toContain("3 قطع")
  })
})

describe("showing or hiding Najm", () => {
  beforeEach(() => {
    localStorage.clear()
    useMascotPreferences.setState({ hidden: false })
  })

  it("saves the visitor's choice in the browser and restores it", async () => {
    useMascotPreferences.getState().setHidden(true)
    expect(localStorage.getItem("matjar-mascot")).toContain('"hidden":true')
    await useMascotPreferences.persist.rehydrate()
    expect(useMascotPreferences.getState().hidden).toBe(true)
  })

  it("shows Najm when the saved choice is missing or damaged", async () => {
    localStorage.setItem(
      "matjar-mascot",
      JSON.stringify({ state: { hidden: "yes" }, version: 1 })
    )
    await useMascotPreferences.persist.rehydrate()
    expect(useMascotPreferences.getState().hidden).toBe(false)
  })
})
