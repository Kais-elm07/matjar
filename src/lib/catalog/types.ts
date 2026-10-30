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
  /**
   * آخر يوم في العرض بصيغة 2026-12-31. يُظهر المنتج في قسم "عروض لفترة محدودة"
   * مع عدّاد تنازلي حقيقي، ويختفي من القسم بعد هذا التاريخ. يحتاج سعراً قبل الخصم.
   */
  saleEndsAt?: string
  /** إخفاء المنتج من الموقع دون حذفه من الملف */
  hidden?: boolean
}

/** لون بطاقة في الصفحة الرئيسية: كحلي بنص أبيض، أو كهرماني أو رمادي فاتح بنص داكن. */
export type BannerTheme = "primary" | "highlight" | "light"

/** بطاقة عرض لمنتج: تؤخذ صورته وسعره من ملف المنتجات تلقائياً. */
export type ProductBannerInput = {
  /** رابط المنتج */
  product: string
  title: string
  text?: string
  /** نص الشارة الصغيرة. الافتراضي: نسبة الخصم إن كان على المنتج خصم */
  tag?: string
  theme: BannerTheme
}

/** بطاقة عرض لفئة: تؤخذ صورتها من ملف الفئات. */
export type CategoryBannerInput = {
  /** رابط الفئة */
  category: string
  title: string
  text?: string
  theme: BannerTheme
}

export type HomeContentInput = {
  /** شرائح العرض الرئيسي أعلى الصفحة */
  heroSlides: ProductBannerInput[]
  /** ثلاث بطاقات عروض تحت شريط الثقة */
  promos: ProductBannerInput[]
  /** بطاقتان للفئات بعد "الأكثر مبيعاً" */
  spotlights: CategoryBannerInput[]
  /** بطاقة عريضة قبل آراء العملاء، أو null لإخفائها */
  wideBanner: ProductBannerInput | null
}

/** رأي عميل حقيقي. لا تضف آراء مختلقة. */
export type TestimonialInput = {
  name: string
  /** صفة العميل أو مدينته، مثل "الرياض" */
  role?: string
  rating: 1 | 2 | 3 | 4 | 5
  title: string
  text: string
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
  saleEndsAt: string | null
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
  /** اسم الفئة الأدق، يظهر فوق اسم المنتج في البطاقة */
  categoryName: string | null
  /** للمنتجات ذات المتغير الواحد: إضافة مباشرة للسلة من البطاقة */
  quickAdd: { sku: string; stock: number } | null
  saleEndsAt: string | null
  /** مسار الفئة بالروابط، للفلترة حسب الفئة */
  categorySlugs: string[]
  /** خيارات المتغيرات وتوفرها، للفلترة حسب المقاس واللون */
  variants: { options: VariantOptions; inStock: boolean }[]
  popularity: number
  createdAt: string
  /** نص مطبّع للبحث العربي */
  searchText: string
}

/** بطاقة عرض لمنتج بعد ربطها ببياناته. */
export type ProductBanner = {
  href: string
  title: string
  text: string | null
  tag: string | null
  theme: BannerTheme
  image: ProductImage | null
  price: number
  compareAtPrice: number | null
  priceVaries: boolean
}

/** بطاقة عرض لفئة بعد ربطها ببياناتها. */
export type CategoryBanner = {
  href: string
  title: string
  text: string | null
  theme: BannerTheme
  image: string | null
}

/** أسعار ومخزون كل متغير حسب رمزه، تقارن به السلة المحفوظة في المتصفح. */
export type CartCatalog = Record<
  string,
  { price: number; compareAtPrice: number | null; stock: number }
>
