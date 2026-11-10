"use client"

import { TriangleAlertIcon } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Button, buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"

import { HTML_CLASSES } from "./fonts"
import "./globals.css"

/**
 * The last resort, when the error is in the store's frame itself (the header, the root layout) or in a
 * page outside the store group, so no error page closer to it can show. It takes the place of the whole
 * document: it writes its own <html> with the store's font and styles, and has no header or router to
 * lean on. Both actions load a page from the server again, because that is what clears a part of the
 * site that failed to download; so the way home is a plain link, not next/link.
 */
export default function GlobalError() {
  return (
    <html lang="ar" dir="rtl" className={HTML_CLASSES}>
      <body className="flex min-h-full flex-col">
        <title>{`حدث خطأ غير متوقع | ${siteConfig.name}`}</title>
        <main className="page-container flex flex-1 items-center py-8 md:py-12">
          <EmptyState
            icon={TriangleAlertIcon}
            title="حدث خطأ غير متوقع"
            description="تعذّر عرض الصفحة. أعد تحميلها، أو عُد إلى الصفحة الرئيسية."
            className="mx-auto w-full max-w-3xl"
          >
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                variant="cta"
                size="xl"
                onClick={() => window.location.reload()}
              >
                أعد تحميل الصفحة
              </Button>
              <a href="/" className={buttonVariants({ size: "xl" })}>
                الصفحة الرئيسية
              </a>
            </div>
          </EmptyState>
        </main>
      </body>
    </html>
  )
}
