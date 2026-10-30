import { Suspense } from "react"

import { CartSheet } from "@/components/cart/cart-sheet"
import { MobileTabBar } from "@/components/layout/mobile-tab-bar"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { StoreRestorer } from "@/components/store/store-restorer"
import { SearchParamsListener } from "@/lib/catalog/use-listing-search"

/** تخطيط واجهة المتجر: الرأس والتذييل وشريط الجوال السفلي ونافذة السلة حول كل الصفحات. */
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
      {/* مساحة لشريط الجوال السفلي الثابت حتى لا يغطي التذييل */}
      <div className="pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        <SiteFooter />
      </div>
      <MobileTabBar />
      <CartSheet />
      <StoreRestorer />
      {/* يبلغ صفحات القوائم بتغيّر الرابط (الفلاتر والترتيب) */}
      <Suspense fallback={null}>
        <SearchParamsListener />
      </Suspense>
    </>
  )
}
