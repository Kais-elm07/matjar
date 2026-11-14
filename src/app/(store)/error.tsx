"use client"

import type { ErrorInfo } from "next/error"
import { TriangleAlertIcon } from "lucide-react"

import { ErrorMessage } from "@/components/shared/error-message"

/**
 * When a store page fails, on the server or in the browser. The store's frame stays around it, so the
 * header, the search and the cart keep working, and retry() asks the server for the page again.
 * The order page has a message of its own (orders/[id]/error.tsx).
 */
export default function StoreError({ error, retry }: ErrorInfo) {
  return (
    <ErrorMessage
      icon={TriangleAlertIcon}
      title="تعذّر عرض هذه الصفحة"
      description="حدث خطأ غير متوقع. حاول مرة أخرى، أو عُد إلى الصفحة الرئيسية."
      error={error}
      retry={retry}
    />
  )
}
