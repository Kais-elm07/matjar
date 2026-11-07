"use client"

import { TruckIcon, ZapIcon } from "lucide-react"
import { useFormContext, useFormState } from "react-hook-form"

import { CheckoutSection } from "@/components/checkout/checkout-section"
import { ShippingOption } from "@/components/checkout/shipping-option"
import { errorId } from "@/components/checkout/use-checkout-field"
import { deliveryTime } from "@/lib/checkout/delivery"
import type { CheckoutInput } from "@/lib/checkout/form-schema"
import type {
  ShippingCity,
  ShippingConfig,
  ShippingMethod,
} from "@/lib/checkout/types"

interface ShippingStepProps {
  /** The chosen city, or undefined before one is chosen */
  city: ShippingCity | undefined
  config: ShippingConfig
  /** Each method's shipping price for this order, from the same totals as the order summary */
  shippingPrice: (method: ShippingMethod) => number | null
}

/** Step 3 of the checkout: standard or express delivery, with the time and price of each for the chosen city. */
export function ShippingStep({
  city,
  config,
  shippingPrice,
}: ShippingStepProps) {
  const { register } = useFormContext<CheckoutInput>()
  const { errors } = useFormState<CheckoutInput>({ name: "shippingMethod" })
  const expressCities = config.cities
    .filter((item) => item.express)
    .map((item) => item.name)

  return (
    <CheckoutSection step={3} title="طريقة الشحن">
      <fieldset
        aria-describedby={
          errors.shippingMethod ? errorId("shippingMethod") : undefined
        }
      >
        <legend className="sr-only">طريقة الشحن</legend>
        <div className="grid gap-3">
          <ShippingOption
            icon={TruckIcon}
            title="توصيل عادي"
            description={
              city ? deliveryTime(city.days) : "اختر المدينة لمعرفة مدة التوصيل"
            }
            price={shippingPrice("standard")}
            {...register("shippingMethod")}
            value="standard"
          />
          <ShippingOption
            icon={ZapIcon}
            title="توصيل سريع"
            description={
              city?.express
                ? config.express.deliveryTime
                : `متاح في ${expressCities.join(" و")} فقط`
            }
            price={city?.express ? shippingPrice("express") : null}
            disabled={!city?.express}
            {...register("shippingMethod")}
            value="express"
          />
        </div>
        {errors.shippingMethod && (
          <p
            id={errorId("shippingMethod")}
            className="mt-2 text-xs font-medium text-destructive"
          >
            {errors.shippingMethod.message}
          </p>
        )}
      </fieldset>
    </CheckoutSection>
  )
}
