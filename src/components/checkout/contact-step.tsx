"use client"

import { CheckoutField } from "@/components/checkout/checkout-field"
import { CheckoutSection } from "@/components/checkout/checkout-section"
import { useCheckoutField } from "@/components/checkout/use-checkout-field"
import { Input } from "@/components/ui/input"

/** Step 1 of the checkout: the name, the mobile number and an optional email. */
export function ContactStep() {
  const fullName = useCheckoutField("fullName")
  const phone = useCheckoutField("phone", { hint: true })
  const email = useCheckoutField("email")

  return (
    <CheckoutSection step={1} title="بيانات التواصل">
      <div className="grid gap-4 sm:grid-cols-2">
        <CheckoutField
          name="fullName"
          label="الاسم الكامل"
          className="sm:col-span-2"
        >
          <Input autoComplete="name" {...fullName} />
        </CheckoutField>
        <CheckoutField
          name="phone"
          label="رقم الجوال"
          hint="نتصل بك عليه لتأكيد موعد التوصيل"
        >
          <Input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            placeholder="05xxxxxxxx"
            className="text-end"
            {...phone}
          />
        </CheckoutField>
        <CheckoutField name="email" label="البريد الإلكتروني" optional>
          <Input
            type="email"
            inputMode="email"
            autoComplete="email"
            dir="ltr"
            className="text-end"
            {...email}
          />
        </CheckoutField>
      </div>
    </CheckoutSection>
  )
}
