import { BanknoteIcon } from "lucide-react"

import { CheckoutSection } from "@/components/checkout/checkout-section"

/** Step 4 of the checkout: cash on delivery, the demo store's only payment method. */
export function PaymentStep() {
  return (
    <CheckoutSection step={4} title="طريقة الدفع">
      <div className="flex items-center gap-3 rounded-xl border border-primary bg-primary/5 p-4">
        <BanknoteIcon className="size-6 shrink-0 text-primary" aria-hidden />
        <div>
          <p className="font-bold">الدفع عند الاستلام</p>
          <p className="text-sm text-muted-foreground">
            ادفع نقداً عند وصول طلبك، دون أي رسوم إضافية.
          </p>
        </div>
      </div>
    </CheckoutSection>
  )
}
