import type { ProductImageInput, VariantInput } from "./types"

/**
 * صور المنتج بالترتيب: slug-1، slug-2، ...
 * مرّر عدد الصور، أو قائمة بلون كل صورة (null لصورة لا تخص لوناً بعينه).
 *
 * productImages("classic-cotton-shirt", ["أبيض", "أزرق"])
 * يعني: /images/products/classic-cotton-shirt-1 (أبيض) و ...-2 (أزرق)
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
   * بادئة رمز المنتج، تُضاف لها أرقام تلقائياً: SHIRT-01، SHIRT-02...
   * الأرقام تتبع ترتيب القيم، فإعادة ترتيبها بعد النشر تغيّر الرموز،
   * والسلة المحفوظة تحذف عندها السطر الذي تغيّرت خياراته بدل أن تخلطه بمتغير آخر.
   */
  sku: string
  price: number
  compareAtPrice?: number
  stock: number
}

type VariantOverride = Partial<Omit<VariantInput, "sku" | "options">>

/**
 * يولّد متغيراً لكل تركيبة من الخيارات، بدل كتابتها يدوياً.
 *
 * optionMatrix(
 *   { المقاس: ["S", "M", "L"], اللون: ["أبيض", "أزرق"] },
 *   { sku: "SHIRT", price: 129, stock: 10 },
 *   // تعديلات اختيارية: لقيمة واحدة ("L") أو لتركيبة كاملة ("L/أزرق")
 *   { L: { price: 139 }, "S/أزرق": { stock: 0 } }
 * )
 * ينتج 6 متغيرات. التعديل على التركيبة الكاملة يتقدم على تعديل القيمة الواحدة،
 * ومفتاح تعديل لا يطابق أي قيمة أو تركيبة (خطأ إملائي مثلاً) يوقف البناء برسالة واضحة.
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

/** متغير واحد لمنتج بلا خيارات (مقاس أو لون). */
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
