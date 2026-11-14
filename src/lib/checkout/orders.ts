import "server-only"

import { randomInt } from "node:crypto"

import { Prisma } from "@/generated/prisma/client"
import { cartCatalogOf } from "@/modules/catalog/queries"
import { isVariantOptions } from "@/modules/catalog/guards"
import { readLiveProducts } from "@/modules/catalog/load"
import type { Product, Variant } from "@/modules/catalog/types"
import { imageIndexForOptions } from "@/modules/catalog/variant-selection"
import {
  orderNumber,
  type OrderDraft,
  type OrderLine,
  type PlacedOrder,
} from "@/lib/checkout/order"
import { lineLimit } from "@/modules/cart/quantity"
import { getDb } from "@/lib/db"

/**
 * Orders in the database: building the lines from the products as they are now, saving an order
 * while lowering the stock, recognizing a request that was already saved or a sender with too many
 * orders, and reading an order back. Server only; the checkout reaches it through the actions in
 * actions.ts.
 */

/** What the visitor's cart asks for. Names, photos and prices come from the database, never from the browser. */
export type RequestedLine = { sku: string; quantity: number }

/**
 * The order's lines from the given products, or null when one of the SKUs is no longer sold or its
 * stock doesn't cover the quantity.
 */
export function linesFromProducts(
  requested: RequestedLine[],
  products: Product[]
) {
  const bySku = new Map<string, { product: Product; variant: Variant }>()
  for (const product of products) {
    for (const variant of product.variants) {
      bySku.set(variant.sku, { product, variant })
    }
  }
  const lines: OrderLine[] = []
  for (const { sku, quantity } of requested) {
    const found = bySku.get(sku)
    if (!found || quantity > lineLimit(found.variant.stock)) return null
    const { product, variant } = found
    const image =
      product.images[imageIndexForOptions(product, variant.options, 0)]
    lines.push({
      sku,
      slug: product.slug,
      name: product.name,
      options: variant.options,
      quantity,
      price: variant.price,
      image: image ? { src: image.src, alt: image.alt } : null,
    })
  }
  return lines
}

/** The order's lines priced from the database now: the cached pages may be a little behind. */
export async function orderLines(requested: RequestedLine[]) {
  const products = await readLiveProducts(requested.map((line) => line.sku))
  return linesFromProducts(requested, products)
}

/**
 * The prices and stock of the products these lines name, read from the database now, in the shape the
 * cart in the browser syncs with. It goes back with a refused order, so the cart catches up at once.
 */
export async function liveCartCatalog(requested: RequestedLine[]) {
  return cartCatalogOf(
    await readLiveProducts(requested.map((line) => line.sku))
  )
}

/** Who sent an order: the checkout's id for it, and the visitor's network address when the host reports one. */
export type OrderSender = { requestId: string; clientIp: string | null }

/** The long id of the order already saved for this request id, or null when the request is new. */
export async function findOrderByRequest(requestId: string) {
  const order = await getDb().order.findUnique({
    where: { requestId },
    select: { id: true },
  })
  return order?.id ?? null
}

/**
 * How many orders one address may save in an hour: far more than a customer places, and few enough to
 * keep a script from emptying the stock or filling the database.
 */
export const ORDERS_PER_HOUR = 10

const HOUR = 3_600_000

/** Whether this address has already saved as many orders in the last hour as one sender may. */
export async function reachedOrderLimit(clientIp: string, now = new Date()) {
  const saved = await getDb().order.count({
    where: { clientIp, placedAt: { gt: new Date(now.getTime() - HOUR) } },
  })
  return saved >= ORDERS_PER_HOUR
}

/** Another order took the last pieces between reading the stock and saving: nothing was saved. */
export class OutOfStockError extends Error {
  constructor(readonly sku: string) {
    super(`Not enough stock left for ${sku}`)
  }
}

/** How many numbers to try when the one drawn is taken (10,000 numbers per day). */
const NUMBER_ATTEMPTS = 5

/** The database refused the order because one of its unique values is already taken (P2002): its short number, or its request id. */
function isTakenValue(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  )
}

/**
 * Saves the order and its lines and lowers the stock of each variant, all in one transaction, with a
 * new short number, and returns the order's long id. A variant's stock goes down only while it still
 * covers the quantity, so two visitors can't both buy the last piece: the second one gets an
 * OutOfStockError and nothing of that order is saved.
 *
 * The order's row is written first, under the sender's request id, which the database keeps unique.
 * When the same request arrives twice at once (a retry while the first try is still being saved), the
 * second one waits for the first, saves nothing, and returns the first one's id.
 */
export async function saveOrder(
  draft: OrderDraft,
  sender: OrderSender,
  now = new Date()
) {
  const { lines, ...order } = draft
  for (let attempt = 1; ; attempt++) {
    try {
      return await getDb().$transaction(async (tx) => {
        const saved = await tx.order.create({
          data: {
            ...order,
            ...sender,
            number: orderNumber(now, randomInt(10_000)),
            placedAt: now,
            lines: {
              create: lines.map(({ image, ...line }) => ({
                ...line,
                imageSrc: image?.src ?? null,
                imageAlt: image?.alt ?? null,
              })),
            },
          },
          select: { id: true },
        })
        // Always in the same order of SKUs, so two orders that share variants can't wait on each
        // other's locks
        const bySku = [...lines].sort((a, b) => a.sku.localeCompare(b.sku))
        for (const line of bySku) {
          const { count } = await tx.variant.updateMany({
            where: {
              sku: line.sku,
              stock: { gte: line.quantity },
              product: { hidden: false },
            },
            data: { stock: { decrement: line.quantity } },
          })
          if (count === 0) throw new OutOfStockError(line.sku)
        }
        return saved.id
      })
    } catch (error) {
      if (!isTakenValue(error)) throw error
      const saved = await findOrderByRequest(sender.requestId)
      if (saved) return saved
      // The short number is the one that is taken: draw another
      if (attempt === NUMBER_ATTEMPTS) throw error
    }
  }
}

/** A saved order by its long id, or null when there is none. */
export async function getOrder(id: string): Promise<PlacedOrder | null> {
  const order = await getDb().order.findUnique({
    where: { id },
    omit: { placedAt: true, requestId: true, clientIp: true },
    include: { lines: { orderBy: { id: "asc" } } },
  })
  if (!order) return null
  const { lines, ...fields } = order
  return {
    ...fields,
    lines: lines.map((line) => ({
      sku: line.sku,
      slug: line.slug,
      name: line.name,
      // Stored as JSON, so it is checked like any data read at runtime
      options: isVariantOptions(line.options) ? line.options : {},
      quantity: line.quantity,
      price: line.price,
      image: line.imageSrc
        ? { src: line.imageSrc, alt: line.imageAlt ?? "" }
        : null,
    })),
  }
}
