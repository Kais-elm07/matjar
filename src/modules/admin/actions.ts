"use server"

import "server-only"

import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"

import {
  parsedCategories,
  productConflicts,
  writeCategory,
  writeHidden,
  writeProduct,
  writeStocks,
} from "@/modules/admin/catalog"
import type { CategoryFormValues } from "@/modules/admin/category-form"
import {
  fieldLabel,
  toProductInput,
  type ProductFormValues,
} from "@/modules/admin/product-form"
import {
  endSession,
  isAdmin,
  isAdminEnabled,
  startSession,
} from "@/modules/admin/session"
import {
  MAX_UPLOAD_BYTES,
  UPLOAD_MESSAGES,
  UPLOAD_TYPES,
} from "@/modules/admin/upload-rules"
import { uploadPhoto, type UploadResult } from "@/modules/admin/uploads"
import { CATALOG_TAG } from "@/modules/catalog/load"
import { categorySchema, productSchema } from "@/modules/catalog/schema"
import { categoryProblems, productProblems } from "@/modules/catalog/validate"
import { adminPaths } from "@/lib/routes"
import { z } from "@/lib/zod"

/**
 * The admin panel's Server Actions. Anyone can send them a POST request, so each one checks the
 * session itself before anything else, then every value, with the same rules as the data files.
 * Every change to the catalog ends by marking it stale, so the store shows it within seconds.
 */

type SignInState = { message: string | null }

const NOT_SIGNED_IN = "انتهت جلستك. سجّل الدخول من جديد."

/** The answer of a save: the saved item, or the problems to fix, in Arabic. */
type SaveResult = { ok: true; id: number } | { ok: false; problems: string[] }

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function signIn(
  _previous: SignInState,
  form: FormData
): Promise<SignInState> {
  if (!isAdminEnabled()) {
    return {
      message:
        "لوحة الإدارة غير مفعّلة: أضف ADMIN_PASSWORD_HASH وADMIN_SESSION_SECRET إلى متغيرات البيئة (DEPLOYMENT.md).",
    }
  }
  const password = form.get("password")
  if (typeof password !== "string" || !(await startSession(password))) {
    // A short wait after a wrong password slows down anyone guessing
    await wait(800)
    return { message: "كلمة المرور غير صحيحة." }
  }
  redirect(adminPaths.products)
}

export async function signOut() {
  await endSession()
  redirect(adminPaths.signIn)
}

const productRequest = z.object({
  name: z.string().max(200),
  slug: z.string().max(120),
  category: z.string().max(120),
  description: z.string().max(10_000),
  specs: z.string().max(5_000),
  popularity: z.string().max(12),
  createdAt: z.string().max(10),
  saleEndsAt: z.string().max(10),
  hidden: z.boolean(),
  images: z
    .array(
      z.object({
        src: z.string().max(500),
        color: z.string().max(60),
        alt: z.string().max(300),
      })
    )
    .max(20),
  variants: z
    .array(
      z.object({
        sku: z.string().max(60),
        options: z.string().max(300),
        price: z.string().max(20),
        compareAtPrice: z.string().max(20),
        stock: z.string().max(10),
      })
    )
    .min(1)
    .max(200),
})

/** Saves a product from the form: new when id is null. */
export async function saveProduct(
  id: number | null,
  values: ProductFormValues
): Promise<SaveResult> {
  if (!(await isAdmin())) return { ok: false, problems: [NOT_SIGNED_IN] }
  const request = productRequest.safeParse(values)
  const productId = z.number().int().positive().nullable().safeParse(id)
  if (!request.success || !productId.success) {
    return { ok: false, problems: ["تعذّرت قراءة النموذج. حدّث الصفحة."] }
  }

  const parsed = productSchema.safeParse(toProductInput(request.data))
  if (!parsed.success) {
    return {
      ok: false,
      problems: parsed.error.issues.map(
        (issue) => `${fieldLabel(issue.path)}: ${issue.message}`
      ),
    }
  }
  const problems = [
    ...productProblems(parsed.data),
    ...(await productConflicts(productId.data, parsed.data)),
  ]
  if (problems.length > 0) return { ok: false, problems }

  const saved = await writeProduct(productId.data, parsed.data)
  revalidateTag(CATALOG_TAG, "max")
  return { ok: true, id: saved }
}

const photoRequest = z
  .file({ error: UPLOAD_MESSAGES.missing })
  .min(1, { error: UPLOAD_MESSAGES.missing })
  .max(MAX_UPLOAD_BYTES, { error: UPLOAD_MESSAGES.tooLarge })
  .mime(UPLOAD_TYPES, { error: UPLOAD_MESSAGES.wrongType })

/**
 * Uploads a product photo (the form's "photo" field) and answers with its address for the form. The
 * photo is checked again on the server: its type and size here, and what it really holds in uploads.ts.
 */
export async function uploadProductPhoto(
  form: FormData
): Promise<UploadResult> {
  if (!(await isAdmin())) return { ok: false, problem: NOT_SIGNED_IN }
  if (!(form instanceof FormData)) {
    return { ok: false, problem: UPLOAD_MESSAGES.missing }
  }
  const photo = photoRequest.safeParse(form.get("photo"))
  if (!photo.success) {
    return {
      ok: false,
      problem: photo.error.issues[0]?.message ?? UPLOAD_MESSAGES.missing,
    }
  }
  return uploadPhoto(Buffer.from(await photo.data.arrayBuffer()))
}

const stocksRequest = z
  .array(
    z.object({
      sku: z.string().min(1).max(60),
      stock: z.number().int().min(0).max(1_000_000),
    })
  )
  .min(1)
  .max(200)

/** New stock counts from the products list. */
export async function saveStocks(
  stocks: { sku: string; stock: number }[]
): Promise<{ ok: boolean; message: string }> {
  if (!(await isAdmin())) return { ok: false, message: NOT_SIGNED_IN }
  const request = stocksRequest.safeParse(stocks)
  if (!request.success) {
    return {
      ok: false,
      message: "المخزون يجب أن يكون رقماً صحيحاً من 0 فأكثر.",
    }
  }
  await writeStocks(request.data)
  revalidateTag(CATALOG_TAG, "max")
  return { ok: true, message: "حُفظ المخزون." }
}

/** Hides a product from the store, or shows it again. */
export async function setHidden(id: number, hidden: boolean) {
  if (!(await isAdmin())) return { ok: false, message: NOT_SIGNED_IN }
  const request = z
    .object({ id: z.number().int().positive(), hidden: z.boolean() })
    .safeParse({ id, hidden })
  if (!request.success) return { ok: false, message: "طلب غير صالح." }
  await writeHidden(request.data.id, request.data.hidden)
  revalidateTag(CATALOG_TAG, "max")
  return {
    ok: true,
    message: hidden ? "أُخفي المنتج من المتجر." : "عاد المنتج إلى المتجر.",
  }
}

const categoryRequest = z.object({
  slug: z.string().max(120),
  name: z.string().max(120),
  description: z.string().max(1_000),
  imageSrc: z.string().max(500),
  parent: z.string().max(120),
})

/** Saves a category: new when original is null, otherwise the category whose slug was original. */
export async function saveCategory(
  original: string | null,
  values: CategoryFormValues
): Promise<{ ok: true } | { ok: false; problems: string[] }> {
  if (!(await isAdmin())) return { ok: false, problems: [NOT_SIGNED_IN] }
  const request = categoryRequest.safeParse(values)
  const originalSlug = z.string().max(120).nullable().safeParse(original)
  if (!request.success || !originalSlug.success) {
    return { ok: false, problems: ["تعذّرت قراءة النموذج. حدّث الصفحة."] }
  }
  const parsed = categorySchema.safeParse({
    slug: request.data.slug.trim(),
    name: request.data.name.trim(),
    description: request.data.description.trim() || undefined,
    image: request.data.imageSrc.trim() || undefined,
    parent: request.data.parent || undefined,
  })
  if (!parsed.success) {
    return {
      ok: false,
      problems: parsed.error.issues.map(
        (issue) => `${fieldLabel(issue.path)}: ${issue.message}`
      ),
    }
  }

  // The change is checked against the other categories: a repeated slug, a missing parent, a cycle
  const others = (await parsedCategories()).filter(
    (category) => category.slug !== originalSlug.data
  )
  const problems = categoryProblems([...others, parsed.data])
  if (problems.length > 0) return { ok: false, problems }

  await writeCategory(originalSlug.data, parsed.data)
  revalidateTag(CATALOG_TAG, "max")
  return { ok: true }
}
