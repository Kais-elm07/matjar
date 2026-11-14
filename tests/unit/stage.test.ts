import { describe, expect, it } from "vitest"

import { buildCatalog } from "@/modules/catalog/build"
import { isImageMeta } from "@/modules/catalog/guards"
import { parseImageMeta } from "@/modules/catalog/image-meta"
import { productRows } from "@/modules/catalog/rows"
import { productSchema } from "@/modules/catalog/schema"
import { slidePosition, slideTurn, toneBlend } from "@/lib/slider"
import {
  BRAND_TONE,
  toneColor,
  toneFromHex,
  TONE_LIGHTNESS,
  toneStyle,
} from "@/lib/tone"

/** The contrast between two sRGB hex colors, as WCAG computes it. */
function contrast(first: string, second: string) {
  const luminance = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((start) => {
      const value = Number.parseInt(hex.slice(start, start + 2), 16) / 255
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const [light, dark] = [luminance(first), luminance(second)].sort(
    (a, b) => b - a
  )
  return (light + 0.05) / (dark + 0.05)
}

/** Every hue in steps of 5 degrees, at the strongest light a tone can have */
const strongestTones = Array.from({ length: 72 }, (_, step) => ({
  hue: step * 5,
  chroma: 0.14,
}))

describe("the product's tone", () => {
  it("turns a color into its hue, keeping the strength between a faint tint and a strong light", () => {
    const red = toneFromHex("#dc2626")
    expect(red?.hue).toBeGreaterThan(20)
    expect(red?.hue).toBeLessThan(35)
    expect(red?.chroma).toBeLessThanOrEqual(0.14)
    // A brownish leather is muted, but still has its own light
    expect(toneFromHex("#a35a2c")?.chroma).toBeGreaterThanOrEqual(0.05)
  })

  it("gives the store's blue to a gray, and nothing to a color that isn't a six-digit hex", () => {
    expect(toneFromHex("#8a8a8a")).toEqual(BRAND_TONE)
    expect(toneFromHex("orange")).toBeNull()
    expect(toneFromHex("#fff")).toBeNull()
    expect(BRAND_TONE.hue).toBeGreaterThan(255)
    expect(BRAND_TONE.hue).toBeLessThan(268)
  })

  it("keeps white text readable on the light of every hue (DESIGN.md: at least 7:1)", () => {
    for (const tone of strongestTones) {
      const light = toneColor(tone)
      expect(contrast("#ffffff", light), `hue ${tone.hue}`).toBeGreaterThan(7)
    }
  })

  it("keeps a large blue price readable where text sits on a stage (3:1 for large text)", () => {
    for (const tone of strongestTones) {
      const textSide = toneColor(tone, 0.3)
      expect(contrast("#4f8cff", textSide), `hue ${tone.hue}`).toBeGreaterThan(
        3
      )
    }
  })

  it("draws a tone as a color the screen can show, at the stage's lightness", () => {
    for (const tone of strongestTones) {
      expect(toneColor(tone)).toMatch(/^#[0-9a-f]{6}$/)
    }
    expect(TONE_LIGHTNESS).toBe(0.4)
  })

  it("sets the CSS variables the stage styles read", () => {
    expect(toneStyle({ hue: 39, chroma: 0.13 })).toEqual({
      "--tone-h": 39,
      "--tone-c": 0.13,
    })
  })
})

describe("the photo colors that pnpm images measures", () => {
  const meta = {
    "/images/products/wallet-1": { color: "#a35a2c", cutout: true },
    "/images/products/speaker-1": { color: null, cutout: true },
  }

  it("accepts the file's shape and rejects anything else", () => {
    expect(isImageMeta(meta)).toBe(true)
    expect(isImageMeta({ "/images/x": { color: 3, cutout: true } })).toBe(false)
    expect(isImageMeta({ "/images/x": { color: null } })).toBe(false)
    expect(isImageMeta([])).toBe(false)
  })

  it("reads the file's colors, and stops at a broken file", () => {
    expect(parseImageMeta(JSON.stringify(meta))).toEqual(meta)
    expect(() => parseImageMeta("{ not json")).toThrow("pnpm images")
    expect(() => parseImageMeta("[]")).toThrow("pnpm images")
  })

  it("gives each photo its measured tone, the owner's tone first, and the store's blue without a color", () => {
    const product = productSchema.parse({
      slug: "photos",
      name: "صور",
      category: "men",
      images: [
        { src: "/images/products/wallet-1" },
        { src: "/images/products/speaker-1" },
        { src: "/images/products/speaker-1", tone: "#16a34a" },
        // A photo pnpm images hasn't measured is framed, in the store's blue
        { src: "https://cdn.example.com/a.jpg" },
      ],
      variants: [{ sku: "P-1", price: 10, stock: 1 }],
      createdAt: "2026-10-01",
    })
    const catalog = buildCatalog(
      {
        categories: [
          {
            slug: "men",
            name: "رجالي",
            description: null,
            imageSrc: null,
            parentSlug: null,
            position: 0,
          },
        ],
        products: productRows([product], meta),
      },
      "2026-11-07"
    )
    expect(
      catalog.products[0].images.map(({ tone, cutout }) => ({ tone, cutout }))
    ).toEqual([
      { tone: toneFromHex("#a35a2c"), cutout: true },
      { tone: BRAND_TONE, cutout: true },
      { tone: toneFromHex("#16a34a"), cutout: true },
      { tone: BRAND_TONE, cutout: false },
    ])
  })
})

describe("the stage's swipe", () => {
  it("counts the scroll position in slides, in both directions", () => {
    expect(slidePosition(0, 400)).toBe(0)
    expect(slidePosition(-600, 400)).toBe(1.5)
    expect(slidePosition(600, 400)).toBe(1.5)
    expect(slidePosition(-600, 0)).toBe(0)
  })

  it("turns the slides away on either side of the one in view, mirrored in the Arabic direction", () => {
    // Halfway from the first slide to the second, right to left
    expect(slideTurn(0, 0.5, true)).toBe(0.5)
    expect(slideTurn(1, 0.5, true)).toBe(-0.5)
    expect(slideTurn(1, 0.5, false)).toBe(0.5)
    // A slide far away stops at a full turn
    expect(slideTurn(5, 0, true)).toBe(-1)
    expect(slideTurn(2, 2, true)).toBeCloseTo(0)
  })

  it("blends the light from the slide in view into the next one as the swipe moves", () => {
    expect(toneBlend(0, 3)).toEqual({ from: 0, to: 1, amount: 0 })
    expect(toneBlend(1.25, 3)).toEqual({ from: 1, to: 2, amount: 0.25 })
    // A swipe that stops a hair short of a slide shows that slide's tone alone
    expect(toneBlend(0.997, 3)).toEqual({ from: 1, to: 2, amount: 0 })
    // On the last slide there is nothing to blend into
    expect(toneBlend(2, 3)).toEqual({ from: 2, to: 2, amount: 0 })
  })
})
