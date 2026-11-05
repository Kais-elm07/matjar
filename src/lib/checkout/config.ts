import "server-only"

import { coupons as couponData } from "@/data/coupons"
import { shipping as shippingData } from "@/data/shipping"
import type { CheckoutConfig } from "@/lib/checkout/types"
import { toMinorUnits } from "@/lib/money"
import { z } from "@/lib/zod"

/**
 * Checkout settings, validated at build time: shipping and coupons.
 * Any error in the two files stops the build with an Arabic message, and the result is passed to the checkout page.
 * The files are read and checked when this module is first imported.
 */

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
  express: z.object({
    extraFee: amount,
    deliveryTime: z.string().trim().min(1),
  }),
})

const couponSchema = z
  .object({
    code: z.string().regex(/^[A-Z0-9]+$/, {
      error: "رمز الكوبون بأحرف إنجليزية كبيرة وأرقام فقط، مثل WELCOME10",
    }),
    type: z.enum(["percent", "fixed", "free-shipping"]),
    value: z.number().positive().optional(),
    minSubtotal: amount.optional(),
    maxDiscount: z
      .number()
      .positive({ error: "أقصى خصم يجب أن يكون أكبر من صفر" })
      .optional(),
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
  .refine(
    (coupon) => coupon.type !== "free-shipping" || coupon.value === undefined,
    { error: "كوبون الشحن المجاني لا يحتاج قيمة (value)", path: ["value"] }
  )
  .refine(
    (coupon) => coupon.type === "percent" || coupon.maxDiscount === undefined,
    {
      error: "أقصى خصم (maxDiscount) للكوبونات النسبية فقط",
      path: ["maxDiscount"],
    }
  )

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
  const duplicateCity = duplicate(names)
  if (duplicateCity) {
    throw new Error(`src/data/shipping.ts: المدينة "${duplicateCity}" مكررة.`)
  }
  const duplicateCode = duplicate(codes)
  if (duplicateCode) {
    throw new Error(`src/data/coupons.ts: الكوبون "${duplicateCode}" مكرر.`)
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
      deliveryTime: shipping.data.express.deliveryTime,
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
