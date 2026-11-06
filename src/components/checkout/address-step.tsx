"use client"

import { useFormContext } from "react-hook-form"

import { CheckoutField } from "@/components/checkout/checkout-field"
import { CheckoutSection } from "@/components/checkout/checkout-section"
import { useCheckoutField } from "@/components/checkout/use-checkout-field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import type { CheckoutInput } from "@/lib/checkout/form-schema"
import type { ShippingCity } from "@/lib/checkout/types"

interface AddressStepProps {
  cities: ShippingCity[]
}

/** Step 2 of the checkout: the city from the shipping list, the district, the street and optional notes. */
export function AddressStep({ cities }: AddressStepProps) {
  const { setValue } = useFormContext<CheckoutInput>()
  const city = useCheckoutField("city", {
    // Express delivery is available in certain cities, so elsewhere the choice goes back to standard
    onChange: (event) => {
      const next = cities.find((item) => item.name === event.target.value)
      if (!next?.express) setValue("shippingMethod", "standard")
    },
  })
  const district = useCheckoutField("district")
  const street = useCheckoutField("street")
  const notes = useCheckoutField("notes")

  return (
    <CheckoutSection step={2} title="عنوان التوصيل">
      <div className="grid gap-4 sm:grid-cols-2">
        <CheckoutField name="city" label="المدينة">
          <NativeSelect
            autoComplete="address-level2"
            className="w-full"
            {...city}
          >
            <NativeSelectOption value="">اختر المدينة</NativeSelectOption>
            {cities.map((item) => (
              <NativeSelectOption key={item.name} value={item.name}>
                {item.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </CheckoutField>
        <CheckoutField name="district" label="الحي">
          <Input autoComplete="address-level3" {...district} />
        </CheckoutField>
        <CheckoutField
          name="street"
          label="الشارع ورقم المبنى"
          className="sm:col-span-2"
        >
          <Input autoComplete="street-address" {...street} />
        </CheckoutField>
        <CheckoutField
          name="notes"
          label="ملاحظات للمندوب"
          optional
          className="sm:col-span-2"
        >
          <Textarea
            rows={3}
            placeholder="مثال: الدور الثاني، بجانب المسجد"
            {...notes}
          />
        </CheckoutField>
      </div>
    </CheckoutSection>
  )
}
