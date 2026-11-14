"use client"

import type { ErrorInfo } from "next/error"
import { ServerCrashIcon } from "lucide-react"

import { ErrorMessage } from "@/components/shared/error-message"

/**
 * When the order can't be read, for example while the database is out of reach. The store's frame
 * stays around it, and retry() asks the server for the page again.
 */
export default function OrderError({ error, retry }: ErrorInfo) {
  return (
    <ErrorMessage
      icon={ServerCrashIcon}
      title="تعذّر عرض طلبك الآن"
      description="طلبك محفوظ إن وصلت إلى هذه الصفحة بعد تأكيده. حاول مرة أخرى بعد قليل."
      error={error}
      retry={retry}
    />
  )
}
