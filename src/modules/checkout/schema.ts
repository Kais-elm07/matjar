import { toWesternDigits } from "@/lib/arabic-digits"
import type { ShippingCity } from "@/modules/checkout/types"
import { z } from "@/lib/zod"

/**
 * Mobile number in the form 05xxxxxxxx: accepts +966, 00966, Arabic digits and spaces,
 * and people who type the zero after the country code (+966 05...).
 * The Saudi format for now, until the country is decided (decision 1 in the plan).
 */
export function normalizePhone(value: string) {
  const digits = toWesternDigits(value).replace(/[\s()-]/g, "")
  for (const prefix of ["+966", "00966", "966"]) {
    if (digits.startsWith(prefix)) {
      const rest = digits.slice(prefix.length)
      return rest.startsWith("0") ? rest : `0${rest}`
    }
  }
  return digits
}

const isEmail = (value: string) => z.email().safeParse(value).success

/** Rules for the order form fields, with Arabic messages shown under each field. */
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
        .max(254, "البريد الإلكتروني طويل جداً")
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
      district: z
        .string()
        .trim()
        .min(2, "اكتب اسم الحي")
        .max(80, "اسم الحي طويل جداً"),
      street: z
        .string()
        .trim()
        .min(5, "اكتب اسم الشارع ورقم المبنى")
        .max(160, "العنوان طويل جداً"),
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
