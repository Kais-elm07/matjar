import { z } from "zod"

import { siteConfig } from "@/config/site"

import { fitsCurrency } from "./money"

/**
 * Rules for the categories and products files in src/data, with an Arabic message for each field.
 * They run at build time only; the checks that link the two files together are in validate.ts.
 */

z.config(z.locales.ar())

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
  error:
    "الرابط يجب أن يكون بأحرف إنجليزية صغيرة وأرقام وشرطات فقط، مثل classic-shirt",
})

const imageSrc = z
  .string()
  .refine((src) => src.startsWith("/") || /^https?:\/\//.test(src), {
    error: "مسار الصورة يجب أن يبدأ بـ / أو https://",
  })

const text = z.string().trim().min(1, { error: "لا يمكن أن يكون فارغاً" })

const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/

/** A day that exists in the calendar (2026-02-30 is rejected). A format error is reported on its own. */
function isRealDate(value: string) {
  if (!DATE_FORMAT.test(value)) return true
  const date = new Date(`${value}T00:00:00Z`)
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  )
}

const date = (formatError: string) =>
  z
    .string()
    .regex(DATE_FORMAT, { error: formatError })
    .refine(isRealDate, { error: "التاريخ غير موجود في التقويم" })

const { fractionDigits } = siteConfig.currency
const price = (positiveError: string) =>
  z
    .number()
    .positive({ error: positiveError })
    .refine(fitsCurrency, {
      error: `أقصى عدد من الخانات العشرية في السعر: ${fractionDigits}`,
    })

export const categorySchema = z.object({
  slug,
  name: text,
  description: z.string().trim().optional(),
  image: imageSrc.optional(),
  parent: slug.optional(),
})

const variantSchema = z
  .object({
    sku: text,
    options: z.record(text, text).default({}),
    price: price("السعر يجب أن يكون أكبر من صفر"),
    compareAtPrice: price("السعر قبل الخصم يجب أن يكون أكبر من صفر").optional(),
    stock: z
      .number()
      .int({ error: "المخزون يجب أن يكون رقماً صحيحاً" })
      .min(0, { error: "المخزون لا يمكن أن يكون سالباً" }),
  })
  .refine(
    (variant) =>
      variant.compareAtPrice === undefined ||
      variant.compareAtPrice > variant.price,
    {
      error: "السعر قبل الخصم يجب أن يكون أكبر من السعر",
      path: ["compareAtPrice"],
    }
  )

export const productSchema = z.object({
  slug,
  name: text,
  category: slug,
  description: z.string().default(""),
  specs: z.array(z.object({ label: text, value: text })).default([]),
  images: z
    .array(
      z.object({
        src: imageSrc,
        alt: z.string().trim().optional(),
        color: z.string().trim().optional(),
      })
    )
    .min(1, { error: "كل منتج يحتاج صورة واحدة على الأقل" }),
  variants: z
    .array(variantSchema)
    .min(1, { error: "كل منتج يحتاج متغيراً واحداً على الأقل" }),
  popularity: z.number().int().min(0).default(0),
  createdAt: date("التاريخ يجب أن يكون بصيغة 2026-10-30"),
  saleEndsAt: date("تاريخ نهاية العرض يجب أن يكون بصيغة 2026-12-31").optional(),
  hidden: z.boolean().default(false),
})

export type ParsedCategory = z.infer<typeof categorySchema>
export type ParsedProduct = z.infer<typeof productSchema>
