import { Suspense } from "react"

import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { SearchParamsListener } from "@/lib/catalog/use-listing-search"

/** تخطيط واجهة المتجر: الرأس والتذييل حول كل صفحات العميل. */
export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      {/* يبلغ صفحات القوائم بتغيّر الرابط (الفلاتر والترتيب) */}
      <Suspense fallback={null}>
        <SearchParamsListener />
      </Suspense>
    </>
  )
}
