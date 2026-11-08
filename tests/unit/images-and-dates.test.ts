import { describe, expect, it } from "vitest"

import { saleEndTime, storeToday } from "@/lib/dates"
import imageLoader, { imageFile } from "@/lib/image-loader"
import { absoluteImageUrl } from "@/lib/seo"

describe("prepared image paths", () => {
  it("picks the smallest size that covers the requested width", () => {
    expect(imageFile("/images/products/shirt-1", 160)).toBe(
      "/images/products/shirt-1-200.webp"
    )
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

  it("leaves files with an extension and full URLs as they are", () => {
    expect(imageFile("/images/logo.png", 800)).toBe("/images/logo.png")
    expect(imageFile("https://cdn.example.com/a.jpg", 800)).toBe(
      "https://cdn.example.com/a.jpg"
    )
  })

  it("makes the loader add the width to external URLs and leave data images as they are", () => {
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

  it("uses the largest version with a full URL for share images and structured data", () => {
    expect(absoluteImageUrl("/images/products/shirt-1")).toMatch(
      /^https?:\/\/[^/]+\/images\/products\/shirt-1-1200\.webp$/
    )
    expect(absoluteImageUrl(UPLOADED)).toBe(`${UPLOADED}-1200.webp`)
  })

  it("picks the sizes of a photo uploaded to Supabase Storage like a local one", () => {
    expect(imageFile(UPLOADED, 300)).toBe(`${UPLOADED}-400.webp`)
    expect(imageLoader({ src: UPLOADED, width: 1500 })).toBe(
      `${UPLOADED}-1200.webp`
    )
  })
})

/** An uploaded photo's address, without its size (src/lib/admin/uploads.ts) */
const UPLOADED =
  "https://project.supabase.co/storage/v1/object/public/product-images/products/0b8e4f4c-7a51-4c11-9d0e-3f1f6f3d2a10"

describe("store date", () => {
  // The store's time zone in the settings is +03:00
  it("computes the day in the store's time zone, not in UTC", () => {
    expect(storeToday(Date.parse("2026-11-04T22:30:00Z"))).toBe("2026-11-05")
    expect(storeToday(Date.parse("2026-11-04T20:59:00Z"))).toBe("2026-11-04")
  })

  it("ends a sale at the last second of its day in the store's time zone", () => {
    expect(saleEndTime("2026-11-20")).toBe(Date.parse("2026-11-20T20:59:59Z"))
  })
})
