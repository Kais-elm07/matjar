"use client"

import Link from "next/link"
import type { ErrorInfo } from "next/error"
import { TriangleAlertIcon } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Button, buttonVariants } from "@/components/ui/button"

/**
 * When a store page fails, on the server or in the browser. The store's frame stays around it, so the
 * header, the search and the cart keep working, and retry() asks the server for the page again.
 * The order page has a message of its own (orders/[id]/error.tsx).
 */
export default function StoreError({ retry }: ErrorInfo) {
  return (
    <div className="page-container py-8 md:py-12">
      <EmptyState
        icon={TriangleAlertIcon}
        title="تعذّر عرض هذه الصفحة"
        description="حدث خطأ غير متوقع. حاول مرة أخرى، أو عُد إلى الصفحة الرئيسية."
        className="mx-auto max-w-3xl"
      >
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="cta" size="xl" onClick={() => retry()}>
            حاول مرة أخرى
          </Button>
          <Link href="/" className={buttonVariants({ size: "xl" })}>
            الصفحة الرئيسية
          </Link>
        </div>
      </EmptyState>
    </div>
  )
}
