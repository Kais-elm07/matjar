import type { Metadata } from "next"

import { CartView } from "@/modules/cart/components/cart-view"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"

export const metadata: Metadata = {
  title: "سلة التسوق",
  robots: { index: false, follow: true },
}

/**
 * The cart page: its content comes from the visitor's browser, so it is built empty and filled after loading.
 * The minimum height keeps the footer in place when the content replaces the loading skeleton.
 */
export default function CartPage() {
  return (
    <div className="page-container min-h-[70svh] py-5 md:py-8">
      <Breadcrumbs items={[{ name: "سلة التسوق" }]} />
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">سلة التسوق</h1>
      <CartView />
    </div>
  )
}
