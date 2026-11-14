"use client"

import { useFormState, type FieldPath } from "react-hook-form"

import {
  errorId,
  hintId,
} from "@/modules/checkout/components/use-checkout-field"
import { Label } from "@/components/ui/label"
import type { CheckoutInput } from "@/modules/checkout/schema"
import { cn } from "@/lib/utils"

interface CheckoutFieldProps {
  /** The form field's name, which is also the input's id (useCheckoutField) */
  name: FieldPath<CheckoutInput>
  label: string
  optional?: boolean
  hint?: string
  className?: string
  children: React.ReactNode
}

/** A field with its label above it and its error message or hint below it. */
export function CheckoutField({
  name,
  label,
  optional = false,
  hint,
  className,
  children,
}: CheckoutFieldProps) {
  const { errors } = useFormState<CheckoutInput>({ name })
  const error = errors[name]?.message

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={name}>
        {label}
        {optional && (
          <span className="font-normal text-muted-foreground">(اختياري)</span>
        )}
      </Label>
      {children}
      {error ? (
        <p id={errorId(name)} className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId(name)} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
