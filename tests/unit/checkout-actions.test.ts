import { beforeEach, describe, expect, it, vi } from "vitest"

import { getProducts } from "@/modules/catalog/queries"
import { readLiveProducts } from "@/modules/catalog/load"
import { lookupCoupon, placeOrder } from "@/modules/checkout/actions"
import { getCheckoutConfig } from "@/modules/checkout/config"
import type { CheckoutInput } from "@/modules/checkout/schema"
import {
  findOrderByRequest,
  linesFromProducts,
  OrderLimitError,
  orderLines,
  OutOfStockError,
  saveOrder,
} from "@/modules/checkout/orders-db"
import { calculateTotals } from "@/modules/checkout/totals"

/**
 * What the server checks before it saves anything. The unit tests read the products from src/data
 * instead of the database (tests/unit/support/catalog-load.ts), so the cached catalog and the live rows
 * agree unless a test says otherwise, and the orders table is answered for here: no order saved for the
 * request, and a save that succeeds. Saving, lowering the stock and the hourly limit are covered by the
 * database tests (tests/db) and the browser tests.
 */

const SENDER = "203.0.113.7"

// Outside Next there is no cache to expire and no request to read the sender's address from
const updateTag = vi.hoisted(() => vi.fn())
vi.mock("next/cache", () => ({ updateTag }))
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-nf-client-connection-ip": SENDER }),
}))
vi.mock(import("@/modules/checkout/orders-db"), async (importOriginal) => ({
  ...(await importOriginal()),
  findOrderByRequest: vi.fn(async () => null),
  saveOrder: vi.fn(async () => "new-order"),
}))
// The rows the orders read from the database; a test can make them differ from the cached catalog
vi.mock(import("@/modules/catalog/load"), async (importOriginal) => {
  const original = await importOriginal()
  return { ...original, readLiveProducts: vi.fn(original.readLiveProducts) }
})

const config = getCheckoutConfig()
const city = config.cities[0]
const products = await getProducts()
const variant = products
  .flatMap((product) => product.variants)
  .find((candidate) => candidate.stock >= 2)
if (!variant) throw new Error("No variant with at least two pieces in stock")

const values: CheckoutInput = {
  fullName: "أحمد محمد",
  phone: "0501234567",
  email: "",
  city: city.name,
  district: "النرجس",
  street: "شارع الملك فهد 12",
  notes: "",
  shippingMethod: "standard",
}

const STOCK_CHANGED =
  "تغيّر توفر بعض المنتجات في سلتك. راجع السلة ثم أكّد الطلب."

beforeEach(() => {
  vi.clearAllMocks()
})

describe("order lines", () => {
  it("takes the name and price from the products, never from the browser", async () => {
    const lines = await orderLines([{ sku: variant.sku, quantity: 2 }])
    expect(lines).toHaveLength(1)
    expect(lines?.[0]).toMatchObject({
      sku: variant.sku,
      quantity: 2,
      price: variant.price,
      options: variant.options,
    })
  })

  it("refuses an unknown SKU and a quantity above the stock", async () => {
    expect(
      linesFromProducts([{ sku: "NO-SUCH-SKU", quantity: 1 }], products)
    ).toBeNull()
    expect(
      linesFromProducts(
        [{ sku: variant.sku, quantity: variant.stock + 1 }],
        products
      )
    ).toBeNull()
  })
})

describe("placeOrder", () => {
  const order = {
    requestId: "0b9a4c1e-5d2f-4a8b-9c3d-7e6f5a4b3c2d",
    values,
    lines: [{ sku: variant.sku, quantity: 1 }],
    couponCode: null,
    // What the checkout shows for one piece sent to the first city
    expectedTotal: calculateTotals({
      subtotal: variant.price,
      city,
      method: "standard",
      coupon: null,
      config,
    }).total,
  }

  it("refuses an empty cart, a repeated SKU, more lines than a cart holds, and a request without an id", async () => {
    const refused = { ok: false, message: expect.stringContaining("السلة") }
    expect(await placeOrder({ ...order, lines: [] })).toEqual(refused)
    expect(
      await placeOrder({ ...order, lines: [order.lines[0], order.lines[0]] })
    ).toEqual(refused)
    expect(
      await placeOrder({
        ...order,
        lines: Array.from({ length: 51 }, (_, index) => ({
          sku: `SKU-${index}`,
          quantity: 1,
        })),
      })
    ).toEqual(refused)
    expect(await placeOrder({ ...order, requestId: "again" })).toEqual(refused)
    expect(findOrderByRequest).not.toHaveBeenCalled()
  })

  it("checks the form again on the server", async () => {
    expect(
      await placeOrder({ ...order, values: { ...values, phone: "123" } })
    ).toEqual({
      ok: false,
      message: "بعض بيانات الطلب غير صحيحة. راجع الحقول ثم أكّد الطلب.",
    })
  })

  it("saves a valid order under its request id and its sender's address", async () => {
    expect(await placeOrder(order)).toEqual({ ok: true, id: "new-order" })
    expect(saveOrder).toHaveBeenCalledWith(
      expect.objectContaining({ total: order.expectedTotal }),
      { requestId: order.requestId, clientIp: SENDER }
    )
    expect(updateTag).toHaveBeenCalledWith("catalog")
  })

  it("answers a request that was already saved with its order, and saves nothing", async () => {
    vi.mocked(findOrderByRequest).mockResolvedValueOnce("earlier-order")
    expect(await placeOrder(order)).toEqual({ ok: true, id: "earlier-order" })
    expect(findOrderByRequest).toHaveBeenCalledWith(order.requestId)
    expect(saveOrder).not.toHaveBeenCalled()
  })

  it("refuses a sender that saved too many orders in an hour", async () => {
    vi.mocked(saveOrder).mockRejectedValueOnce(new OrderLimitError())
    expect(await placeOrder(order)).toEqual({
      ok: false,
      message: expect.stringContaining("طلبات كثيرة"),
    })
    expect(updateTag).not.toHaveBeenCalled()
  })

  it("answers a cart that asks for more than the stock with the stock as it is now", async () => {
    expect(
      await placeOrder({
        ...order,
        lines: [{ sku: variant.sku, quantity: variant.stock + 1 }],
      })
    ).toEqual({
      ok: false,
      message: STOCK_CHANGED,
      cart: expect.objectContaining({
        [variant.sku]: expect.objectContaining({
          stock: variant.stock,
          price: variant.price,
        }),
      }),
    })
    // The cached catalog agrees with the database, so it is left alone
    expect(updateTag).not.toHaveBeenCalled()
    expect(saveOrder).not.toHaveBeenCalled()
  })

  it("expires the cached catalog when the database has moved on", async () => {
    const [product] = await readLiveProducts([variant.sku])
    if (!product) throw new Error("The variant has no product")
    const soldOut = {
      ...product,
      variants: product.variants.map((item) =>
        item.sku === variant.sku ? { ...item, stock: 0 } : item
      ),
    }
    // Read twice: to price the order, then for the refusal's answer
    vi.mocked(readLiveProducts)
      .mockResolvedValueOnce([soldOut])
      .mockResolvedValueOnce([soldOut])
    expect(await placeOrder(order)).toMatchObject({
      ok: false,
      message: STOCK_CHANGED,
      cart: { [variant.sku]: { stock: 0 } },
    })
    expect(updateTag).toHaveBeenCalledWith("catalog")
  })

  it("answers the same way when another order takes the last pieces during the save", async () => {
    vi.mocked(saveOrder).mockRejectedValueOnce(new OutOfStockError(variant.sku))
    expect(await placeOrder(order)).toMatchObject({
      ok: false,
      message: STOCK_CHANGED,
      cart: { [variant.sku]: { stock: variant.stock } },
    })
  })

  it("refuses a product that is no longer sold, and a coupon that doesn't exist", async () => {
    expect(
      await placeOrder({
        ...order,
        lines: [{ sku: "NO-SUCH-SKU", quantity: 1 }],
      })
    ).toEqual({ ok: false, message: STOCK_CHANGED, cart: {} })
    expect(await placeOrder({ ...order, couponCode: "NOPE" })).toEqual({
      ok: false,
      message: "الكوبون لم يعد صالحاً. أزله ثم أكّد الطلب.",
    })
  })

  it("refuses a total other than the one the server computes, with the current prices", async () => {
    expect(await placeOrder({ ...order, expectedTotal: 1 })).toMatchObject({
      ok: false,
      message: expect.stringContaining("تغيّر إجمالي طلبك"),
      cart: { [variant.sku]: { price: variant.price } },
    })
    expect(saveOrder).not.toHaveBeenCalled()
  })

  it("answers with a message, not an exception, when the database is out of reach", async () => {
    vi.spyOn(console, "error").mockImplementationOnce(() => {})
    vi.mocked(findOrderByRequest).mockRejectedValueOnce(new Error("offline"))
    expect(await placeOrder(order)).toEqual({
      ok: false,
      message: "تعذّر حفظ طلبك الآن. حاول مرة أخرى بعد قليل.",
    })
  })
})

describe("lookupCoupon", () => {
  const percent = config.coupons.find((coupon) => coupon.type === "percent")
  const withMinimum = config.coupons.find((coupon) => coupon.minSubtotal > 0)
  if (!percent || !withMinimum) {
    throw new Error(
      "The coupon data needs a percentage coupon and one with a minimum"
    )
  }

  it("finds a code in any letter case", async () => {
    expect(await lookupCoupon(percent.code.toLowerCase(), 1_000_000)).toEqual({
      ok: true,
      coupon: percent,
    })
  })

  it("refuses an unknown code, and a subtotal below the coupon's minimum", async () => {
    expect(await lookupCoupon("NOPE", 1_000_000)).toEqual({
      ok: false,
      message: "رمز الكوبون غير صحيح",
    })
    expect(
      await lookupCoupon(withMinimum.code, withMinimum.minSubtotal - 1)
    ).toMatchObject({ ok: false, message: expect.stringContaining("فأكثر") })
  })
})
