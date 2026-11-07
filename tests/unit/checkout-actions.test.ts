import { describe, expect, it } from "vitest"

import { getProducts } from "@/lib/catalog/catalog"
import { lookupCoupon, placeOrder } from "@/lib/checkout/actions"
import { getCheckoutConfig } from "@/lib/checkout/config"
import type { CheckoutInput } from "@/lib/checkout/form-schema"
import { linesFromProducts, orderLines } from "@/lib/checkout/orders"

/**
 * What the server checks before it saves anything. The unit tests read the products from src/data
 * instead of the database (tests/unit/support/catalog-load.ts); saving and lowering the stock are
 * covered by the database tests (tests/db) and the browser tests.
 */

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
    values,
    lines: [{ sku: variant.sku, quantity: 1 }],
    couponCode: null,
    expectedTotal: 0,
  }

  it("refuses an empty cart or a repeated SKU", async () => {
    expect(await placeOrder({ ...order, lines: [] })).toMatchObject({
      ok: false,
    })
    expect(
      await placeOrder({
        ...order,
        lines: [order.lines[0], order.lines[0]],
      })
    ).toMatchObject({ ok: false })
  })

  it("checks the form again on the server", async () => {
    expect(
      await placeOrder({ ...order, values: { ...values, phone: "123" } })
    ).toEqual({
      ok: false,
      message: "بعض بيانات الطلب غير صحيحة. راجع الحقول ثم أكّد الطلب.",
    })
  })

  it("refuses a product that is no longer sold, and a coupon that doesn't exist", async () => {
    expect(
      await placeOrder({
        ...order,
        lines: [{ sku: "NO-SUCH-SKU", quantity: 1 }],
      })
    ).toEqual({
      ok: false,
      message: "تغيّر توفر بعض المنتجات في سلتك. راجع السلة ثم أكّد الطلب.",
    })
    expect(await placeOrder({ ...order, couponCode: "NOPE" })).toEqual({
      ok: false,
      message: "الكوبون لم يعد صالحاً. أزله ثم أكّد الطلب.",
    })
  })

  it("refuses a total other than the one the server computes", async () => {
    expect(await placeOrder({ ...order, expectedTotal: 1 })).toMatchObject({
      ok: false,
      message: expect.stringContaining("تغيّر إجمالي طلبك"),
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
