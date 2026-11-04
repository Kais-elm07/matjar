/**
 * محمّل الصور للموقع الثابت (لا يوجد خادم يغيّر أحجام الصور).
 *
 * الصور المحلية تُجهَّز مسبقاً بثلاثة أحجام بالأمر pnpm images، وهنا نختار أصغر حجم يكفي الشاشة.
 * المسار في البيانات يُكتب دون امتداد:
 *   /images/products/shirt-1  يصبح  /images/products/shirt-1-800.webp
 * الروابط الكاملة (https://...) والمسارات التي لها امتداد تُستخدم كما هي.
 * الأحجام نفسها في scripts/images.mjs (WIDTHS) وnext.config.ts (deviceSizes).
 */
export const IMAGE_WIDTHS = [400, 800, 1200] as const

const isExternal = (src: string) => /^https?:\/\//.test(src)
const hasExtension = (src: string) => /\.[a-z0-9]{2,5}(\?.*)?$/i.test(src)

/**
 * مسار ملف الصورة المجهز بأصغر عرض يكفي: /images/products/shirt-1 بعرض 700 يصبح ...-800.webp.
 * يستخدمه المحمّل وصور المشاركة وفحص الصور وقت البناء.
 */
export function imageFile(src: string, width: number) {
  if (isExternal(src) || hasExtension(src)) return src
  const size =
    IMAGE_WIDTHS.find((available) => available >= width) ??
    IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1]
  return `${src}-${size}.webp`
}

type ImageLoaderParams = {
  src: string
  width: number
  quality?: number
}

export default function imageLoader({ src, width }: ImageLoaderParams) {
  if (src.startsWith("data:")) return src
  if (isExternal(src) || hasExtension(src)) {
    // إضافة العرض للرابط فقط حتى يعرف Next.js أن المحمّل يراعي الحجم
    return `${src}${src.includes("?") ? "&" : "?"}w=${width}`
  }
  return imageFile(src, width)
}
