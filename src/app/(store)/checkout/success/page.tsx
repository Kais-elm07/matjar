import type { Metadata } from "next"

import { OrderConfirmation } from "@/components/checkout/order-confirmation"

export const metadata: Metadata = {
  title: "تم تأكيد طلبك",
  robots: { index: false, follow: false },
}

/** صفحة التأكيد: تعرض الطلب التجريبي المحفوظ في هذا التبويب. */
export default function CheckoutSuccessPage() {
  return (
    <div className="page-container py-8 md:py-12">
      <h1 className="sr-only">تأكيد الطلب</h1>
      <OrderConfirmation />
    </div>
  )
}
