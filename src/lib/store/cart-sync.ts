"use client"

import { useEffect, useState } from "react"

import type { CartCatalog } from "@/lib/catalog/types"

import { useCartStore, type CartNotice } from "./cart"
import { useCartRestored } from "./hydration"

let request: Promise<CartCatalog> | null = null

/** تحميل أسعار ومخزون الموقع المنشور مرة واحدة في كل زيارة. */
function loadCartCatalog() {
  request ??= fetch("/cart-catalog.json")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return response.json() as Promise<CartCatalog>
    })
    .catch((error: unknown) => {
      request = null // السماح بإعادة المحاولة في المرة القادمة
      throw error
    })
  return request
}

/**
 * يطابق السلة المحفوظة مع بيانات الموقع الحالية بعد استعادتها: يحدّث الأسعار والمخزون،
 * ويحذف ما نفد أو حُذف، ويعيد قائمة بالتغييرات لعرضها للزائر.
 */
export function useCartSync(enabled = true) {
  const restored = useCartRestored()
  const [notices, setNotices] = useState<CartNotice[]>([])

  useEffect(() => {
    if (!enabled || !restored) return
    let active = true
    loadCartCatalog().then(
      (catalog) => {
        if (!active) return
        const changes = useCartStore.getState().sync(catalog)
        if (changes.length > 0) setNotices(changes)
      },
      () => {} // دون اتصال تبقى السلة كما حُفظت
    )
    return () => {
      active = false
    }
  }, [enabled, restored])

  return { notices, dismiss: () => setNotices([]) }
}
