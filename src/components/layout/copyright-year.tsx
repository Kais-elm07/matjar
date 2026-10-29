import { cacheLife } from "next/cache"

/**
 * السنة الحالية لنص حقوق النشر.
 * تُحفظ مؤقتاً وتُحدّث يومياً، حتى تبقى الصفحة قابلة للتجهيز المسبق السريع.
 */
export async function CopyrightYear() {
  "use cache"
  cacheLife("days")
  return new Date().getFullYear()
}
