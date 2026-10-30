import "server-only"

import { z } from "zod"

import { coupons as couponData } from "@/data/coupons"
import { shipping as shippingData } from "@/data/shipping"
import { toMinorUnits } from "@/lib/catalog/money"

import type { CheckoutConfig } from "./types"

/**
 * إعدادات إتمام الطلب بعد التحقق منها وقت البناء: الشحن والكوبونات.
 * أي خطأ في الملفين يوقف البناء برسالة عربية، والنتيجة تُمرَّر لصفحة الطلب.
 */

z.config(z.locales.ar())

const amount = z.number().min(0, { error: "المبلغ لا يمكن أن يكون سالباً" })

const shippingSchema = z.object({
  freeShippingFrom: amount,
  cities: z
    .array(
      z.object({
        name: z.string().trim().min(1),
        fee: amount,
        days: z
          .tuple([z.number().int().min(0), z.number().int().min(0)])
          .refine(([min, max]) => min <= max, {
            error: "أقل مدة توصيل يجب ألا تزيد على أكثرها",
          }),
        express: z.boolean().default(false),
      })
    )
    .min(1, { error: "أضف مدينة واحدة على الأقل" }),
  express: z.object({ extraFee: amount, label: z.string().trim().min(1) }),
})

const couponSchema = z
  .object({
    code: z.string().regex(/^[A-Z0-9]+$/, {
      error: "رمز الكوبون بأحرف إنجليزية كبيرة وأرقام فقط، مثل WELCOME10",
    }),
    type: z.enum(["percent", "fixed", "free-shipping"]),
    value: z.number().positive().optional(),
    minSubtotal: amount.optional(),
    maxDiscount: amount.optional(),
    description: z.string().trim().min(1),
  })
  .refine((coupon) => coupon.type === "free-shipping" || coupon.value, {
    error: "كوبون الخصم يحتاج قيمة (value)",
    path: ["value"],
  })
  .refine((coupon) => coupon.type !== "percent" || (coupon.value ?? 0) <= 100, {
    error: "النسبة لا تتجاوز 100",
    path: ["value"],
  })

function fail(file: string, error: z.ZodError): never {
  const problems = error.issues.map(
    (issue) => `${issue.path.join(".") || "البيانات"}: ${issue.message}`
  )
  throw new Error(`الملف ${file} فيه أخطاء:\n- ${problems.join("\n- ")}`)
}

function buildConfig(): CheckoutConfig {
  const shipping = shippingSchema.safeParse(shippingData)
  if (!shipping.success) fail("src/data/shipping.ts", shipping.error)
  const coupons = z.array(couponSchema).safeParse(couponData)
  if (!coupons.success) fail("src/data/coupons.ts", coupons.error)

  const names = shipping.data.cities.map((city) => city.name)
  const codes = coupons.data.map((coupon) => coupon.code)
  const duplicate = (list: string[]) =>
    list.find((item, index) => list.indexOf(item) !== index)
  if (duplicate(names)) {
    throw new Error(
      `src/data/shipping.ts: المدينة "${duplicate(names)}" مكررة.`
    )
  }
  if (duplicate(codes)) {
    throw new Error(`src/data/coupons.ts: الكوبون "${duplicate(codes)}" مكرر.`)
  }

  return {
    freeShippingFrom: toMinorUnits(shipping.data.freeShippingFrom),
    cities: shipping.data.cities.map((city) => ({
      name: city.name,
      fee: toMinorUnits(city.fee),
      days: city.days,
      express: city.express,
    })),
    express: {
      extraFee: toMinorUnits(shipping.data.express.extraFee),
      label: shipping.data.express.label,
    },
    coupons: coupons.data.map((coupon) => ({
      code: coupon.code,
      type: coupon.type,
      value:
        coupon.type === "fixed"
          ? toMinorUnits(coupon.value ?? 0)
          : (coupon.value ?? 0),
      minSubtotal: toMinorUnits(coupon.minSubtotal ?? 0),
      maxDiscount:
        coupon.maxDiscount === undefined
          ? null
          : toMinorUnits(coupon.maxDiscount),
      description: coupon.description,
    })),
  }
}

const config = buildConfig()

export function getCheckoutConfig() {
  return config
}
