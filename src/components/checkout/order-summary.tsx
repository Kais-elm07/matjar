"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDownIcon, TagIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PIECE_FORMS, pluralize } from "@/lib/arabic-plural"
import { formatPrice } from "@/lib/catalog/money"
import { couponProblem, findCoupon } from "@/lib/checkout/totals"
import type { CheckoutConfig, Coupon, OrderTotals } from "@/lib/checkout/types"
import type { CartLine } from "@/lib/store/cart"
import { cn } from "@/lib/utils"

/**
 * ملخص الطلب: المنتجات، والكوبون، والمبالغ.
 * على الجوال يُطوى في سطر واحد بالإجمالي وزر لفتحه، وعلى الحاسوب يظهر كاملاً بجانب النموذج.
 */
export function OrderSummary({
  lines,
  totals,
  coupon,
  onCouponChange,
  config,
  className,
}: {
  lines: CartLine[]
  totals: OrderTotals
  coupon: Coupon | null
  onCouponChange: (coupon: Coupon | null) => void
  config: CheckoutConfig
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const count = lines.reduce((sum, line) => sum + line.quantity, 0)

  return (
    <aside
      aria-labelledby="order-summary-heading"
      className={cn("rounded-xl border bg-card", className)}
    >
      {/* زر الطي على الجوال يغطي السطر كله لتسهيل اللمس، ويختفي على الحاسوب */}
      <div className="relative flex items-center justify-between gap-3 p-4">
        <h2 id="order-summary-heading" className="text-lg font-bold">
          ملخص الطلب
          <span className="ms-1.5 text-sm font-normal text-muted-foreground">
            ({pluralize(count, PIECE_FORMS)})
          </span>
        </h2>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="order-summary-content"
          className="flex items-center gap-1.5 rounded-sm font-bold text-primary outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50 lg:hidden"
        >
          <span className="sr-only">
            {open ? "إخفاء ملخص الطلب، " : "عرض ملخص الطلب، "}الإجمالي
          </span>
          {formatPrice(totals.total)}
          <ChevronDownIcon
            className={cn("size-4 transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </button>
      </div>

      <div
        id="order-summary-content"
        className={cn("space-y-4 px-4 pb-4 lg:block", !open && "hidden")}
      >
        <ul className="divide-y rounded-lg border bg-background px-3">
          {lines.map((line) => (
            <li key={line.sku} className="flex items-center gap-3 py-3">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-md border">
                {line.image && (
                  <Image
                    src={line.image.src}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                )}
                <span className="absolute -end-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground tabular-nums">
                  {line.quantity}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="line-clamp-1 text-sm font-medium">
                  {line.name}
                </span>
                {Object.keys(line.options).length > 0 && (
                  <span className="block text-xs text-muted-foreground">
                    {Object.entries(line.options)
                      .map(([name, value]) => `${name}: ${value}`)
                      .join("، ")}
                  </span>
                )}
              </span>
              <span className="text-sm font-bold">
                {formatPrice(line.price * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <Link
          href="/cart"
          className="inline-block rounded-sm text-sm font-medium text-primary underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          تعديل السلة
        </Link>

        <CouponField
          coupon={coupon}
          subtotal={totals.subtotal}
          onChange={onCouponChange}
          config={config}
        />

        <dl className="space-y-2 border-t pt-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt>المجموع</dt>
            <dd>{formatPrice(totals.subtotal)}</dd>
          </div>
          {totals.discount > 0 && (
            <div className="flex justify-between gap-4 text-success">
              <dt>الخصم ({coupon?.code})</dt>
              <dd>−{formatPrice(totals.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <dt>الشحن</dt>
            <dd
              className={cn(
                totals.shipping === null && "text-muted-foreground"
              )}
            >
              {totals.shipping === null
                ? "اختر المدينة"
                : totals.shipping === 0
                  ? "مجاناً"
                  : formatPrice(totals.shipping)}
            </dd>
          </div>
        </dl>
        {totals.freeShippingRemaining !== null &&
          totals.freeShippingRemaining > 0 && (
            <p className="rounded-md bg-background px-3 py-2 text-xs">
              أضف منتجات بقيمة{" "}
              <span className="font-bold">
                {formatPrice(totals.freeShippingRemaining)}
              </span>{" "}
              لتحصل على شحن مجاني.
            </p>
          )}
        <dl className="border-t pt-3">
          <div className="flex justify-between gap-4 text-base font-bold">
            <dt>الإجمالي</dt>
            <dd className="text-primary">{formatPrice(totals.total)}</dd>
          </div>
        </dl>
      </div>
    </aside>
  )
}

/**
 * حقل الكوبون: يتحقق من الرمز وحد الطلب، ويعرض الخصم المطبّق مع زر لإزالته.
 * إن نزل المجموع بعد التطبيق تحت حد الكوبون يبقى ظاهراً مع تنبيه بأنه لم يعد ينطبق.
 */
function CouponField({
  coupon,
  subtotal,
  onChange,
  config,
}: {
  coupon: Coupon | null
  subtotal: number
  onChange: (coupon: Coupon | null) => void
  config: CheckoutConfig
}) {
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
