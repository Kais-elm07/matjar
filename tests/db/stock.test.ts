import { afterAll, beforeAll, describe, expect, it } from "vitest"

import type { OrderDraft } from "@/lib/checkout/order"
import { OutOfStockError, saveOrder } from "@/lib/checkout/orders"
import { getDb } from "@/lib/db"

/**
 * Saving an order against the real database (pnpm test:db, after pnpm db:start, db:deploy and db:seed):
 * the stock goes down in the same transaction, the last piece is sold once even when two orders
 * arrive together, and an order with one line out of stock saves nothing. The test puts every stock
 * and order it touches back as it was.
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
    await saveOrder(draft([{ sku: first.sku, quantity: 2 }]))
    expect(await stockOf(first.sku)).toBe(3)
  })

  it("sells the last piece once when two orders arrive together", async () => {
    await setStock(first.sku, 1)
    const results = await Promise.allSettled([
      saveOrder(draft([{ sku: first.sku, quantity: 1 }])),
      saveOrder(draft([{ sku: first.sku, quantity: 1 }])),
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
        ])
      )
    ).rejects.toBeInstanceOf(OutOfStockError)
    expect(await stockOf(first.sku)).toBe(4)
    expect(await db.order.count({ where: { customerName: CUSTOMER } })).toBe(
      before
    )
  })
})
