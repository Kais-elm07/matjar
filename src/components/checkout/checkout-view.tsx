"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { InfoIcon, ShoppingCartIcon } from "lucide-react"
import { FormProvider, useWatch } from "react-hook-form"

import { CartNotices } from "@/modules/cart/components/cart-notices"
import { AddressStep } from "@/components/checkout/address-step"
import { CheckoutSkeleton } from "@/components/checkout/checkout-skeleton"
import { ContactStep } from "@/components/checkout/contact-step"
import { OrderSummary } from "@/components/checkout/order-summary"
import { PaymentStep } from "@/components/checkout/payment-step"
import { ShippingStep } from "@/components/checkout/shipping-step"
import { useCheckoutForm } from "@/components/checkout/use-checkout-form"
import { useOrderRequestId } from "@/components/checkout/use-order-request-id"
import { EmptyState } from "@/components/shared/empty-state"
import { Button, buttonVariants } from "@/components/ui/button"
import { placeOrder, type PlaceOrderResult } from "@/lib/checkout/actions"
import type { CheckoutValues } from "@/lib/checkout/form-schema"
import { calculateTotals, cartSubtotal } from "@/lib/checkout/totals"
import type {
  Coupon,
  ShippingConfig,
  ShippingMethod,
} from "@/lib/checkout/types"
import { formatPrice } from "@/lib/money"
import { orderPath } from "@/lib/routes"
import { cartNoticeText, useCartStore } from "@/modules/cart/store"
import { useCartSync } from "@/modules/cart/sync"
import { useCartRestored } from "@/lib/state/hydration"

interface CheckoutViewProps {
  config: ShippingConfig
}

/**
 * The checkout page: a single page with four steps, instant validation with Arabic messages,
 * and a summary with the total. On confirmation the server checks and saves the order (placeOrder),
 * the cart is emptied, and the visitor goes to the order's page. When the server refuses the order
 * because a product sold out or its price changed, the cart is updated on the spot and the message
 * names the product.
 * Each step is a component of its own (ContactStep, AddressStep, ShippingStep and PaymentStep) that
 * reads the form through FormProvider.
 */
export function CheckoutView({ config }: CheckoutViewProps) {
  const router = useRouter()
  const restored = useCartRestored()
  const lines = useCartStore((state) => state.lines)
  const clearCart = useCartStore((state) => state.clear)
  const syncCart = useCartStore((state) => state.sync)
  const { notices, dismiss } = useCartSync()
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [orderError, setOrderError] = useState<string | null>(null)
  // Set once the order is saved, until the order's page opens: the cart is already empty by then
  const [placed, setPlaced] = useState(false)
  const requestIdFor = useOrderRequestId()

  const form = useCheckoutForm(config.cities)

  const cityName = useWatch({ control: form.control, name: "city" })
  const method: ShippingMethod =
    useWatch({ control: form.control, name: "shippingMethod" }) ?? "standard"
  const city = config.cities.find((item) => item.name === cityName)
  const subtotal = cartSubtotal(lines)
  const totalsFor = (shippingMethod: ShippingMethod) =>
    calculateTotals({ subtotal, city, method: shippingMethod, coupon, config })
  const totals = totalsFor(method)

  if (placed) {
    return (
      <p role="status" className="py-20 text-center font-bold">
        تم حفظ طلبك، جارٍ عرضه...
      </p>
    )
  }

  if (!restored) return <CheckoutSkeleton />

  const refusal = orderError && (
    <p
      role="alert"
      className="rounded-2xl border border-destructive/40 p-3 text-sm font-medium text-destructive"
    >
      {orderError}
    </p>
  )

  if (lines.length === 0) {
    return (
      <div className="space-y-4">
        <CartNotices notices={notices} onDismiss={dismiss} />
        {/* The last product sold out while the visitor was confirming the order */}
        {refusal}
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
      </div>
    )
  }

  async function confirmOrder(values: CheckoutValues) {
    setOrderError(null)
    const requested = lines.map(({ sku, quantity }) => ({ sku, quantity }))
    let result: PlaceOrderResult
    try {
      result = await placeOrder({
        requestId: requestIdFor(requested),
        values,
        lines: requested,
        couponCode: coupon?.code ?? null,
        expectedTotal: totals.total,
      })
    } catch {
      result = {
        ok: false,
        message: "تعذّر الاتصال بالمتجر. تأكد من اتصالك ثم حاول مرة أخرى.",
      }
    }
    if (!result.ok) {
      // The cart was behind the store: it takes the prices and stock the server just read, and the
      // message names what changed, so the visitor sees it without loading the page again
      const changes = result.cart ? syncCart(result.cart) : []
      setOrderError(
        changes.length > 0
          ? changes.map(cartNoticeText).join(" ")
          : result.message
      )
      return
    }
    setPlaced(true)
    clearCart()
    router.push(orderPath(result.id))
  }

  const { isSubmitting } = form.formState

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
      <OrderSummary
        lines={lines}
        totals={totals}
        coupon={coupon}
        onCouponChange={setCoupon}
        className="lg:sticky lg:top-32 lg:order-last"
      />

      <FormProvider {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(confirmOrder)}
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
              هذا متجر تجريبي للعرض: يُحفظ طلبك لدى المتجر لتراه في صفحة
              التأكيد، لكنه لن يُشحن ولن يُطلب منك أي دفع.
            </p>
            {refusal}
            <Button
              type="submit"
              variant="cta"
              size="xl"
              className="w-full text-base"
              // Disabled while the server saves the order, so a second tap or Enter cannot place it twice
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "جارٍ تأكيد طلبك..."
                : `تأكيد الطلب · ${formatPrice(totals.total)}`}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
