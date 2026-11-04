import { describe, expect, it } from "vitest"

import { saleEndTime, storeToday } from "@/lib/catalog/dates"
import imageLoader, { imageFile } from "@/lib/image-loader"
import { absoluteImageUrl } from "@/lib/seo"

describe("مسارات الصور المجهزة", () => {
  it("يختار أصغر حجم يكفي العرض المطلوب", () => {
    expect(imageFile("/images/products/shirt-1", 300)).toBe(
      "/images/products/shirt-1-400.webp"
    )
    expect(imageFile("/images/products/shirt-1", 640)).toBe(
      "/images/products/shirt-1-800.webp"
    )
    expect(imageFile("/images/products/shirt-1", 1500)).toBe(
      "/images/products/shirt-1-1200.webp"
    )
  })

  it("يترك الملفات ذات الامتداد والروابط الكاملة كما هي", () => {
    expect(imageFile("/images/logo.png", 800)).toBe("/images/logo.png")
    expect(imageFile("https://cdn.example.com/a.jpg", 800)).toBe(
      "https://cdn.example.com/a.jpg"
    )
  })

  it("المحمّل يضيف العرض للروابط الخارجية ويترك صور data كما هي", () => {
    expect(
      imageLoader({ src: "https://cdn.example.com/a.jpg", width: 400 })
    ).toBe("https://cdn.example.com/a.jpg?w=400")
    expect(imageLoader({ src: "data:image/png;base64,AAAA", width: 400 })).toBe(
      "data:image/png;base64,AAAA"
    )
    expect(imageLoader({ src: "/images/products/shirt-1", width: 800 })).toBe(
      "/images/products/shirt-1-800.webp"
    )
  })

  it("صور المشاركة والبيانات المنظمة تستخدم أكبر نسخة برابط كامل", () => {
    expect(absoluteImageUrl("/images/products/shirt-1")).toMatch(
      /^https?:\/\/[^/]+\/images\/products\/shirt-1-1200\.webp$/
    )
  })
})

describe("تاريخ المتجر", () => {
  // توقيت المتجر في الإعدادات +03:00
  it("يحسب اليوم بتوقيت المتجر لا بتوقيت UTC", () => {
    expect(storeToday(Date.parse("2026-11-04T22:30:00Z"))).toBe("2026-11-05")
    expect(storeToday(Date.parse("2026-11-04T20:59:00Z"))).toBe("2026-11-04")
  })

  it("ينتهي العرض في آخر ثانية من يومه بتوقيت المتجر", () => {
    expect(saleEndTime("2026-11-20")).toBe(Date.parse("2026-11-20T20:59:59Z"))
  })
})
