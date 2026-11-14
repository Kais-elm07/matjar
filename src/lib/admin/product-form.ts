import { toWesternDigits } from "@/lib/arabic-digits"
import { toMajorUnits } from "@/lib/money"

/**
 * The admin panel's product form: every field is text as the store owner types it, and the server
 * turns it into the same shape as a product in src/data/products.ts (prices in riyals), so the same
 * rules check it (productSchema in src/modules/catalog/schema.ts). Shared by the form in the browser and
 * the Server Action, so it holds no server code.
 */

export interface ProductImageFields {
  /** /images/products/shirt-1 for a photo prepared by pnpm images, or an uploaded photo's address */
  src: string
  /** The color option this photo shows, such as أبيض (white), or empty */
  color: string
  /** The description for screen readers, or empty to build it from the name and the color */
  alt: string
}

export interface VariantFields {
  sku: string
  /** The options as the owner writes them: المقاس: M، اللون: أبيض (size: M, color: white), or empty */
  options: string
  price: string
  compareAtPrice: string
  stock: string
}

export interface ProductFormValues {
  name: string
  slug: string
  /** The category's slug */
  category: string
  description: string
  /** One specification per line: الخامة: قطن (material: cotton) */
  specs: string
  popularity: string
  createdAt: string
  saleEndsAt: string
  hidden: boolean
  images: ProductImageFields[]
  variants: VariantFields[]
}

export const emptyImage: ProductImageFields = { src: "", color: "", alt: "" }

export const emptyVariant: VariantFields = {
  sku: "",
  options: "",
  price: "",
  compareAtPrice: "",
  stock: "0",
}

/** A new product's form, added today. */
export function emptyProductForm(today: string): ProductFormValues {
  return {
    name: "",
    slug: "",
    category: "",
    description: "",
    specs: "",
    popularity: "0",
    createdAt: today,
    saleEndsAt: "",
    hidden: false,
    images: [{ ...emptyImage }],
    variants: [{ ...emptyVariant }],
  }
}

/** Splits "name: value" (or "name = value") at its first separator. */
function pair(text: string) {
  const match = /^([^:=]+)[:=](.*)$/.exec(text)
  return match
    ? { label: match[1].trim(), value: match[2].trim() }
    : { label: text.trim(), value: "" }
}

/** A number typed with Arabic or Western digits, or NaN, which the product's rules then refuse. */
function number(text: string) {
  const trimmed = toWesternDigits(text).trim()
  return trimmed === "" ? Number.NaN : Number(trimmed)
}

const optional = (text: string) => text.trim() || undefined

/** The options text of a variant, as an object: { "المقاس": "M", "اللون": "أبيض" } */
function parseOptions(text: string): Record<string, string> {
  const options: Record<string, string> = {}
  for (const part of text.split(/[،,]/)) {
    if (!part.trim()) continue
    const { label, value } = pair(part)
    options[label] = value
  }
  return options
}

export function formatOptions(options: Record<string, string>) {
  return Object.entries(options)
    .map(([name, value]) => `${name}: ${value}`)
    .join("، ")
}

/** The form as a product in the shape of src/data/products.ts, for productSchema to check. */
export function toProductInput(values: ProductFormValues) {
  return {
    slug: values.slug.trim(),
    name: values.name.trim(),
    category: values.category,
    description: values.description.trim(),
    specs: values.specs
      .split("\n")
      .filter((line) => line.trim())
      .map(pair),
    popularity: number(values.popularity || "0"),
    createdAt: values.createdAt,
    saleEndsAt: optional(values.saleEndsAt),
    hidden: values.hidden,
    images: values.images
      .filter((image) => image.src.trim())
      .map((image) => ({
        src: image.src.trim(),
        color: optional(image.color),
        alt: optional(image.alt),
      })),
    variants: values.variants.map((variant) => ({
      sku: variant.sku.trim(),
      options: parseOptions(variant.options),
      price: number(variant.price),
      compareAtPrice: variant.compareAtPrice.trim()
        ? number(variant.compareAtPrice)
        : undefined,
      stock: number(variant.stock),
    })),
  }
}

/** A saved product, in the form's fields (prices back in riyals). */
export function productFormFrom(product: {
  name: string
  slug: string
  category: string
  description: string
  specs: { label: string; value: string }[]
  popularity: number
  createdAt: string
  saleEndsAt: string | null
  hidden: boolean
  images: { src: string; color: string | null; alt: string | null }[]
  variants: {
    sku: string
    options: Record<string, string>
    price: number
    compareAtPrice: number | null
    stock: number
  }[]
}): ProductFormValues {
  return {
    name: product.name,
    slug: product.slug,
    category: product.category,
    description: product.description,
    specs: product.specs
      .map(({ label, value }) => `${label}: ${value}`)
      .join("\n"),
    popularity: String(product.popularity),
    createdAt: product.createdAt,
    saleEndsAt: product.saleEndsAt ?? "",
    hidden: product.hidden,
    images: product.images.map((image) => ({
      src: image.src,
      color: image.color ?? "",
      alt: image.alt ?? "",
    })),
    variants: product.variants.map((variant) => ({
      sku: variant.sku,
      options: formatOptions(variant.options),
      price: String(toMajorUnits(variant.price)),
      compareAtPrice:
        variant.compareAtPrice === null
          ? ""
          : String(toMajorUnits(variant.compareAtPrice)),
      stock: String(variant.stock),
    })),
  }
}

/** The store owner's names for the form's fields, for the error messages */
const FIELD_NAMES: Record<string, string> = {
  name: "الاسم",
  slug: "الرابط",
  category: "الفئة",
  description: "الوصف",
  specs: "المواصفات",
  popularity: "ترتيب الأكثر مبيعاً",
  createdAt: "تاريخ الإضافة",
  saleEndsAt: "آخر يوم في العرض",
  images: "الصورة",
  variants: "المتغير",
  src: "المسار",
  color: "اللون",
  alt: "الوصف",
  sku: "الرمز",
  options: "الخيارات",
  price: "السعر",
  compareAtPrice: "السعر قبل الخصم",
  stock: "المخزون",
  label: "الاسم",
  value: "القيمة",
}

/** A field's path as the owner reads it: variants, 1, price → المتغير 2، السعر (variant 2, price) */
export function fieldLabel(path: readonly PropertyKey[]) {
  const parts: string[] = []
  for (const part of path) {
    if (typeof part === "number") {
      parts[parts.length - 1] = `${parts.at(-1) ?? ""} ${part + 1}`
    } else {
      parts.push(FIELD_NAMES[String(part)] ?? String(part))
    }
  }
  return parts.join("، ")
}
