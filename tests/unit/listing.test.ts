import { describe, expect, it } from "vitest"

import {
  countActiveFilters,
  fromURLSearchParams,
  listingHref,
  parseListingParams,
  sortOptionsFor,
  toSearchParams,
  type ListingParams,
} from "@/lib/catalog/listing"

const defaults = parseListingParams({})
const withParams = (changes: Partial<ListingParams>): ListingParams => ({
  ...defaults,
  ...changes,
})

describe("parseListingParams", () => {
  it("returns the default values for a URL without parameters", () => {
    expect(defaults).toEqual({
      q: "",
      category: null,
      minPrice: null,
      maxPrice: null,
      options: {},
      inStock: false,
      onSale: false,
      sort: "popular",
      page: 1,
    })
  })

  it("reads the search and the filters from the URL", () => {
    const params = parseListingParams({
      q: "  قميص  ",
      category: "men",
      min: "50",
      max: "300",
      o: ["اللون:أزرق", "المقاس:M"],
      stock: "1",
      sale: "1",
      sort: "price-asc",
      page: "2",
    })
    expect(params).toEqual({
      q: "قميص",
      category: "men",
      minPrice: 50,
      maxPrice: 300,
      options: { اللون: ["أزرق"], المقاس: ["M"] },
      inStock: true,
      onSale: true,
      sort: "price-asc",
      page: 2,
    })
  })

  it("ignores invalid values instead of showing an error", () => {
    const params = parseListingParams({
      category: "Men!",
      min: "-5",
      max: "12.5",
      sort: "cheapest",
      page: "0",
      stock: "true",
    })
    expect(params).toMatchObject({
      category: null,
      minPrice: null,
      maxPrice: null,
      sort: "popular",
      page: 1,
      inStock: false,
    })
  })

  it("swaps the price bounds if the minimum is greater than the maximum", () => {
    expect(parseListingParams({ min: "300", max: "50" })).toMatchObject({
      minPrice: 50,
      maxPrice: 300,
    })
  })

  it("collects the values of one option without duplicates and ignores incomplete entries", () => {
    const params = parseListingParams({
      o: [
        "اللون:أزرق",
        "اللون:أحمر",
        "اللون:أزرق",
        "بلا-فاصل",
        ":أحمر",
        "المقاس:",
      ],
    })
    expect(params.options).toEqual({ اللون: ["أزرق", "أحمر"] })
  })

  it("sorts by relevance only when there is a search", () => {
    expect(parseListingParams({ sort: "relevance" }).sort).toBe("popular")
    expect(parseListingParams({ q: "ساعة" }).sort).toBe("relevance")
    expect(sortOptionsFor("").map((option) => option.value)).not.toContain(
      "relevance"
    )
    expect(sortOptionsFor("ساعة").map((option) => option.value)).toContain(
      "relevance"
    )
  })
})

describe("listing URLs", () => {
  it("drops the default values so the URL stays short", () => {
    expect(listingHref("/products/", defaults)).toBe("/products/")
    expect(listingHref("/products/", defaults, { onSale: true })).toBe(
      "/products/?sale=1"
    )
    expect(listingHref("/products/", defaults, { sort: "popular" })).toBe(
      "/products/"
    )
  })

  it("goes back to the first page when any filter changes", () => {
    const onPage3 = withParams({ page: 3 })
    expect(listingHref("/products/", onPage3, { inStock: true })).toBe(
      "/products/?stock=1"
    )
    expect(listingHref("/products/", onPage3, { page: 4 })).toBe(
      "/products/?page=4"
    )
  })

  it("keeps the search and the Arabic options intact in a round trip", () => {
    const params = withParams({
      q: "قميص",
      options: { اللون: ["أزرق", "أبيض"] },
      minPrice: 50,
    })
    const search = new URLSearchParams(toSearchParams(params).toString())
    expect(parseListingParams(fromURLSearchParams(search))).toEqual(params)
  })

  it("counts the active filters for the filter button", () => {
    expect(countActiveFilters(defaults)).toBe(0)
    expect(
      countActiveFilters(
        withParams({
          category: "men",
          minPrice: 50,
          maxPrice: 300,
          options: { اللون: ["أزرق", "أبيض"], المقاس: ["M"] },
          inStock: true,
          onSale: true,
        })
      )
    ).toBe(7)
  })
})
