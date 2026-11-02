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
  it("يعطي القيم الافتراضية لرابط بلا معاملات", () => {
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

  it("يقرأ البحث والفلاتر من الرابط", () => {
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

  it("يتجاهل القيم غير الصالحة بدل إظهار خطأ", () => {
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

  it("يبدّل حدّي السعر إن جاء الأقل أكبر من الأعلى", () => {
    expect(parseListingParams({ min: "300", max: "50" })).toMatchObject({
      minPrice: 50,
      maxPrice: 300,
    })
  })

  it("يجمع قيم الخيار الواحد دون تكرار ويتجاهل الصيغ الناقصة", () => {
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

  it("لا يرتب حسب الصلة إلا مع البحث", () => {
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

describe("روابط القوائم", () => {
  it("يحذف القيم الافتراضية فيبقى الرابط قصيراً", () => {
    expect(listingHref("/products/", defaults)).toBe("/products/")
    expect(listingHref("/products/", defaults, { onSale: true })).toBe(
      "/products/?sale=1"
    )
    expect(listingHref("/products/", defaults, { sort: "popular" })).toBe(
      "/products/"
    )
  })

  it("يعيد إلى الصفحة الأولى عند تغيير أي فلتر", () => {
    const onPage3 = withParams({ page: 3 })
    expect(listingHref("/products/", onPage3, { inStock: true })).toBe(
      "/products/?stock=1"
    )
    expect(listingHref("/products/", onPage3, { page: 4 })).toBe(
      "/products/?page=4"
    )
  })

  it("يحافظ على البحث والخيارات العربية ذهاباً وإياباً", () => {
    const params = withParams({
      q: "قميص",
      options: { اللون: ["أزرق", "أبيض"] },
      minPrice: 50,
    })
    const search = new URLSearchParams(toSearchParams(params).toString())
    expect(parseListingParams(fromURLSearchParams(search))).toEqual(params)
  })

  it("يعدّ الفلاتر المفعّلة لزر التصفية", () => {
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
