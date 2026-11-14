import type { Metadata } from "next"

import { CheckoutView } from "@/modules/checkout/components/checkout-view"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { getShippingConfig } from "@/modules/checkout/config"

export const metadata: Metadata = {
  title: "إتمام الطلب",
  robots: { index: false, follow: false },
}

/** The checkout: the shipping settings are passed to the form; the coupons stay on the server. */
export default function CheckoutPage() {
  return (
    <div className="page-container py-5 md:py-8">
      <Breadcrumbs
        items={[{ name: "سلة التسوق", href: "/cart" }, { name: "إتمام الطلب" }]}
      />
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">إتمام الطلب</h1>
      <CheckoutView config={getShippingConfig()} />
    </div>
  )
}
