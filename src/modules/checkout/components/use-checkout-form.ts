"use client"

import { useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  checkoutSchema,
  type CheckoutInput,
  type CheckoutValues,
} from "@/modules/checkout/schema"
import type { ShippingCity } from "@/modules/checkout/types"

/**
 * The checkout form: its rules with Arabic messages, its empty values, and errors that show once a
 * field has been visited. The steps read it through FormProvider (useFormContext and useFormState).
 */
export function useCheckoutForm(cities: ShippingCity[]) {
  const schema = useMemo(() => checkoutSchema(cities), [cities])
  return useForm<CheckoutInput, unknown, CheckoutValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      city: "",
      district: "",
      street: "",
      notes: "",
      shippingMethod: "standard",
    },
  })
}
