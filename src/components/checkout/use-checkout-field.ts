"use client"

import { useFormContext, useFormState, type FieldPath } from "react-hook-form"

import type { CheckoutInput } from "@/lib/checkout/form-schema"

type FieldName = FieldPath<CheckoutInput>

/** The ids that link a field to its error message and hint (aria-describedby), used by CheckoutField too. */
export const errorId = (name: FieldName) => `${name}-error`
export const hintId = (name: FieldName) => `${name}-hint`

interface CheckoutFieldOptions {
  /** Whether the field's CheckoutField shows a hint under it */
  hint?: boolean
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

/** Props for a checkout input: registers it with the form and links its error message or hint to it. */
export function useCheckoutField(
  name: FieldName,
  { hint = false, onChange }: CheckoutFieldOptions = {}
) {
  const { register } = useFormContext<CheckoutInput>()
  const { errors } = useFormState<CheckoutInput>({ name })
  const error = errors[name]
  return {
    ...register(name, { onChange }),
    id: name,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errorId(name) : hint ? hintId(name) : undefined,
  }
}
