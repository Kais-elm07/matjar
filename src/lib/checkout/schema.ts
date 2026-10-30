import { z } from "zod"

import { normalizeDigits } from "./totals"
import type { ShippingCity } from "./types"

/**
 * رقم الجوال بصيغة 05xxxxxxxx: يقبل +966 و00966 والأرقام العربية والمسافات.
 * مؤقتاً صيغة السعودية حتى تحديد الدولة (القرار 1 في الخطة).
 */
export function normalizePhone(value: string) {
  const digits = normalizeDigits(value).replace(/[\s()-]/g, "")
  for (const prefix of ["+966", "00966", "966"]) {
    if (digits.startsWith(prefix)) return `0${digits.slice(prefix.length)}`
  }
  return digits
}

const isEmail = (value: string) => z.email().safeParse(value).success

/** قواعد حقول نموذج الطلب، برسائل عربية تظهر تحت كل حقل. */
export function checkoutSchema(cities: ShippingCity[]) {
  return z
    .object({
      fullName: z
        .string()
        .trim()
        .min(3, "اكتب اسمك الكامل")
        .max(80, "الاسم طويل جداً"),
      phone: z
        .string()
        .transform(normalizePhone)
        .pipe(
          z
            .string()
            .regex(/^05\d{8}$/, "رقم الجوال يبدأ بـ 05 ويتكون من 10 أرقام")
        ),
      email: z
        .string()
        .trim()
        .refine(
          (value) => value === "" || isEmail(value),
          "البريد الإلكتروني غير صحيح"
        ),
      city: z
        .string()
        .refine(
          (value) => cities.some((city) => city.name === value),
          "اختر مدينتك"
        ),
      district: z.string().trim().min(2, "اكتب اسم الحي"),
      street: z.string().trim().min(5, "اكتب اسم الشارع ورقم المبنى"),
      notes: z.string().trim().max(300, "الملاحظات طويلة جداً"),
      shippingMethod: z.enum(["standard", "express"]),
    })
    .refine(
      (values) =>
        values.shippingMethod === "standard" ||
        cities.find((city) => city.name === values.city)?.express,
      {
        path: ["shippingMethod"],
        error: "التوصيل السريع غير متاح في هذه المدينة",
      }
    )
}

export type CheckoutInput = z.input<ReturnType<typeof checkoutSchema>>
export type CheckoutValues = z.output<ReturnType<typeof checkoutSchema>>
