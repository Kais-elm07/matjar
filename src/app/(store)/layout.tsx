import { Suspense } from "react"

import { CartSheet } from "@/components/cart/cart-sheet"
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
      <CartSheet />
      <StoreRestorer />
      {/* يبلغ صفحات القوائم بتغيّر الرابط (الفلاتر والترتيب) */}
      <Suspense fallback={null}>
        <SearchParamsListener />
      </Suspense>
    </>
  )
}
