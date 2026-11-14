"use server"

import "server-only"

import { revalidateTag } from "next/cache"
import { headers } from "next/headers"

import { CATALOG_TAG } from "@/modules/catalog/load"
import type { CartCatalog } from "@/modules/catalog/types"
import { getCheckoutConfig } from "@/lib/checkout/config"
import { checkoutSchema, type CheckoutInput } from "@/lib/checkout/form-schema"
import { buildOrder } from "@/lib/checkout/order"
import {
  findOrderByRequest,
  liveCartCatalog,
  orderLines,
  OutOfStockError,
  reachedOrderLimit,
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

/**
 * What the checkout sends: an id for the order, which stays the same when the visitor tries again,
 * the form values, the cart as SKUs and quantities, the coupon, and the total it showed.
 */
type PlaceOrderInput = {
  requestId: string
  values: CheckoutInput
  lines: RequestedLine[]
  couponCode: string | null
  expectedTotal: number
}

/**
 * The order's long id for its confirmation page, or a message for the visitor in Arabic. A refusal
 * because the cart is behind the store also carries `cart`: the prices and stock of the cart's products
 * as they are now, which the checkout applies to the cart at once.
 */
export type PlaceOrderResult =
  { ok: true; id: string } | { ok: false; message: string; cart?: CartCatalog }

/** More products than a cart holds in practice; it bounds the work a single request can ask for. */
const MAX_ORDER_LINES = 50

const requestSchema = z.object({
  requestId: z.uuid(),
  values: z.unknown(),
  lines: z
    .array(
      z.object({
        sku: z.string().min(1),
        quantity: z.number().int().positive(),
      })
    )
    .min(1)
    .max(MAX_ORDER_LINES)
    .refine(
      (lines) => new Set(lines.map((line) => line.sku)).size === lines.length
    ),
  couponCode: z.string().max(40).nullable(),
  expectedTotal: z.number().int(),
})

/**
 * Netlify writes the visitor's network address in this header itself, so a script can't put another
 * address in it. Outside Netlify (next dev, next start, the tests) the header is absent, and the
 * sender's orders are not counted.
 */
const CLIENT_IP_HEADER = "x-nf-client-connection-ip"

const STOCK_CHANGED =
  "تغيّر توفر بعض المنتجات في سلتك. راجع السلة ثم أكّد الطلب."

/**
 * The answer when the cart in the browser is behind the store: a product sold out, fewer pieces are
 * left than the cart asks for, or a price changed. The checkout applies `cart` and tells the visitor
 * what changed, without a reload; `message` is for a change it can't name. The saved catalog may be
 * behind too, so it is marked stale.
 */
async function cartIsBehind(
  requested: RequestedLine[],
  message: string
): Promise<PlaceOrderResult> {
  revalidateTag(CATALOG_TAG, "max")
  return { ok: false, message, cart: await liveCartCatalog(requested) }
}

/**
 * Checks the order again, prices it from the database, and saves it with its lines while lowering the
 * stock. The pages show the stock from a cache, so after an order the catalog is marked stale: the
 * next visitors still get the saved pages while fresh ones are drawn behind them.
 *
 * A request that was already saved (the visitor tried again because the answer never arrived) gets the
 * saved order back instead of a second one, and an address that saved too many orders in an hour is
 * refused before the stock is touched.
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
  const {
    requestId,
    lines: requested,
    couponCode,
    expectedTotal,
  } = request.data
  const config = getCheckoutConfig()
  const values = checkoutSchema(config.cities).safeParse(request.data.values)
  if (!values.success) {
    return {
      ok: false,
      message: "بعض بيانات الطلب غير صحيحة. راجع الحقول ثم أكّد الطلب.",
    }
  }

  try {
    const saved = await findOrderByRequest(requestId)
    if (saved) return { ok: true, id: saved }

    const clientIp = (await headers()).get(CLIENT_IP_HEADER)
    if (clientIp && (await reachedOrderLimit(clientIp))) {
      return {
        ok: false,
        message: "أرسلت طلبات كثيرة خلال ساعة واحدة. حاول مرة أخرى لاحقاً.",
      }
    }

    const lines = await orderLines(requested)
    if (!lines) return await cartIsBehind(requested, STOCK_CHANGED)

    let coupon: Coupon | null = null
    if (couponCode) {
      coupon = findCoupon(config.coupons, couponCode) ?? null
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
    if (order.total !== expectedTotal) {
      return await cartIsBehind(
        requested,
        "تغيّر إجمالي طلبك منذ فتحت الصفحة. حدّث الصفحة وراجع الملخص ثم أكّد الطلب."
      )
    }

    const id = await saveOrder(order, { requestId, clientIp }).catch(
      (error: unknown) => {
        // Another order took the last pieces between reading the stock and saving
        if (error instanceof OutOfStockError) return null
        throw error
      }
    )
    if (!id) return await cartIsBehind(requested, STOCK_CHANGED)
    revalidateTag(CATALOG_TAG, "max")
    return { ok: true, id }
  } catch (error) {
    console.error("Placing an order failed", error)
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
