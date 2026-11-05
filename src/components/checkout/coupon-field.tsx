"use client"

import { useState } from "react"
import { TagIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/lib/catalog/money"
import { couponProblem, findCoupon } from "@/lib/checkout/totals"
import type { CheckoutConfig, Coupon } from "@/lib/checkout/types"
import { cn } from "@/lib/utils"

interface CouponFieldProps {
  coupon: Coupon | null
  subtotal: number
  onChange: (coupon: Coupon | null) => void
  config: CheckoutConfig
}

/**
 * حقل الكوبون: يتحقق من الرمز وحد الطلب، ويعرض الخصم المطبّق مع زر لإزالته.
 * إن نزل المجموع بعد التطبيق تحت حد الكوبون يبقى ظاهراً مع تنبيه بأنه لم يعد ينطبق.
 */
export function CouponField({
  coupon,
  subtotal,
  onChange,
  config,
}: CouponFieldProps) {
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const minimumText = (found: Coupon) =>
    `هذا الكوبون للطلبات من ${formatPrice(found.minSubtotal)} فأكثر`

  function apply() {
    if (!code.trim()) return
    const found = findCoupon(config, code)
    if (!found) {
      setError("رمز الكوبون غير صحيح")
      return
    }
    if (couponProblem(found, subtotal)) {
      setError(minimumText(found))
      return
    }
    setError(null)
    setCode("")
    onChange(found)
  }

  if (coupon) {
    const belowMinimum = couponProblem(coupon, subtotal) === "minimum"
    return (
      <div
        className={cn(
          "rounded-lg border bg-background px-3 py-2 text-sm",
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
            لم يعد الكوبون ينطبق: {minimumText(coupon)}.
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
            // Enter يطبّق الكوبون بدل إرسال نموذج الطلب
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
          className="h-11 bg-background px-3 text-end text-base uppercase md:text-base"
        />
        <Button type="button" variant="default" size="xl" onClick={apply}>
          تطبيق
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
