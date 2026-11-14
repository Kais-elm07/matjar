import { describe, expect, it } from "vitest"

import { getSearchIndex } from "@/modules/catalog/queries"
import type { SearchCardData } from "@/modules/catalog/types"
import {
  computeFacets,
  filterCards,
  paginate,
  sortCards,
} from "@/lib/listing/filter"
import { parseListingParams, type ListingParams } from "@/lib/listing/params"
import { normalizeForSearch } from "@/lib/search/normalize"
import { searchCards } from "@/lib/search/search-cards"

function card(
  fields: Partial<SearchCardData> & Pick<SearchCardData, "slug" | "name">
): SearchCardData {
  const merged = {
    price: 10000,
    compareAtPrice: null,
    priceVaries: false,
    inStock: true,
    image: null,
    categoryName: null,
    quickAdd: null,
    saleEndsAt: null,
    categorySlugs: [],
    variants: [{ options: {}, inStock: true }],
    popularity: 0,
    createdAt: "2026-10-01",
    ...fields,
  }
  return {
    ...merged,
    searchText: fields.searchText ?? normalizeForSearch(merged.name),
  }
}

const shirt = card({
  slug: "shirt",
  name: "قميص قطني كلاسيكي",
  price: 12900,
  compareAtPrice: 15900,
  categorySlugs: ["clothing", "men"],
  popularity: 50,
  createdAt: "2026-09-01",
  variants: [
    { options: { المقاس: "M", اللون: "أبيض" }, inStock: true },
    { options: { المقاس: "L", اللون: "أزرق" }, inStock: false },
  ],
})
const watch = card({
  slug: "watch",
  name: "ساعة يد كلاسيكية",
  price: 44900,
  compareAtPrice: 54900,
  categorySlugs: ["bags-accessories"],
  popularity: 80,
  createdAt: "2026-10-10",
  variants: [
    { options: { اللون: "فضي" }, inStock: true },
    { options: { اللون: "ذهبي" }, inStock: true },
  ],
})
const earbuds = card({
  slug: "earbuds",
  name: "سماعات لاسلكية بعزل الضوضاء",
  price: 39900,
  categorySlugs: ["electronics", "audio"],
  popularity: 90,
  createdAt: "2026-10-20",
  variants: [{ options: { اللون: "أسود" }, inStock: true }],
})
const beardKit = card({
  slug: "beard-kit",
  name: "مجموعة العناية باللحية",
  price: 11900,
  inStock: false,
  categorySlugs: ["beauty"],
  popularity: 10,
  createdAt: "2026-08-01",
  variants: [{ options: {}, inStock: false }],
})

const cards = [shirt, watch, earbuds, beardKit]
const params = (changes: Partial<ListingParams> = {}): ListingParams => ({
  ...parseListingParams({}),
  ...changes,
})
const slugs = (list: { slug: string }[]) => list.map((item) => item.slug)

describe("searchCards", () => {
  it("finds the product even when taa marbuta is spelled differently", () => {
    expect(slugs(searchCards(cards, "ساعه"))).toEqual(["watch"])
    expect(slugs(searchCards(cards, "سماعات لاسلكيه"))).toEqual(["earbuds"])
  })

  it("requires every search word to be present", () => {
    expect(searchCards(cards, "قميص فضي")).toEqual([])
  })

  it("ranks names that start with the search first, then the best sellers", () => {
    const hanger = card({
      slug: "hanger",
      name: "علاقة قميص خشبية",
      popularity: 99,
    })
    const plain = card({
      slug: "plain-shirt",
      name: "قميص سادة",
      popularity: 1,
    })
    expect(slugs(searchCards([hanger, plain], "قميص"))).toEqual([
      "plain-shirt",
      "hanger",
    ])
    expect(slugs(searchCards(cards, "كلاسيكي"))).toEqual(["watch", "shirt"])
  })

  it("returns nothing for an empty search", () => {
    expect(searchCards(cards, "   ")).toEqual([])
  })
})

describe("filterCards", () => {
  it("filters by category, including its subcategories", () => {
    expect(slugs(filterCards(cards, params({ category: "clothing" })))).toEqual(
      ["shirt"]
    )
    expect(slugs(filterCards(cards, params({ category: "audio" })))).toEqual([
      "earbuds",
    ])
  })

  it("filters by a price range in riyals", () => {
    expect(
      slugs(filterCards(cards, params({ minPrice: 120, maxPrice: 400 })))
    ).toEqual(["shirt", "earbuds"])
  })

  it("filters in-stock only and on-sale only", () => {
    expect(slugs(filterCards(cards, params({ inStock: true })))).toEqual([
      "shirt",
      "watch",
      "earbuds",
    ])
    expect(slugs(filterCards(cards, params({ onSale: true })))).toEqual([
      "shirt",
      "watch",
    ])
  })

  it("requires a single variant to match all the chosen options together", () => {
    expect(
      slugs(filterCards(cards, params({ options: { اللون: ["أزرق"] } })))
    ).toEqual(["shirt"])
    expect(
      filterCards(
        cards,
        params({ options: { المقاس: ["M"], اللون: ["أزرق"] } })
      )
    ).toEqual([])
  })

  it("excludes a sold-out option when in-stock only is on", () => {
    expect(
      filterCards(
        cards,
        params({ options: { اللون: ["أزرق"] }, inStock: true })
      )
    ).toEqual([])
  })
})

describe("sortCards", () => {
  it("sorts by price, newest and best selling", () => {
    expect(slugs(sortCards(cards, "price-asc"))).toEqual([
      "beard-kit",
      "shirt",
      "earbuds",
      "watch",
    ])
    expect(slugs(sortCards(cards, "price-desc"))).toEqual([
      "watch",
      "earbuds",
      "shirt",
      "beard-kit",
    ])
    expect(slugs(sortCards(cards, "newest"))).toEqual([
      "earbuds",
      "watch",
      "shirt",
      "beard-kit",
    ])
    expect(slugs(sortCards(cards, "popular"))).toEqual([
      "earbuds",
      "watch",
      "shirt",
      "beard-kit",
    ])
  })

  it("keeps the search order for relevance and does not change the original list", () => {
    const original = [...cards]
    expect(sortCards(cards, "relevance")).toEqual(cards)
    sortCards(cards, "price-asc")
    expect(cards).toEqual(original)
  })
})

describe("paginate", () => {
  const numbers = Array.from({ length: 25 }, (_, index) => index + 1)

  it("splits the list into pages", () => {
    expect(paginate(numbers, 2, 10)).toEqual({
      items: numbers.slice(10, 20),
      page: 2,
      pageCount: 3,
      total: 25,
    })
  })

  it("keeps the page number between the first page and the last", () => {
    expect(paginate(numbers, 9, 10)).toMatchObject({
      page: 3,
      items: [21, 22, 23, 24, 25],
    })
    expect(paginate(numbers, 0, 10).page).toBe(1)
    expect(paginate([], 1, 10)).toEqual({
      items: [],
      page: 1,
      pageCount: 1,
      total: 0,
    })
  })
})

describe("computeFacets", () => {
  it("computes the price range and the number of products in each category", () => {
    const facets = computeFacets(cards)
    expect(facets.priceRange).toEqual({ min: 119, max: 449 })
    expect(facets.categoryCounts).toMatchObject({
      clothing: 1,
      men: 1,
      electronics: 1,
      audio: 1,
      beauty: 1,
    })
  })

  it("collects the option values and puts colors last, with their shades", () => {
    const { options } = computeFacets(cards)
    expect(options.map((option) => option.name)).toEqual(["المقاس", "اللون"])
    expect(options[0].values.map((entry) => entry.value)).toEqual(["M", "L"])
    expect(options[1].isColor).toBe(true)
    expect(options[1].values.find((entry) => entry.value === "أزرق")).toEqual({
      value: "أزرق",
      count: 1,
      color: "#2563eb",
    })
  })

  it("returns no values for an empty list", () => {
    expect(computeFacets([])).toEqual({
      priceRange: null,
      options: [],
      categoryCounts: {},
    })
  })
})

const all = await getSearchIndex()

describe("searching the actual store products", () => {
  it.each([
    ["ساعه", "classic-wrist-watch"],
    ["القميص", "classic-cotton-shirt"],
    ["شاحن ٦٥", "fast-charger-65w"],
    ["عطر", "oud-perfume"],
  ])("'%s' finds %s", (query, slug) => {
    expect(slugs(searchCards(all, query))).toContain(slug)
  })
})
