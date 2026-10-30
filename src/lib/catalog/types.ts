import type { OptionGroup, VariantOptions } from "./options"

// ---------------------------------------------------------------------------
// شكل البيانات كما تُكتب في ملفات src/data (الأسعار بالريال)
// ---------------------------------------------------------------------------

export type CategoryInput = {
  /** الرابط: إنجليزي بأحرف صغيرة وشرطات، مثل "home-kitchen" */
  slug: string
  name: string
  description?: string
  /** مسار الصورة دون امتداد، مثل "/images/categories/clothing" */
  image?: string
  /** رابط الفئة الأب إن كانت فئة فرعية */
  parent?: string
}

export type ProductImageInput = {
  /** مسار الصورة دون امتداد، مثل "/images/products/classic-cotton-shirt-1" */
  src: string
  /** وصف الصورة لقارئات الشاشة. الافتراضي: اسم المنتج */
  alt?: string
  /** قيمة اللون التي تخص الصورة، فيُنقل المعرض إليها عند اختيار هذا اللون */
  color?: string
}

export type VariantInput = {
  sku: string
  /** { "المقاس": "L", "اللون": "أزرق" }، أو اتركه فارغاً لمنتج بلا خيارات */
  options?: Record<string, string>
  price: number
  compareAtPrice?: number
  stock: number
}

export type ProductInput = {
  /** الرابط: إنجليزي بأحرف صغيرة وشرطات، مثل "classic-cotton-shirt" */
  slug: string
  name: string
  /** رابط الفئة (يمكن أن تكون فرعية) */
  category: string
  /** فقرات يفصلها سطر فارغ، والأسطر التي تبدأ بـ "- " تصبح نقاطاً */
  description: string
  specs?: { label: string; value: string }[]
  images: ProductImageInput[]
  variants: VariantInput[]
  /** للترتيب حسب "الأكثر مبيعاً": رقم أكبر يعني ظهوراً أعلى */
  popularity?: number
  /** تاريخ الإضافة بصيغة 2026-10-30، للترتيب حسب "الأحدث" */
  createdAt: string
  /** إخفاء المنتج من الموقع دون حذفه من الملف */
  hidden?: boolean
}

// ---------------------------------------------------------------------------
// الشكل الموحّد بعد التحقق (الأسعار بأصغر وحدة: هللة)
// ---------------------------------------------------------------------------

export type CategoryLink = { slug: string; name: string }

/** فئة في فلتر الفئات: الاسم والرابط والفئة الأم */
export type CategoryOption = CategoryLink & { parentSlug: string | null }

export type Category = {
  slug: string
  name: string
  description: string | null
  image: string | null
  parentSlug: string | null
  childSlugs: string[]
  /** المسار من الفئة الرئيسية حتى هذه الفئة */
  path: CategoryLink[]
  /** عدد المنتجات في الفئة وفئاتها الفرعية */
  productCount: number
}

export type ProductImage = {
  src: string
  alt: string
  color: string | null
}

export type Variant = {
  sku: string
  options: VariantOptions
  price: number
  compareAtPrice: number | null
  stock: number
}

export type Product = {
  slug: string
  name: string
  description: string
  specs: { label: string; value: string }[]
  categoryPath: CategoryLink[]
  images: ProductImage[]
  variants: Variant[]
  optionGroups: OptionGroup[]
  /** أقل سعر بين المتغيرات */
  price: number
  /** السعر قبل الخصم لأرخص متغير إن وُجد خصم */
  compareAtPrice: number | null
  maxPrice: number
  inStock: boolean
  popularity: number
  createdAt: string
}

/** بيانات البطاقة: كل ما تحتاجه القوائم والبحث والفلاتر في المتصفح. */
export type ProductCard = {
  slug: string
  name: string
  price: number
  compareAtPrice: number | null
  priceVaries: boolean
  inStock: boolean
  image: ProductImage | null
  /** مسار الفئة بالروابط، للفلترة حسب الفئة */
  categorySlugs: string[]
  /** خيارات المتغيرات وتوفرها، للفلترة حسب المقاس واللون */
  variants: { options: VariantOptions; inStock: boolean }[]
  popularity: number
  createdAt: string
  /** نص مطبّع للبحث العربي */
  searchText: string
}
