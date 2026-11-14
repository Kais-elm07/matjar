import { beforeEach, describe, expect, it } from "vitest"

import { useWishlistStore } from "@/modules/wishlist/store"

const wishlist = () => useWishlistStore.getState()

beforeEach(() => {
  useWishlistStore.setState({ slugs: [] })
})

describe("wishlist", () => {
  it("adds and removes, newest first", () => {
    expect(wishlist().toggle("watch")).toBe(true)
    expect(wishlist().toggle("shirt")).toBe(true)
    expect(wishlist().slugs).toEqual(["shirt", "watch"])
    expect(wishlist().toggle("watch")).toBe(false)
    expect(wishlist().slugs).toEqual(["shirt"])
  })

  it("drops the saved products that are no longer in the store", () => {
    useWishlistStore.setState({ slugs: ["shirt", "gone", "watch"] })
    expect(wishlist().prune(new Set(["watch", "shirt", "rug"]))).toBe(1)
    expect(wishlist().slugs).toEqual(["shirt", "watch"])
    // Nothing left to drop: the list is not written again
    const { slugs } = wishlist()
    expect(wishlist().prune(new Set(["watch", "shirt"]))).toBe(0)
    expect(wishlist().slugs).toBe(slugs)
  })
})
