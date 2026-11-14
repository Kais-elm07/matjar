import sharp from "sharp"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { uploadProductPhoto } from "@/modules/admin/actions"
import { MAX_UPLOAD_BYTES, UPLOAD_MESSAGES } from "@/modules/admin/upload-rules"
import {
  photoToolsStatus,
  storageStatus,
  uploadPhoto,
} from "@/modules/admin/uploads"
import { IMAGE_WIDTHS, imageFile } from "@/lib/image-loader"

import { discPhoto } from "./support/photos"

/**
 * Uploading a product photo from the admin panel (src/modules/admin/uploads.ts and the Server Action in
 * actions.ts), with Supabase Storage and the database replaced: what is sent where, with which key,
 * and what the owner reads when something is wrong. The browser test uploads through a fake storage.
 */

const saved: { src: string; tone: string | null; cutout: boolean }[] = []
vi.mock("@/lib/db", () => ({
  getDb: () => ({
    uploadedImage: {
      create: async (args: {
        data: { src: string; tone: string | null; cutout: boolean }
      }) => {
        saved.push(args.data)
      },
    },
  }),
}))

let signedIn = true
vi.mock("@/modules/admin/session", () => ({
  isAdmin: async () => signedIn,
  isAdminEnabled: () => true,
  startSession: async () => false,
  endSession: async () => {},
}))

const SUPABASE = "https://project.supabase.co"
const KEY = "test-secret-key"

type FetchCall = { url: string; init: RequestInit | undefined }
let calls: FetchCall[] = []

/** Replaces fetch with one that records each request and answers with the given response. */
function storageAnswers(answer: () => Response | Promise<Response>) {
  vi.stubGlobal("fetch", async (url: string, init?: RequestInit) => {
    calls.push({ url, init })
    return answer()
  })
}

beforeEach(() => {
  saved.length = 0
  calls = []
  signedIn = true
  // The trailing slash a pasted address may carry is ignored
  vi.stubEnv("SUPABASE_URL", `${SUPABASE}/`)
  vi.stubEnv("SUPABASE_SECRET_KEY", KEY)
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe("uploading a photo to Supabase Storage", () => {
  it("sends the five copies under one new name with the secret key, and keeps the measured look", async () => {
    storageAnswers(() => Response.json({ Key: "ok" }))
    const result = await uploadPhoto(await discPhoto(900, "#c2410c", "none"))

    expect(result.ok).toBe(true)
    const src = result.ok ? result.src : ""
    expect(src).toMatch(
      /^https:\/\/project\.supabase\.co\/storage\/v1\/object\/public\/product-images\/products\/[0-9a-f-]{36}$/
    )
    const name = src.slice(src.lastIndexOf("/") + 1)
    expect(calls.map((call) => call.url)).toEqual(
      IMAGE_WIDTHS.map(
        (width) =>
          `${SUPABASE}/storage/v1/object/product-images/products/${name}-${width}.webp`
      )
    )
    for (const { init } of calls) {
      const headers = new Headers(init?.headers)
      expect(init?.method).toBe("POST")
      expect(headers.get("apikey")).toBe(KEY)
      expect(headers.get("authorization")).toBeNull()
      expect(headers.get("content-type")).toBe("image/webp")
      expect(headers.get("x-upsert")).toBe("false")
    }
    // The image loader finds the copies the store asks for at the address the product keeps
    expect(imageFile(src, 700)).toBe(
      `${SUPABASE}/storage/v1/object/public/product-images/products/${name}-800.webp`
    )
    expect(saved).toEqual([
      { src, tone: expect.stringMatching(/^#[0-9a-f]{6}$/), cutout: true },
    ])
  })

  it("is off without the variables, and sends nothing", async () => {
    vi.stubEnv("SUPABASE_SECRET_KEY", "")
    storageAnswers(() => Response.json({}))
    const result = await uploadPhoto(await discPhoto(900, "#c2410c", "none"))
    expect(result).toEqual({ ok: false, problem: UPLOAD_MESSAGES.off })
    expect(calls).toHaveLength(0)
    expect(await storageStatus()).toBe("off")
  })

  it("refuses a file that is not a photo, a narrow photo and a GIF, before sending anything", async () => {
    storageAnswers(() => Response.json({}))
    const narrow = await discPhoto(400, "#c2410c", "none")
    const gif = await sharp(await discPhoto(800, "#c2410c", "#ffffff"))
      .gif()
      .toBuffer()

    expect(await uploadPhoto(Buffer.from("not a photo"))).toEqual({
      ok: false,
      problem: UPLOAD_MESSAGES.notAnImage,
    })
    expect(await uploadPhoto(narrow)).toEqual({
      ok: false,
      problem: UPLOAD_MESSAGES.narrow(400),
    })
    expect(await uploadPhoto(gif)).toEqual({
      ok: false,
      problem: UPLOAD_MESSAGES.wrongType,
    })
    expect(calls).toHaveLength(0)
    expect(saved).toHaveLength(0)
  })

  it("tells the owner when the storage refuses the copies or can't be reached", async () => {
    const photo = await discPhoto(900, "#c2410c", "none")
    storageAnswers(() =>
      Response.json({ error: "Bucket not found" }, { status: 404 })
    )
    expect(await uploadPhoto(photo)).toEqual({
      ok: false,
      problem: UPLOAD_MESSAGES.storage(404),
    })

    storageAnswers(() => Promise.reject(new TypeError("fetch failed")))
    expect(await uploadPhoto(photo)).toEqual({
      ok: false,
      problem: UPLOAD_MESSAGES.unreachable,
    })
    expect(saved).toHaveLength(0)
  })
})

describe("the health check of the photos", () => {
  it("reports a public bucket as up, a private one, and a missing one as down", async () => {
    storageAnswers(() => Response.json({ id: "product-images", public: true }))
    expect(await storageStatus()).toBe("up")
    expect(calls[0]?.url).toBe(`${SUPABASE}/storage/v1/bucket/product-images`)
    expect(new Headers(calls[0]?.init?.headers).get("apikey")).toBe(KEY)

    storageAnswers(() => Response.json({ id: "product-images", public: false }))
    expect(await storageStatus()).toBe("private")

    storageAnswers(() => Response.json({}, { status: 404 }))
    expect(await storageStatus()).toBe("down")
  })

  it("finds sharp working", async () => {
    expect(await photoToolsStatus()).toBe("up")
  })
})

describe("the upload Server Action", () => {
  /** The form the upload button sends */
  function photoForm(bytes: Uint8Array, type: string) {
    const form = new FormData()
    form.append("photo", new File([new Uint8Array(bytes)], "photo", { type }))
    return form
  }

  it("refuses anyone who is not signed in", async () => {
    signedIn = false
    const result = await uploadProductPhoto(
      photoForm(await discPhoto(900, "#c2410c", "none"), "image/png")
    )
    expect(result).toEqual({
      ok: false,
      problem: "انتهت جلستك. سجّل الدخول من جديد.",
    })
  })

  it("checks the file's presence, type and size again on the server", async () => {
    expect(await uploadProductPhoto(new FormData())).toEqual({
      ok: false,
      problem: UPLOAD_MESSAGES.missing,
    })
    expect(
      await uploadProductPhoto(photoForm(new Uint8Array(10), "text/plain"))
    ).toEqual({ ok: false, problem: UPLOAD_MESSAGES.wrongType })
    expect(
      await uploadProductPhoto(
        photoForm(new Uint8Array(MAX_UPLOAD_BYTES + 1), "image/png")
      )
    ).toEqual({ ok: false, problem: UPLOAD_MESSAGES.tooLarge })
  })

  it("passes an accepted file on to be prepared and stored", async () => {
    storageAnswers(() => Response.json({ Key: "ok" }))
    const result = await uploadProductPhoto(
      photoForm(await discPhoto(900, "#2563eb", "none"), "image/png")
    )
    expect(result.ok).toBe(true)
    expect(calls).toHaveLength(IMAGE_WIDTHS.length)
    expect(saved).toHaveLength(1)
  })
})
