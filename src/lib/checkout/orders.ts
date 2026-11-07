import "server-only"

import { randomInt } from "node:crypto"

import { Prisma } from "@/generated/prisma/client"
import { getVariant } from "@/lib/catalog/catalog"
import { isVariantOptions } from "@/lib/catalog/guards"
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
 * Orders in the database: rebuilding the lines from the catalog, saving an order and reading it back.
 * Server only; the checkout reaches it through the actions in actions.ts.
 */

/** What the visitor's cart asks for. Names, photos and prices come from the catalog, never from the browser. */
export type RequestedLine = { sku: string; quantity: number }

/**
 * The order's lines with the catalog's names, photos and prices, or null when a product is no longer
 * sold or its stock doesn't cover the quantity.
 */
export async function linesFromCatalog(requested: RequestedLine[]) {
  const lines: OrderLine[] = []
  for (const { sku, quantity } of requested) {
    const found = await getVariant(sku)
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

/** How many numbers to try when the one drawn is taken (10,000 numbers per day). */
const NUMBER_ATTEMPTS = 5

/** The database refused the order because its short number is already taken (a unique field, P2002). */
function isTakenNumber(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  )
}

/** Saves the order and its lines together, with a new short number, and returns its long id. */
export async function saveOrder(draft: OrderDraft, now = new Date()) {
  const { lines, ...order } = draft
  for (let attempt = 1; ; attempt++) {
    try {
      const saved = await getDb().order.create({
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
