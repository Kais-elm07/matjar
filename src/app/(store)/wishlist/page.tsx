import type { Metadata } from "next"

import { WishlistView } from "@/components/cart/wishlist-view"
import { Breadcrumbs } from "@/components/store/breadcrumbs"

export const metadata: Metadata = {
  title: "المفضلة",
  robots: { index: false, follow: true },
}

/**
 * The wishlist page: the products saved in the visitor's browser.
 * The minimum height keeps the footer in place when the content replaces the loading skeleton.
 */
export default function WishlistPage() {
  return (
    <div className="page-container min-h-[70svh] py-5 md:py-8">
      <Breadcrumbs items={[{ name: "المفضلة" }]} />
      <h1 className="mb-2 text-2xl font-bold md:text-3xl">المفضلة</h1>
      <WishlistView />
    </div>
  )
}
