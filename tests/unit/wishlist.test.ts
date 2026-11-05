import { beforeEach, describe, expect, it } from "vitest"

import { useWishlistStore } from "@/lib/state/wishlist"

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
})
