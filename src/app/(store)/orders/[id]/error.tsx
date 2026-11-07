"use client"

import Link from "next/link"
import type { ErrorInfo } from "next/error"
import { ServerCrashIcon } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Button, buttonVariants } from "@/components/ui/button"

/**
 * When the order can't be read, for example while the database is out of reach. The store's frame
 * stays around it, and retry() asks the server for the page again.
 */
export default function OrderError({ retry }: ErrorInfo) {
  return (
    <div className="page-container py-8 md:py-12">
      <EmptyState
        icon={ServerCrashIcon}
        title="تعذّر عرض طلبك الآن"
        description="طلبك محفوظ إن وصلت إلى هذه الصفحة بعد تأكيده. حاول مرة أخرى بعد قليل."
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
