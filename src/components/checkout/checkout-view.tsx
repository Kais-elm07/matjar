"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { InfoIcon, ShoppingCartIcon } from "lucide-react"
import { FormProvider, useWatch } from "react-hook-form"

import { CartNotices } from "@/components/cart/cart-notices"
import { AddressStep } from "@/components/checkout/address-step"
import { CheckoutSkeleton } from "@/components/checkout/checkout-skeleton"
import { ContactStep } from "@/components/checkout/contact-step"
import { OrderSummary } from "@/components/checkout/order-summary"
import { PaymentStep } from "@/components/checkout/payment-step"
import { ShippingStep } from "@/components/checkout/shipping-step"
import { useCheckoutForm } from "@/components/checkout/use-checkout-form"
import { EmptyState } from "@/components/shared/empty-state"
import { Button, buttonVariants } from "@/components/ui/button"
import type { CheckoutValues } from "@/lib/checkout/form-schema"
import { saveLastOrder } from "@/lib/checkout/last-order"
import { buildOrder } from "@/lib/checkout/order"
import { calculateTotals } from "@/lib/checkout/totals"
import type {
  CheckoutConfig,
  Coupon,
  ShippingMethod,
} from "@/lib/checkout/types"
import { formatPrice } from "@/lib/money"
import { cartSubtotal, useCartStore } from "@/lib/state/cart"
import { useCartSync } from "@/lib/state/cart-sync"
import { useCartRestored } from "@/lib/state/hydration"

interface CheckoutViewProps {
  config: CheckoutConfig
}

/**
 * The demo checkout page: a single page with four steps, instant validation with Arabic messages,
 * and a summary with the total. On confirmation the order is saved in this tab only, the cart is
 * emptied, and nothing is sent to anyone.
 * Each step is a component of its own (ContactStep, AddressStep, ShippingStep and PaymentStep) that
 * reads the form through FormProvider.
 */
export function CheckoutView({ config }: CheckoutViewProps) {
  const router = useRouter()
  const restored = useCartRestored()
  const lines = useCartStore((state) => state.lines)
  const clearCart = useCartStore((state) => state.clear)
  const { notices, dismiss } = useCartSync()
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [placing, setPlacing] = useState(false)

  const form = useCheckoutForm(config.cities)

  const cityName = useWatch({ control: form.control, name: "city" })
  const method: ShippingMethod =
    useWatch({ control: form.control, name: "shippingMethod" }) ?? "standard"
  const city = config.cities.find((item) => item.name === cityName)
  const subtotal = cartSubtotal(lines)
  const totalsFor = (shippingMethod: ShippingMethod) =>
    calculateTotals({ subtotal, city, method: shippingMethod, coupon, config })
  const totals = totalsFor(method)

  if (placing) {
    return (
      <p role="status" className="py-20 text-center font-bold">
        جارٍ تأكيد طلبك...
      </p>
    )
  }

  if (!restored) return <CheckoutSkeleton />

  if (lines.length === 0) {
    return (
      <>
        <CartNotices notices={notices} onDismiss={dismiss} className="mb-4" />
        <EmptyState
          icon={ShoppingCartIcon}
          title="سلتك فارغة"
          description="أضف منتجات إلى السلة أولاً، ثم عد لإتمام الطلب."
        >
          <Link
            href="/products"
            className={buttonVariants({ variant: "cta", size: "xl" })}
          >
            تصفّح المنتجات
          </Link>
        </EmptyState>
      </>
    )
  }

  function placeOrder(values: CheckoutValues) {
    const order = buildOrder({ values, lines, coupon, config })
    if (!order) return
    setPlacing(true)
    saveLastOrder(order)
    clearCart()
    router.push("/checkout/success")
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
      <OrderSummary
        lines={lines}
        totals={totals}
        coupon={coupon}
        onCouponChange={setCoupon}
        config={config}
        className="lg:sticky lg:top-32 lg:order-last"
      />

      <FormProvider {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(placeOrder)}
          className="space-y-6"
        >
          <CartNotices notices={notices} onDismiss={dismiss} />
          <ContactStep />
          <AddressStep cities={config.cities} />
          <ShippingStep
            city={city}
            config={config}
            shippingPrice={(shippingMethod) =>
              totalsFor(shippingMethod).shipping
            }
          />
          <PaymentStep />

          <div className="space-y-3">
            <p className="flex gap-2 rounded-2xl bg-muted p-3 text-sm leading-6">
              <InfoIcon
                className="mt-1 size-4 shrink-0 text-primary"
                aria-hidden
              />
              هذا متجر تجريبي للعرض: لن يُرسل طلبك لأي جهة، ولن يُطلب منك أي
              دفع، وبياناتك تبقى في متصفحك فقط.
            </p>
            <Button
              type="submit"
              variant="cta"
              size="xl"
              className="w-full text-base"
            >
              تأكيد الطلب · {formatPrice(totals.total)}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
