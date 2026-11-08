import { PHASE_PRODUCTION_BUILD } from "next/constants"
import { afterEach, describe, expect, it, vi } from "vitest"

import { shareImageOutsideBuild, sharePhoto } from "@/lib/og/render"
import { shareImages } from "@/lib/seo"

/**
 * The photos of the share images (src/lib/og/render.ts), drawn by next build: a local photo from
 * public/images, an uploaded one downloaded from Supabase Storage, and the site's image for a product
 * added after the deploy.
 */

const UPLOADED =
  "https://project.supabase.co/storage/v1/object/public/product-images/products/0b8e4f4c-7a51-4c11-9d0e-3f1f6f3d2a10"

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe("a share image's photo", () => {
  it("is the largest local copy, or null when it is missing", async () => {
    expect(await sharePhoto("/images/products/classic-cotton-shirt-1")).toMatch(
      /classic-cotton-shirt-1-1200\.webp$/
    )
    expect(await sharePhoto("/images/products/no-such-photo")).toBeNull()
  })

  it("downloads the largest copy of an uploaded photo, and falls back to the logo when it can't", async () => {
    const requested: string[] = []
    vi.stubGlobal("fetch", async (url: string) => {
      requested.push(url)
      return new Response(new Uint8Array([1, 2, 3]))
    })
    const photo = await sharePhoto(UPLOADED)
    expect(requested).toEqual([`${UPLOADED}-1200.webp`])
    expect(Buffer.isBuffer(photo) ? [...photo] : photo).toEqual([1, 2, 3])

    vi.stubGlobal("fetch", async () => new Response(null, { status: 404 }))
    expect(await sharePhoto(UPLOADED)).toBeNull()
    vi.stubGlobal("fetch", () => Promise.reject(new TypeError("fetch failed")))
    expect(await sharePhoto(UPLOADED)).toBeNull()
  })
})

describe("a share image asked for while the store runs", () => {
  it("points to the site's image, since only the build draws them", () => {
    vi.stubEnv("NEXT_PHASE", "phase-production-server")
    const response = shareImageOutsideBuild()
    expect(response?.status).toBe(307)
    expect(response?.headers.get("location")).toBe(shareImages.site)
  })

  it("lets the build draw its own", () => {
    vi.stubEnv("NEXT_PHASE", PHASE_PRODUCTION_BUILD)
    expect(shareImageOutsideBuild()).toBeNull()
  })
})
