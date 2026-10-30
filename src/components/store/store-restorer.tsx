"use client"

import { useRestoreStores } from "@/lib/store/hydration"

/** يستعيد السلة والمفضلة المحفوظتين في المتصفح بعد أول عرض للصفحة. */
export function StoreRestorer() {
  useRestoreStores()
  return null
}
