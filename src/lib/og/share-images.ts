import "server-only"

import type { OverlayOptions } from "sharp"

import { siteConfig } from "@/config/site"
import { PRODUCT_FORMS, pluralize } from "@/lib/arabic-plural"
import type { Catalog } from "@/modules/catalog/build"
import { homeSections } from "@/modules/home/sections"
import type { Category, Product } from "@/modules/catalog/types"
import { getCheckoutConfig } from "@/lib/checkout/config"
import { discountPercent, formatPrice } from "@/lib/money"
import {
  type Layer,
  logoMark,
  OG_COLORS,
  OG_SIZE,
  photoSquare,
  sharePhoto,
  pill,
  type PillOptions,
  renderShareImage,
  text,
} from "@/lib/og/render"

/**
 * Share image designs: the photo on the left, and the text in a column on the right, over a dark background.
 * A cut-out stands on its platform in the light of its tone, as on the site's stage.
 * Colors and font come from DESIGN.md, and the size is 1200×630, which every social platform shows in full.
 */

const MARGIN = 48
/** The photo is a square as tall as the share image minus the two margins */
const IMAGE_SIZE = OG_SIZE.height - MARGIN * 2
const RADIUS = 18
/** The right edge, top and bottom of the text column */
const RIGHT = OG_SIZE.width - 64
const TOP = 64
const BOTTOM = OG_SIZE.height - 64
/** The text column starts after the image, with a gap of 56 */
const COLUMN_LEFT = MARGIN + IMAGE_SIZE + 56
const COLUMN = RIGHT - COLUMN_LEFT

type Placed = OverlayOptions

const atRight = (layer: Layer, top: number, right = RIGHT): Placed => ({
  input: layer.input,
  left: right - layer.width,
  top: Math.round(top),
})

/** The logo and the store name at the top of the column */
async function brandRow(markSize = 56, nameSize = 36) {
  const [mark, name] = await Promise.all([
    logoMark(markSize),
    text(siteConfig.name, {
      size: nameSize,
      weight: 700,
      color: OG_COLORS.foreground,
    }),
  ])
  return {
    layers: [
      { input: mark, left: RIGHT - markSize, top: TOP },
      atRight(name, TOP + (markSize - name.height) / 2, RIGHT - markSize - 16),
    ],
    bottom: TOP + markSize,
  }
}

/** Store facts at the bottom of the column: cash on delivery and the free shipping threshold, one per line. */
async function storeFacts() {
  const options = {
    size: 26,
    weight: 500,
    paddingX: 20,
    paddingY: 7,
  } satisfies Partial<PillOptions>
  const [payment, shipping] = await Promise.all([
    pill("الدفع عند الاستلام", {
      ...options,
      color: OG_COLORS.onPrimary,
      background: OG_COLORS.primary,
    }),
    pill(`شحن مجاني من ${formatPrice(getCheckoutConfig().freeShippingFrom)}`, {
      ...options,
      color: OG_COLORS.foreground,
      border: OG_COLORS.muted,
    }),
  ])
  const gap = 14
  // On one line if the column is wide enough, otherwise one above the other
  if (payment.width + gap + shipping.width <= COLUMN) {
    const top = BOTTOM - Math.max(payment.height, shipping.height)
    return {
      layers: [
        atRight(payment, top),
        atRight(shipping, top, RIGHT - payment.width - gap),
      ],
      top,
    }
  }
  const top = BOTTOM - payment.height - gap - shipping.height
  return {
    layers: [
      atRight(payment, top),
      atRight(shipping, top + payment.height + gap),
    ],
    top,
  }
}

/**
 * The general image: the home page and every page without its own image.
 * Four products from different categories.
 */
export async function siteShareImage(catalog: Catalog) {
  const products = homeSections(catalog)
    .trending.map((group) => group.products[0])
    .slice(0, 4)
  const gap = 16
  const cell = (IMAGE_SIZE - gap) / 2
  const photos = await Promise.all(
    products.map(async (product) =>
      photoSquare(
        product.image ? await sharePhoto(product.image.src) : null,
        product.image,
        cell,
        RADIUS - 4
      )
    )
  )

  const brand = await brandRow(84, 72)
  const [tagline, description, facts] = await Promise.all([
    text(siteConfig.tagline, {
      size: 40,
      weight: 500,
      color: OG_COLORS.foreground,
      width: COLUMN,
      maxLines: 2,
    }),
    text(siteConfig.description, {
      size: 28,
      color: OG_COLORS.muted,
      width: COLUMN,
      maxLines: 4,
    }),
    storeFacts(),
  ])
  const taglineTop = brand.bottom + 40

  return renderShareImage([
    // Ordered from the right, as it is read: the first is at the top right
    ...photos.map((photo, index) => ({
      input: photo.input,
      left: MARGIN + (1 - (index % 2)) * (cell + gap),
      top: MARGIN + Math.floor(index / 2) * (cell + gap),
    })),
    ...brand.layers,
    atRight(tagline, taglineTop),
    atRight(description, taglineTop + tagline.height + 16),
    ...facts.layers,
  ])
}

export async function productShareImage(product: Product) {
  const image = product.images[0]
  const discount = discountPercent(product.price, product.compareAtPrice)
  const [photo, brand] = await Promise.all([
    photoSquare(
      image ? await sharePhoto(image.src) : null,
      image ?? null,
      IMAGE_SIZE,
      RADIUS
    ),
    brandRow(),
  ])
  const layers: Placed[] = [
    { input: photo.input, left: MARGIN, top: MARGIN },
    ...brand.layers,
  ]

  if (discount) {
    const badge = await pill(`خصم ${discount}%`, {
      size: 28,
      weight: 700,
      color: OG_COLORS.onPrimary,
      background: OG_COLORS.primary,
      paddingX: 20,
      paddingY: 8,
    })
    layers.push({
      input: badge.input,
      left: MARGIN + IMAGE_SIZE - 24 - badge.width,
      top: MARGIN + 24,
    })
  }

  let top = brand.bottom + 48
  const categoryName = product.categoryPath.at(-1)?.name
  if (categoryName) {
    const label = await text(categoryName, {
      size: 28,
      weight: 500,
      color: OG_COLORS.muted,
      width: COLUMN,
      maxLines: 1,
    })
    layers.push(atRight(label, top))
    top += label.height + 12
  }
  const name = await text(product.name, {
    size: 50,
    weight: 700,
    color: OG_COLORS.foreground,
    width: COLUMN,
    maxLines: 3,
  })
  layers.push(atRight(name, top))

  // The price at the bottom of the column, next to it the price before discount or the sold-out notice
  const varies = product.maxPrice !== product.price
  const price = await text(
    `${varies ? "من " : ""}${formatPrice(product.price)}`,
    {
      size: 60,
      weight: 700,
      color: product.inStock ? OG_COLORS.primary : OG_COLORS.muted,
    }
  )
  const priceTop = BOTTOM - price.height
  layers.push(atRight(price, priceTop))

  const aside = !product.inStock
    ? await pill("نفد من المخزون", {
        size: 26,
        weight: 500,
        color: OG_COLORS.foreground,
        border: OG_COLORS.muted,
        paddingX: 18,
        paddingY: 6,
      })
    : discount && product.compareAtPrice
      ? await text(formatPrice(product.compareAtPrice), {
          size: 32,
          weight: 500,
          color: OG_COLORS.muted,
          strikethrough: true,
        })
      : null
  if (aside) {
    const right = RIGHT - price.width - 24
    // Next to the price if the column is wide enough, otherwise above it
    layers.push(
      right - aside.width >= COLUMN_LEFT
        ? atRight(aside, priceTop + (price.height - aside.height) / 2, right)
        : atRight(aside, priceTop - aside.height - 8)
    )
  }

  return renderShareImage(layers)
}

export async function categoryShareImage(category: Category) {
  const [photo, brand, facts] = await Promise.all([
    photoSquare(
      category.image ? await sharePhoto(category.image.src) : null,
      category.image,
      IMAGE_SIZE,
      RADIUS
    ),
    brandRow(),
    storeFacts(),
  ])
  // A subcategory is labeled with its parent category's name, and a top-level one with the word "قسم" (section)
  const parent = category.path.at(-2)?.name ?? "قسم"
  const [eyebrow, name, count] = await Promise.all([
    text(parent, {
      size: 28,
      weight: 500,
      color: OG_COLORS.muted,
      width: COLUMN,
      maxLines: 1,
    }),
    text(category.name, {
      size: 68,
      weight: 700,
      color: OG_COLORS.foreground,
      width: COLUMN,
      maxLines: 2,
    }),
    text(pluralize(category.productCount, PRODUCT_FORMS), {
      size: 30,
      weight: 500,
      color: OG_COLORS.primary,
    }),
  ])
  const eyebrowTop = brand.bottom + 48
  const nameTop = eyebrowTop + eyebrow.height + 8

  return renderShareImage([
    { input: photo.input, left: MARGIN, top: MARGIN },
    ...brand.layers,
    atRight(eyebrow, eyebrowTop),
    atRight(name, nameTop),
    atRight(count, nameTop + name.height + 12),
    ...facts.layers,
  ])
}
