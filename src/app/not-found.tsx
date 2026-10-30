import type { Metadata } from "next"
import Link from "next/link"

import { SearchBox } from "@/components/layout/search-box"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
}

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex flex-1 items-center">
        <div className="page-container flex flex-col items-center py-16 text-center md:py-24">
          <p
            aria-hidden
            className="text-7xl font-bold text-primary/20 md:text-8xl"
          >
            404
          </p>
          <h1 className="mt-2 text-2xl font-bold md:text-3xl">
            عذراً، لم نجد هذه الصفحة
          </h1>
          <p className="mt-3 max-w-md leading-7 text-muted-foreground">
            ربما تغيّر الرابط أو لم تعد الصفحة متوفرة. ابحث عن المنتج الذي
            تريده، أو عُد إلى الصفحة الرئيسية.
          </p>
          <SearchBox className="mt-8 max-w-md text-start" />
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/" className={buttonVariants({ size: "xl" })}>
              العودة إلى الرئيسية
            </Link>
            <Link
              href="/products"
              className={buttonVariants({ variant: "outline", size: "xl" })}
            >
              تصفّح المنتجات
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
