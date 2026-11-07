import "server-only"

import { randomInt } from "node:crypto"

import { Prisma } from "@/generated/prisma/client"
import { isVariantOptions } from "@/lib/catalog/guards"
import { readLiveProducts } from "@/lib/catalog/load"
import type { Product, Variant } from "@/lib/catalog/types"
import { imageIndexForOptions } from "@/lib/catalog/variant-selection"
import {
  orderNumber,
  type OrderDraft,
  type OrderLine,
  type PlacedOrder,
} from "@/lib/checkout/order"
import { lineLimit } from "@/lib/checkout/quantity"
import { getDb } from "@/lib/db"

/**
 * Orders in the database: building the lines from the products as they are now, saving an order
 * while lowering the stock, and reading an order back. Server only; the checkout reaches it through
 * the actions in actions.ts.
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

/** Another order took the last pieces between reading the stock and saving: nothing was saved. */
export class OutOfStockError extends Error {
  constructor(readonly sku: string) {
    super(`Not enough stock left for ${sku}`)
  }
}

/** How many numbers to try when the one drawn is taken (10,000 numbers per day). */
const NUMBER_ATTEMPTS = 5

/** The database refused the order because its short number is already taken (a unique field, P2002). */
function isTakenNumber(error: unknown) {
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
 */
export async function saveOrder(draft: OrderDraft, now = new Date()) {
  const { lines, ...order } = draft
  for (let attempt = 1; ; attempt++) {
    try {
      return await getDb().$transaction(async (tx) => {
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
        const saved = await tx.order.create({
          data: {
            ...order,
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
        return saved.id
      })
    } catch (error) {
      if (attempt < NUMBER_ATTEMPTS && isTakenNumber(error)) continue
      throw error
    }
  }
}

/** A saved order by its long id, or null when there is none. */
export async function getOrder(id: string): Promise<PlacedOrder | null> {
  const order = await getDb().order.findUnique({
    where: { id },
    omit: { placedAt: true },
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
