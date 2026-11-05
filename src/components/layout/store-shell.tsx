import { Suspense } from "react"

import { LazyCartSheet } from "@/components/cart/lazy-cart-sheet"
import { CartWishlistRestorer } from "@/components/global/cart-wishlist-restorer"
import { ListingUrlListener } from "@/components/global/listing-url-listener"
import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { MobileTabBar } from "@/components/layout/mobile-tab-bar"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { WhatsAppButton } from "@/components/layout/whatsapp-button"
import { cn } from "@/lib/utils"

interface StoreShellProps {
  children: React.ReactNode
  mainClassName?: string
}

/**
 * The shell of every store page: the announcement bar, header and footer, the mobile bottom bar,
 * the WhatsApp button and the cart panel, and restoring the cart and wishlist from the browser.
 * Used by the store layout and the 404 page, so the cart and counters work on every page.
 */
export function StoreShell({ children, mainClassName }: StoreShellProps) {
  return (
    <>
      {/* The first thing the Tab key reaches: skips the announcement and header to the content */}
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-primary px-4 py-2.5 text-primary-foreground focus:not-sr-only focus:fixed focus:start-4 focus:top-3 focus:z-50"
      >
        انتقل إلى المحتوى
      </a>
      {/* Outside the sticky header, so it disappears on scroll */}
      <AnnouncementBar />
      <SiteHeader />
      <main id="main-content" className={cn("flex-1", mainClassName)}>
        {children}
      </main>
      {/* Room for the fixed mobile bottom bar, so it doesn't cover the footer. The footer is
          rendered only when it comes near the screen (render-later in globals.css) */}
      <div className="pb-[calc(4rem+env(safe-area-inset-bottom))] render-later md:pb-0">
        <SiteFooter />
      </div>
      <MobileTabBar />
      <WhatsAppButton />
      <LazyCartSheet />
      <CartWishlistRestorer />
      {/* Tells listing pages when the URL changes (filters and sorting) */}
      <Suspense fallback={null}>
        <ListingUrlListener />
      </Suspense>
    </>
  )
}
