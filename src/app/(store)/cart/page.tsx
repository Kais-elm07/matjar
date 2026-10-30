import type { Metadata } from "next"

import { CartView } from "@/components/cart/cart-view"
import { Breadcrumbs } from "@/components/store/breadcrumbs"

export const metadata: Metadata = {
  title: "سلة التسوق",
  robots: { index: false, follow: true },
}

/** صفحة السلة: محتواها من متصفح الزائر، فتُبنى فارغة وتُملأ بعد التحميل. */
export default function CartPage() {
  return (
    <div className="page-container py-5 md:py-8">
      <Breadcrumbs items={[{ name: "سلة التسوق" }]} />
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">سلة التسوق</h1>
      <CartView />
    </div>
  )
}
