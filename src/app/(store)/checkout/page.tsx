import type { Metadata } from "next"

import { CheckoutView } from "@/components/checkout/checkout-view"
import { Breadcrumbs } from "@/components/store/breadcrumbs"
import { getCheckoutConfig } from "@/lib/checkout/config"

export const metadata: Metadata = {
  title: "إتمام الطلب",
  robots: { index: false, follow: false },
}

/** إتمام الطلب التجريبي: إعدادات الشحن والكوبونات تُقرأ وقت البناء وتُمرَّر للنموذج. */
export default function CheckoutPage() {
  return (
    <div className="page-container py-5 md:py-8">
      <Breadcrumbs
        items={[{ name: "سلة التسوق", href: "/cart" }, { name: "إتمام الطلب" }]}
      />
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">إتمام الطلب</h1>
      <CheckoutView config={getCheckoutConfig()} />
    </div>
  )
}
