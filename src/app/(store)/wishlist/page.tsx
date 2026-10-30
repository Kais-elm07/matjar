import type { Metadata } from "next"

import { WishlistView } from "@/components/cart/wishlist-view"
import { Breadcrumbs } from "@/components/store/breadcrumbs"

export const metadata: Metadata = {
  title: "المفضلة",
  robots: { index: false, follow: true },
}

/** صفحة المفضلة: المنتجات المحفوظة في متصفح الزائر. */
export default function WishlistPage() {
  return (
    <div className="page-container py-5 md:py-8">
      <Breadcrumbs items={[{ name: "المفضلة" }]} />
      <h1 className="mb-2 text-2xl font-bold md:text-3xl">المفضلة</h1>
      <WishlistView />
    </div>
  )
}
