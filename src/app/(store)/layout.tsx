import { Suspense } from "react"

import { LazyCartSheet } from "@/components/cart/lazy-cart-sheet"
import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { MobileTabBar } from "@/components/layout/mobile-tab-bar"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { WhatsAppButton } from "@/components/layout/whatsapp-button"
import { StoreRestorer } from "@/components/store/store-restorer"
import { SearchParamsListener } from "@/lib/catalog/use-listing-search"

/**
 * تخطيط واجهة المتجر: شريط الإعلان والرأس والتذييل، وشريط الجوال السفلي،
 * وزر واتساب ونافذة السلة حول كل الصفحات.
 */
export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* أول ما يصله زر Tab: يتخطى الإعلان والرأس إلى المحتوى */}
      <a
        href="#main-content"
        className="sr-only rounded-full bg-highlight px-4 py-2 text-highlight-foreground focus:not-sr-only focus:fixed focus:start-4 focus:top-3 focus:z-50"
      >
        انتقل إلى المحتوى
      </a>
      {/* خارج الرأس الثابت، فيختفي عند التمرير */}
      <AnnouncementBar />
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      {/* مساحة لشريط الجوال السفلي الثابت حتى لا يغطي التذييل */}
      <div className="pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        <SiteFooter />
      </div>
      <MobileTabBar />
      <WhatsAppButton />
      <LazyCartSheet />
      <StoreRestorer />
      {/* يبلغ صفحات القوائم بتغيّر الرابط (الفلاتر والترتيب) */}
      <Suspense fallback={null}>
        <SearchParamsListener />
      </Suspense>
    </>
  )
}
