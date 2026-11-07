"use client"

import { useState, useTransition } from "react"
import { TagIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { lookupCoupon } from "@/lib/checkout/actions"
import { couponMinimumMessage, couponProblem } from "@/lib/checkout/totals"
import type { Coupon } from "@/lib/checkout/types"
import { cn } from "@/lib/utils"

interface CouponFieldProps {
  coupon: Coupon | null
  subtotal: number
  onChange: (coupon: Coupon | null) => void
}

/**
 * Coupon field: the server checks the code and the order minimum (lookupCoupon), so the list of codes
 * never reaches the browser. It shows the applied discount with a button to remove it. If the subtotal
 * drops below the coupon's minimum after it is applied, the coupon stays visible with a notice that it no
 * longer applies.
 */
export function CouponField({ coupon, subtotal, onChange }: CouponFieldProps) {
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [checking, startChecking] = useTransition()

  function apply() {
    if (!code.trim() || checking) return
    startChecking(async () => {
      try {
        const result = await lookupCoupon(code, subtotal)
        if (!result.ok) {
          setError(result.message)
          return
        }
        setError(null)
        setCode("")
        onChange(result.coupon)
      } catch {
        setError("تعذّر التحقق من الكوبون. تأكد من اتصالك ثم حاول مرة أخرى.")
      }
    })
  }

  if (coupon) {
    const belowMinimum = couponProblem(coupon, subtotal) === "minimum"
    return (
      <div
        className={cn(
          "rounded-xl border bg-background px-3 py-2 text-sm",
          belowMinimum ? "border-warning/50" : "border-success/40"
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <TagIcon
              className={cn(
                "size-4",
                belowMinimum ? "text-warning" : "text-success"
              )}
              aria-hidden
            />
            <span>
              <span className="font-bold" dir="ltr">
                {coupon.code}
              </span>
              <span className="block text-xs text-muted-foreground">
                {coupon.description}
              </span>
            </span>
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xl"
            aria-label={`إزالة الكوبون ${coupon.code}`}
            onClick={() => onChange(null)}
          >
            <XIcon aria-hidden />
          </Button>
        </div>
        {belowMinimum && (
          <p role="status" className="mt-1 text-xs font-medium text-warning">
            لم يعد الكوبون ينطبق: {couponMinimumMessage(coupon)}.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor="coupon-code" className="text-sm font-medium">
        كوبون الخصم
      </label>
      <div className="flex gap-2">
        <Input
          id="coupon-code"
          value={code}
          onChange={(event) => {
            setCode(event.target.value)
            setError(null)
          }}
          onKeyDown={(event) => {
            // Enter applies the coupon instead of submitting the order form
            if (event.key === "Enter") {
              event.preventDefault()
              apply()
            }
          }}
          dir="ltr"
          autoComplete="off"
          autoCapitalize="characters"
          placeholder="WELCOME10"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "coupon-error" : undefined}
          className="text-end uppercase"
        />
        <Button
          type="button"
          variant="default"
          size="xl"
          onClick={apply}
          aria-disabled={checking}
        >
          {checking ? "جارٍ التحقق..." : "تطبيق"}
        </Button>
      </div>
      {error && (
        <p
          id="coupon-error"
          role="alert"
          className="text-xs font-medium text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  )
}
