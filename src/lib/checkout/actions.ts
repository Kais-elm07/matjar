"use server"

import "server-only"

import { revalidateTag } from "next/cache"

import { CATALOG_TAG } from "@/lib/catalog/load"
import { getCheckoutConfig } from "@/lib/checkout/config"
import { checkoutSchema, type CheckoutInput } from "@/lib/checkout/form-schema"
import { buildOrder } from "@/lib/checkout/order"
import {
  orderLines,
  OutOfStockError,
  saveOrder,
  type RequestedLine,
} from "@/lib/checkout/orders"
import {
  couponMinimumMessage,
  couponProblem,
  findCoupon,
} from "@/lib/checkout/totals"
import type { Coupon } from "@/lib/checkout/types"
import { z } from "@/lib/zod"

/**
 * The checkout's Server Actions: the browser calls them like functions, and they run on the server.
 * Anything can reach them in a POST request, so every argument is checked again here, and prices,
 * stock and coupons come from the server's own data, never from the browser.
 */

/** What the checkout sends: the form values, the cart as SKUs and quantities, the coupon, and the total it showed. */
type PlaceOrderInput = {
  values: CheckoutInput
  lines: RequestedLine[]
  couponCode: string | null
  expectedTotal: number
}

/** The order's long id for its confirmation page, or a message for the visitor in Arabic. */
export type PlaceOrderResult =
  { ok: true; id: string } | { ok: false; message: string }

const requestSchema = z.object({
  values: z.unknown(),
  lines: z
    .array(
      z.object({
        sku: z.string().min(1),
        quantity: z.number().int().positive(),
      })
    )
    .min(1)
    .refine(
      (lines) => new Set(lines.map((line) => line.sku)).size === lines.length
    ),
  couponCode: z.string().max(40).nullable(),
  expectedTotal: z.number().int(),
})

const STOCK_CHANGED =
  "تغيّر توفر بعض المنتجات في سلتك. راجع السلة ثم أكّد الطلب."

/**
 * Checks the order again, prices it from the database, and saves it with its lines while lowering the
 * stock. The pages show the stock from a cache, so after an order the catalog is marked stale: the
 * next visitors still get the saved pages while fresh ones are drawn behind them.
 */
export async function placeOrder(
  input: PlaceOrderInput
): Promise<PlaceOrderResult> {
  const request = requestSchema.safeParse(input)
  if (!request.success) {
    return {
      ok: false,
      message: "تعذّرت قراءة السلة. حدّث الصفحة ثم حاول مرة أخرى.",
    }
  }
  const config = getCheckoutConfig()
  const values = checkoutSchema(config.cities).safeParse(request.data.values)
  if (!values.success) {
    return {
      ok: false,
      message: "بعض بيانات الطلب غير صحيحة. راجع الحقول ثم أكّد الطلب.",
    }
  }

  const lines = await orderLines(request.data.lines)
  if (!lines) return { ok: false, message: STOCK_CHANGED }

  let coupon: Coupon | null = null
  if (request.data.couponCode) {
    coupon = findCoupon(config.coupons, request.data.couponCode) ?? null
    if (!coupon) {
      return {
        ok: false,
        message: "الكوبون لم يعد صالحاً. أزله ثم أكّد الطلب.",
      }
    }
  }

  const order = buildOrder({ values: values.data, lines, coupon, config })
  if (!order) {
    return { ok: false, message: "اختر مدينة من قائمة مدن الشحن." }
  }
  // The visitor confirms the total they saw; a different total means the page is out of date
  if (order.total !== request.data.expectedTotal) {
    return {
      ok: false,
      message:
        "تغيّر إجمالي طلبك منذ فتحت الصفحة. حدّث الصفحة وراجع الملخص ثم أكّد الطلب.",
    }
  }

  try {
    const id = await saveOrder(order)
    revalidateTag(CATALOG_TAG, "max")
    return { ok: true, id }
  } catch (error) {
    if (error instanceof OutOfStockError) {
      return { ok: false, message: STOCK_CHANGED }
    }
    console.error("Saving an order failed", error)
    return {
      ok: false,
      message: "تعذّر حفظ طلبك الآن. حاول مرة أخرى بعد قليل.",
    }
  }
}

/** The coupon for a code if it applies to this subtotal, or a message for the visitor in Arabic. */
export async function lookupCoupon(
  code: string,
  subtotal: number
): Promise<{ ok: true; coupon: Coupon } | { ok: false; message: string }> {
  const request = z
    .object({ code: z.string().max(40), subtotal: z.number().int().min(0) })
    .safeParse({ code, subtotal })
  const coupon = request.success
    ? findCoupon(getCheckoutConfig().coupons, request.data.code)
    : undefined
  if (!request.success || !coupon) {
    return { ok: false, message: "رمز الكوبون غير صحيح" }
  }
  if (couponProblem(coupon, request.data.subtotal)) {
    return { ok: false, message: couponMinimumMessage(coupon) }
  }
  return { ok: true, coupon }
}
