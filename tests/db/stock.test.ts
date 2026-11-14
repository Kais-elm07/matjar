import { randomUUID } from "node:crypto"

import { afterAll, beforeAll, describe, expect, it } from "vitest"

import type { OrderDraft } from "@/modules/checkout/order"
import {
  findOrderByRequest,
  OrderLimitError,
  ORDERS_PER_HOUR,
  OutOfStockError,
  saveOrder,
  type OrderSender,
} from "@/modules/checkout/orders-db"
import { getDb } from "@/lib/db"

/**
 * Saving an order against the real database (pnpm test:db, after pnpm db:start, db:deploy and db:seed):
 * the stock goes down in the same transaction, the last piece is sold once even when two orders
 * arrive together, an order with one line out of stock saves nothing, a request that arrives twice is
 * saved once, and an address is stopped at its hourly number of orders, even when it sends them all at
 * once. The test puts every stock and order it touches back as it was. The addresses are reserved for
 * documentation (203.0.113.0/24), so they are never a real visitor's.
 */

const db = getDb()
const CUSTOMER = "اختبار المخزون"

let first: { sku: string; stock: number }
let second: { sku: string; stock: number }

function draft(lines: { sku: string; quantity: number }[]): OrderDraft {
  return {
    customerName: CUSTOMER,
    phone: "0500000000",
    email: null,
    city: "الرياض",
    address: "حي الاختبار",
    notes: null,
    shippingMethod: "standard",
    deliveryTime: "2-4 أيام عمل",
    couponCode: null,
    subtotal: 100,
    discount: 0,
    shippingFee: 0,
    total: 100,
    lines: lines.map(({ sku, quantity }) => ({
      sku,
      slug: "stock-test",
      name: "اختبار",
      options: {},
      quantity,
      price: 100,
      image: null,
    })),
  }
}

/** A new request each time, from a visitor whose address the host doesn't report. */
const sender = (): OrderSender => ({ requestId: randomUUID(), clientIp: null })

const setStock = (sku: string, stock: number) =>
  db.variant.update({ where: { sku }, data: { stock } })

const stockOf = async (sku: string) =>
  (await db.variant.findUniqueOrThrow({ where: { sku } })).stock

beforeAll(async () => {
  const variants = await db.variant.findMany({
    where: { product: { hidden: false } },
    orderBy: { sku: "asc" },
    take: 2,
  })
  if (variants.length < 2) {
    throw new Error("The database has no products: run pnpm db:seed first")
  }
  ;[first, second] = variants.map(({ sku, stock }) => ({ sku, stock }))
  // What a run that was stopped halfway left behind
  await db.order.deleteMany({ where: { customerName: CUSTOMER } })
})

afterAll(async () => {
  await db.order.deleteMany({ where: { customerName: CUSTOMER } })
  await setStock(first.sku, first.stock)
  await setStock(second.sku, second.stock)
  await db.$disconnect()
})

describe("saving an order", () => {
  it("lowers the stock of each line", async () => {
    await setStock(first.sku, 5)
    await saveOrder(draft([{ sku: first.sku, quantity: 2 }]), sender())
    expect(await stockOf(first.sku)).toBe(3)
  })

  it("sells the last piece once when two orders arrive together", async () => {
    await setStock(first.sku, 1)
    const results = await Promise.allSettled([
      saveOrder(draft([{ sku: first.sku, quantity: 1 }]), sender()),
      saveOrder(draft([{ sku: first.sku, quantity: 1 }]), sender()),
    ])
    const refused = results.filter(
      (result): result is PromiseRejectedResult => result.status === "rejected"
    )
    expect(results.length - refused.length).toBe(1)
    expect(refused).toHaveLength(1)
    expect(refused[0].reason).toBeInstanceOf(OutOfStockError)
    expect(await stockOf(first.sku)).toBe(0)
  })

  it("saves nothing of an order when one of its lines is out of stock", async () => {
    await setStock(first.sku, 4)
    await setStock(second.sku, 0)
    const before = await db.order.count({ where: { customerName: CUSTOMER } })
    await expect(
      saveOrder(
        draft([
          { sku: first.sku, quantity: 1 },
          { sku: second.sku, quantity: 1 },
        ]),
        sender()
      )
    ).rejects.toBeInstanceOf(OutOfStockError)
    expect(await stockOf(first.sku)).toBe(4)
    expect(await db.order.count({ where: { customerName: CUSTOMER } })).toBe(
      before
    )
  })

  it("saves a request once when it arrives again, even at the same moment", async () => {
    await setStock(first.sku, 5)
    const order = draft([{ sku: first.sku, quantity: 1 }])
    const request = sender()
    const [id, sameMoment] = await Promise.all([
      saveOrder(order, request),
      saveOrder(order, request),
    ])
    expect(sameMoment).toBe(id)
    expect(await saveOrder(order, request)).toBe(id)
    expect(await findOrderByRequest(request.requestId)).toBe(id)
    expect(await findOrderByRequest(randomUUID())).toBeNull()
    expect(await stockOf(first.sku)).toBe(4)
  })

  it("stops an address at its hourly number of orders, until the hour has passed", async () => {
    await setStock(first.sku, 100)
    const clientIp = "203.0.113.7"
    const order = draft([{ sku: first.sku, quantity: 1 }])
    for (let saved = 0; saved < ORDERS_PER_HOUR; saved++) {
      await saveOrder(order, { requestId: randomUUID(), clientIp })
    }
    await expect(
      saveOrder(order, { requestId: randomUUID(), clientIp })
    ).rejects.toBeInstanceOf(OrderLimitError)
    expect(await stockOf(first.sku)).toBe(100 - ORDERS_PER_HOUR)
    // Another address may order, and so may this one an hour later
    await saveOrder(order, { requestId: randomUUID(), clientIp: "203.0.113.8" })
    const anHourLater = new Date(Date.now() + 3_600_000)
    await saveOrder(order, { requestId: randomUUID(), clientIp }, anHourLater)
  })

  it("counts the orders an address sends all at once one at a time", async () => {
    await setStock(first.sku, 100)
    const clientIp = "203.0.113.9"
    const order = draft([{ sku: first.sku, quantity: 1 }])
    const results = await Promise.allSettled(
      Array.from({ length: ORDERS_PER_HOUR * 3 }, () =>
        saveOrder(order, { requestId: randomUUID(), clientIp })
      )
    )
    const refused = results.filter(
      (result): result is PromiseRejectedResult => result.status === "rejected"
    )
    expect(results.length - refused.length).toBe(ORDERS_PER_HOUR)
    expect(
      refused.every((result) => result.reason instanceof OrderLimitError)
    ).toBe(true)
    expect(await stockOf(first.sku)).toBe(100 - ORDERS_PER_HOUR)
  })

  it("saves a request from an address once, when it arrives again while the first is saved", async () => {
    await setStock(first.sku, 5)
    const order = draft([{ sku: first.sku, quantity: 1 }])
    const request = { requestId: randomUUID(), clientIp: "203.0.113.10" }
    const [id, sameMoment] = await Promise.all([
      saveOrder(order, request),
      saveOrder(order, request),
    ])
    expect(sameMoment).toBe(id)
    expect(await stockOf(first.sku)).toBe(4)
  })
})
