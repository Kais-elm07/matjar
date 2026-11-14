"use server"

import "server-only"

import { updateTag } from "next/cache"
import { headers } from "next/headers"

import { cacheDiffersFrom } from "@/modules/catalog/queries"
import { CATALOG_TAG } from "@/modules/catalog/load"
import type { CartCatalog } from "@/modules/catalog/types"
import { getCheckoutConfig } from "@/modules/checkout/config"
import { checkoutSchema, type CheckoutInput } from "@/modules/checkout/schema"
import { buildOrder } from "@/modules/checkout/order"
import {
  findOrderByRequest,
  liveCartCatalog,
  OrderLimitError,
  orderLines,
  OutOfStockError,
  saveOrder,
  type RequestedLine,
} from "@/modules/checkout/orders-db"
import {
  couponMinimumMessage,
  couponProblem,
  findCoupon,
} from "@/modules/checkout/totals"
import type { Coupon } from "@/modules/checkout/types"
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
 * what changed, without a reload; `message` is for a change it can't name.
 *
 * The cached catalog the pages are drawn from may be behind too: then it is expired at once. A cart
 * that was only old in the browser leaves the cache alone, so refused requests can't keep emptying it.
 */
async function cartIsBehind(
  requested: RequestedLine[],
  message: string
): Promise<PlaceOrderResult> {
  const cart = await liveCartCatalog(requested)
  const skus = requested.map((line) => line.sku)
  if (await cacheDiffersFrom(cart, skus)) updateTag(CATALOG_TAG)
  return { ok: false, message, cart }
}

/**
 * Checks the order again, prices it from the database, and saves it with its lines while lowering the
 * stock. The pages show the stock from a cache, so after an order the catalog is expired at once
 * (updateTag): the next visitor of any page, even one who reaches it by a link, waits for a copy drawn
 * with the new stock rather than getting the old one.
 *
 * A request that was already saved (the visitor tried again because the answer never arrived) gets the
 * saved order back instead of a second one, and an address that saved too many orders in an hour is
 * refused without touching the stock.
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

    const clientIp = (await headers()).get(CLIENT_IP_HEADER)
    let id: string
    try {
      id = await saveOrder(order, { requestId, clientIp })
    } catch (error) {
      if (error instanceof OrderLimitError) {
        return {
          ok: false,
          message: "أرسلت طلبات كثيرة خلال ساعة واحدة. حاول مرة أخرى لاحقاً.",
        }
      }
      // Another order took the last pieces between reading the stock and saving
      if (error instanceof OutOfStockError) {
        return await cartIsBehind(requested, STOCK_CHANGED)
      }
      throw error
    }
    updateTag(CATALOG_TAG)
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
