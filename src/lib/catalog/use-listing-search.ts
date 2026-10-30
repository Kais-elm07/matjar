"use client"

import { useLayoutEffect, useSyncExternalStore } from "react"
import { useSearchParams } from "next/navigation"

/**
 * معاملات الرابط لصفحات القوائم (مثل "?sale=1&sort=newest").
 *
 * لماذا لا نستخدم useSearchParams مباشرة؟ في الموقع الثابت يجعل useSearchParams القائمة
 * تُرسم في المتصفح فقط، فتختفي المنتجات من ملف HTML وتتأخر الصور.
 * هنا تُجهَّز القائمة وقت البناء دون فلاتر، ثم تُطبَّق فلاتر الرابط فور تحميل الصفحة.
 */

let current = typeof window === "undefined" ? "" : window.location.search
const listeners = new Set<() => void>()

function emit(next: string) {
  if (next === current) return
  current = next
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** نص معاملات الرابط الحالي. يكون فارغاً أثناء البناء وأول رسم في المتصفح. */
export function useListingSearch() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => ""
  )
}

/** تحديث الرابط دون إعادة تحميل الصفحة، وإبلاغ القوائم فوراً. */
export function updateListingUrl(href: string, push = false) {
  window.history[push ? "pushState" : "replaceState"](null, "", href)
  emit(window.location.search)
}

/**
 * يراقب تغيّر الرابط من أي مصدر: روابط Next.js، وزر الرجوع، وتحديثات الفلاتر.
 * يوضع مرة واحدة في تخطيط المتجر داخل Suspense.
 */
export function SearchParamsListener() {
  const value = useSearchParams().toString()
  // قبل الرسم حتى لا تظهر القائمة دون فلاتر للحظة عند التنقل
  useLayoutEffect(() => {
    emit(value ? `?${value}` : "")
  }, [value])
  return null
}
