import type { ProductImageInput, VariantInput } from "@/modules/catalog/types"

/**
 * Product images in order: slug-1, slug-2, ...
 * Pass the number of images, or a list with the color of each image (null for an image that belongs to no particular color).
 *
 * productImages("classic-cotton-shirt", ["أبيض", "أزرق"])
 * means: /images/products/classic-cotton-shirt-1 (أبيض, white) and ...-2 (أزرق, blue)
 */
export function productImages(
  slug: string,
  shots: number | (string | null)[]
): ProductImageInput[] {
  const colors = typeof shots === "number" ? Array(shots).fill(null) : shots
  return colors.map((color, index) => ({
    src: `/images/products/${slug}-${index + 1}`,
    ...(color ? { color } : {}),
  }))
}

type VariantBase = {
  /**
   * The product SKU prefix; numbers are added to it automatically: SHIRT-01, SHIRT-02...
   * The numbers follow the order of the values, so reordering them after publishing changes the SKUs,
   * and the saved cart then removes the line whose options changed instead of mixing it up with another variant.
   */
  sku: string
  price: number
  compareAtPrice?: number
  stock: number
}

type VariantOverride = Partial<Omit<VariantInput, "sku" | "options">>

/**
 * Generates a variant for every combination of options, instead of writing them by hand.
 *
 * optionMatrix(
 *   { المقاس: ["S", "M", "L"], اللون: ["أبيض", "أزرق"] }, // size; color: white, blue
 *   { sku: "SHIRT", price: 129, stock: 10 },
 *   // Optional overrides: for a single value ("L") or for a full combination ("L/أزرق")
 *   { L: { price: 139 }, "S/أزرق": { stock: 0 } }
 * )
 * produces 6 variants. An override for the full combination takes precedence over a single-value override,
 * and an override key that matches no value or combination (a typo, for example) stops the build with a clear message.
 */
export function optionMatrix(
  options: Record<string, string[]>,
  base: VariantBase,
  overrides: Record<string, VariantOverride> = {}
): VariantInput[] {
  const names = Object.keys(options)
  let combinations: Record<string, string>[] = [{}]
  for (const name of names) {
    combinations = combinations.flatMap((combination) =>
      options[name].map((value) => ({ ...combination, [name]: value }))
    )
  }

  const known = new Set([
    ...Object.values(options).flat(),
    ...combinations.map((combination) =>
      names.map((name) => combination[name]).join("/")
    ),
  ])
  const unknown = Object.keys(overrides).filter((key) => !known.has(key))
  if (unknown.length > 0) {
    throw new Error(
      `optionMatrix("${base.sku}"): مفاتيح تعديل لا تطابق أي قيمة أو تركيبة: ${unknown.join("، ")}. اكتب القيمة كما في الخيارات، والتركيبة بترتيبها مفصولة بـ /، مثل "L/أزرق".`
    )
  }

  return combinations.map((combination, index) => {
    const values = names.map((name) => combination[name])
    const singleValueOverrides = values.map((value) => overrides[value] ?? {})
    const combinationOverride = overrides[values.join("/")] ?? {}
    return {
      sku: `${base.sku}-${String(index + 1).padStart(2, "0")}`,
      options: combination,
      price: base.price,
      compareAtPrice: base.compareAtPrice,
      stock: base.stock,
      ...Object.assign({}, ...singleValueOverrides),
      ...combinationOverride,
    }
  })
}

/** A single variant for a product without options (size or color). */
export function singleVariant(base: VariantBase): VariantInput[] {
  return [
    {
      sku: base.sku,
      price: base.price,
      compareAtPrice: base.compareAtPrice,
      stock: base.stock,
    },
  ]
}
