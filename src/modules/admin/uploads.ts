import "server-only"

import { randomUUID } from "node:crypto"

import sharp from "sharp"

import {
  MAX_UPLOAD_PIXELS,
  MIN_UPLOAD_WIDTH,
  UPLOAD_MESSAGES,
} from "@/modules/admin/upload-rules"
import { getDb } from "@/lib/db"
import { isRecord } from "@/lib/guards"
import { measurePhoto, webpCopies } from "@/lib/images/prepare"

/**
 * Photos uploaded in the admin panel, kept in Supabase Storage (decided by the owner): sharp makes the
 * same five WebP copies as pnpm images (src/lib/images/prepare.ts) and measures the photo's look, the
 * copies go to a public bucket, and the look is kept in the database (UploadedImage) until a product
 * that uses the photo is saved. The store then shows the copies straight from Supabase, through the
 * image loader, like the photos in public/images.
 *
 * Storage is reached through its REST API with the project's secret key, sent in the apikey header
 * (https://supabase.com/docs/guides/api/api-keys). The key never leaves the server.
 */

/** The public bucket the owner creates in Supabase (DEPLOYMENT.md) */
const BUCKET = "product-images"
const FOLDER = "products"
const TIMEOUT_MS = 20_000
const FORMATS = new Set(["png", "webp", "jpeg"])

interface Storage {
  url: string
  key: string
}

/** Supabase's address and secret key, or null when uploading is off (locally, by default). */
function storage(): Storage | null {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "")
  const key = process.env.SUPABASE_SECRET_KEY?.trim()
  return url && key ? { url, key } : null
}

export function isUploadEnabled() {
  return storage() !== null
}

/** The answer of an upload: the photo's address for the form, or the problem, in Arabic. */
export type UploadResult =
  { ok: true; src: string } | { ok: false; problem: string }

/** What is wrong with the photo for the store, or null when it can be prepared. */
async function photoProblem(data: Buffer) {
  let format: string | undefined
  let width = 0
  let height = 0
  try {
    // Reads the size from the file's header, without unpacking the pixels
    const meta = await sharp(data).metadata()
    format = meta.format
    width = meta.autoOrient.width
    height = meta.autoOrient.height
  } catch {
    return UPLOAD_MESSAGES.notAnImage
  }
  if (!format || !FORMATS.has(format)) return UPLOAD_MESSAGES.wrongType
  if (width * height > MAX_UPLOAD_PIXELS) return UPLOAD_MESSAGES.tooBig
  if (width < MIN_UPLOAD_WIDTH) return UPLOAD_MESSAGES.narrow(width)
  return null
}

function objectUrl(target: Storage, name: string) {
  return `${target.url}/storage/v1/object/${BUCKET}/${name}`
}

/**
 * Prepares a photo and saves its copies in the bucket under a new name, so a copy is never replaced
 * and can be cached for a year. Returns the address the product keeps, without the size.
 */
export async function uploadPhoto(data: Buffer): Promise<UploadResult> {
  const target = storage()
  if (!target) return { ok: false, problem: UPLOAD_MESSAGES.off }
  const problem = await photoProblem(data)
  if (problem) return { ok: false, problem }

  const [copies, look] = await Promise.all([
    webpCopies(data),
    measurePhoto(data),
  ])
  const name = `${FOLDER}/${randomUUID()}`
  let responses: Response[]
  try {
    responses = await Promise.all(
      copies.map((copy) =>
        fetch(objectUrl(target, `${name}-${copy.width}.webp`), {
          method: "POST",
          headers: {
            apikey: target.key,
            "content-type": "image/webp",
            "cache-control": "max-age=31536000",
            "x-upsert": "false",
          },
          body: new Uint8Array(copy.data),
          signal: AbortSignal.timeout(TIMEOUT_MS),
        })
      )
    )
  } catch {
    return { ok: false, problem: UPLOAD_MESSAGES.unreachable }
  }
  const failed = responses.find((response) => !response.ok)
  if (failed) {
    return { ok: false, problem: UPLOAD_MESSAGES.storage(failed.status) }
  }

  const src = `${target.url}/storage/v1/object/public/${BUCKET}/${name}`
  await getDb().uploadedImage.create({
    data: { src, tone: look.color, cutout: look.cutout },
  })
  return { ok: true, src }
}

/**
 * Whether uploading works, for /api/health/: "off" without the variables, "up" when the bucket exists
 * and is public, "private" when the store couldn't show its photos, and "down" otherwise.
 */
export async function storageStatus() {
  const target = storage()
  if (!target) return "off"
  try {
    const response = await fetch(`${target.url}/storage/v1/bucket/${BUCKET}`, {
      headers: { apikey: target.key },
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) return "down"
    const bucket: unknown = await response.json()
    return isRecord(bucket) && bucket.public === true ? "up" : "private"
  } catch {
    return "down"
  }
}

/** Whether sharp can make a WebP copy in this server, for /api/health/ */
export async function photoToolsStatus() {
  try {
    await sharp({
      create: {
        width: 4,
        height: 4,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .webp()
      .toBuffer()
    return "up"
  } catch {
    return "down"
  }
}
