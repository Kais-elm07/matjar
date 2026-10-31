import "server-only"

import type { OverlayOptions } from "sharp"

import { siteConfig } from "@/config/site"
import { PRODUCT_FORMS, pluralize } from "@/lib/arabic-plural"
import { getHomeSections } from "@/lib/catalog/catalog"
import { discountPercent, formatPrice } from "@/lib/catalog/money"
import type { Category, Product } from "@/lib/catalog/types"
import { getCheckoutConfig } from "@/lib/checkout/config"
import {
  type Layer,
  localImage,
  logoMark,
  OG_COLORS,
  OG_SIZE,
  pill,
  renderCard,
  roundedImage,
  text,
} from "@/lib/og/render"

/**
 * تصاميم صور المشاركة: الصورة على اليسار، والنص في عمود على اليمين فوق خلفية كحلية.
 * الألوان والخط من DESIGN.md، والمقاس 1200×630 الذي تعرضه كل منصات التواصل كاملاً.
 */

const MARGIN = 48
/** الصورة مربعة بارتفاع البطاقة ناقص الهامشين */
const IMAGE_SIZE = OG_SIZE.height - MARGIN * 2
const RADIUS = 18
/** الحافة اليمنى لعمود النص وأعلاه وأسفله */
const RIGHT = OG_SIZE.width - 64
const TOP = 64
const BOTTOM = OG_SIZE.height - 64
/** عمود النص يبدأ بعد الصورة بمسافة 56 */
const COLUMN_LEFT = MARGIN + IMAGE_SIZE + 56
const COLUMN = RIGHT - COLUMN_LEFT

type Placed = OverlayOptions

const atRight = (layer: Layer, top: number, right = RIGHT): Placed => ({
  input: layer.input,
  left: right - layer.width,
  top: Math.round(top),
})

/** الشعار واسم المتجر أعلى العمود */
async function brandRow(markSize = 56, nameSize = 36) {
  const [mark, name] = await Promise.all([
    logoMark(markSize),
    text(siteConfig.name, {
      size: nameSize,
      weight: 700,
      color: OG_COLORS.onPrimary,
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

/** حقائق المتجر في أسفل العمود: الدفع عند الاستلام وحد الشحن المجاني، كل منهما في سطر. */
async function storeFacts() {
  const options = { size: 26, weight: 500 as const, paddingX: 20, paddingY: 7 }
  const [payment, shipping] = await Promise.all([
    pill("الدفع عند الاستلام", {
      ...options,
      color: OG_COLORS.onHighlight,
      background: OG_COLORS.highlight,
    }),
    pill(`شحن مجاني من ${formatPrice(getCheckoutConfig().freeShippingFrom)}`, {
      ...options,
      color: OG_COLORS.onPrimary,
      border: OG_COLORS.onPrimaryMuted,
    }),
  ])
  const gap = 14
  // في سطر واحد إن اتسع العمود، وإلا فوق بعضهما
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

/** الصورة العامة: الرئيسية وكل صفحة ليس لها صورة خاصة. أربعة منتجات من فئات مختلفة. */
export async function siteCard() {
  const products = getHomeSections()
    .trending.map((group) => group.products[0])
    .slice(0, 4)
  const gap = 16
  const cell = (IMAGE_SIZE - gap) / 2
  const photos = await Promise.all(
    products.map((product) =>
      roundedImage(
        product.image ? localImage(product.image.src) : null,
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
      color: OG_COLORS.onPrimary,
      width: COLUMN,
      maxLines: 2,
    }),
    text(siteConfig.description, {
      size: 28,
      color: OG_COLORS.onPrimaryMuted,
      width: COLUMN,
      maxLines: 4,
    }),
    storeFacts(),
  ])
  const taglineTop = brand.bottom + 40

  return renderCard([
    // الترتيب من اليمين كما يُقرأ: الأول أعلى اليمين
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

export async function productCard(product: Product) {
  const image = product.images[0]
  const discount = discountPercent(product.price, product.compareAtPrice)
  const [photo, brand] = await Promise.all([
    roundedImage(image ? localImage(image.src) : null, IMAGE_SIZE, RADIUS),
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
      color: OG_COLORS.onHighlight,
      background: OG_COLORS.highlight,
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
      color: OG_COLORS.onPrimaryMuted,
      width: COLUMN,
      maxLines: 1,
    })
    layers.push(atRight(label, top))
    top += label.height + 12
  }
  const name = await text(product.name, {
    size: 50,
    weight: 700,
    color: OG_COLORS.onPrimary,
    width: COLUMN,
    maxLines: 3,
  })
  layers.push(atRight(name, top))

  // السعر في أسفل العمود، وبجانبه السعر قبل الخصم أو تنبيه نفاد الكمية
  const varies = product.maxPrice !== product.price
  const price = await text(
    `${varies ? "من " : ""}${formatPrice(product.price)}`,
    {
      size: 60,
      weight: 700,
      color: product.inStock ? OG_COLORS.highlight : OG_COLORS.onPrimaryMuted,
    }
  )
  const priceTop = BOTTOM - price.height
  layers.push(atRight(price, priceTop))

  const aside = !product.inStock
    ? await pill("نفد من المخزون", {
        size: 26,
        weight: 500,
        color: OG_COLORS.onPrimary,
        border: OG_COLORS.onPrimaryMuted,
        paddingX: 18,
        paddingY: 6,
      })
    : discount && product.compareAtPrice
      ? await text(formatPrice(product.compareAtPrice), {
          size: 32,
          weight: 500,
          color: OG_COLORS.onPrimaryMuted,
          strikethrough: true,
        })
      : null
  if (aside) {
    const right = RIGHT - price.width - 24
    // بجانب السعر إن اتسع العمود، وإلا فوقه
    layers.push(
      right - aside.width >= COLUMN_LEFT
        ? atRight(aside, priceTop + (price.height - aside.height) / 2, right)
        : atRight(aside, priceTop - aside.height - 8)
    )
  }

  return renderCard(layers)
}

export async function categoryCard(category: Category) {
  const [photo, brand, facts] = await Promise.all([
    roundedImage(
      category.image ? localImage(category.image) : null,
      IMAGE_SIZE,
      RADIUS
    ),
    brandRow(),
    storeFacts(),
  ])
  // الفئة الفرعية تُعرَّف باسم الفئة الأم، والرئيسية بكلمة "قسم"
  const parent = category.path.at(-2)?.name ?? "قسم"
  const [eyebrow, name, count] = await Promise.all([
    text(parent, {
      size: 28,
      weight: 500,
      color: OG_COLORS.onPrimaryMuted,
      width: COLUMN,
      maxLines: 1,
    }),
    text(category.name, {
      size: 68,
      weight: 700,
      color: OG_COLORS.onPrimary,
      width: COLUMN,
      maxLines: 2,
    }),
    text(pluralize(category.productCount, PRODUCT_FORMS), {
      size: 30,
      weight: 500,
      color: OG_COLORS.highlight,
    }),
  ])
  const eyebrowTop = brand.bottom + 48
  const nameTop = eyebrowTop + eyebrow.height + 8

  return renderCard([
    { input: photo.input, left: MARGIN, top: MARGIN },
    ...brand.layers,
    atRight(eyebrow, eyebrowTop),
    atRight(name, nameTop),
    atRight(count, nameTop + name.height + 12),
    ...facts.layers,
  ])
}
