"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  BanknoteIcon,
  InfoIcon,
  ShoppingCartIcon,
  TruckIcon,
  ZapIcon,
} from "lucide-react"
import { useForm, useWatch, type FieldPath } from "react-hook-form"

import { CartNotices } from "@/components/cart/cart-notices"
import { CheckoutField } from "@/components/checkout/checkout-field"
import { CheckoutSection } from "@/components/checkout/checkout-section"
import { CheckoutSkeleton } from "@/components/checkout/checkout-skeleton"
import { OrderSummary } from "@/components/checkout/order-summary"
import { ShippingOption } from "@/components/checkout/shipping-option"
import { EmptyState } from "@/components/shared/empty-state"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { deliveryTime } from "@/lib/checkout/delivery"
import {
  checkoutSchema,
  type CheckoutInput,
  type CheckoutValues,
} from "@/lib/checkout/form-schema"
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
 */
export function CheckoutView({ config }: CheckoutViewProps) {
  const router = useRouter()
  const restored = useCartRestored()
  const lines = useCartStore((state) => state.lines)
  const clearCart = useCartStore((state) => state.clear)
  const { notices, dismiss } = useCartSync()
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [placing, setPlacing] = useState(false)

  const schema = useMemo(() => checkoutSchema(config.cities), [config.cities])
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CheckoutInput, unknown, CheckoutValues>({
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

  const cityName = useWatch({ control, name: "city" })
  const method: ShippingMethod =
    useWatch({ control, name: "shippingMethod" }) ?? "standard"
  const city = config.cities.find((item) => item.name === cityName)
  const subtotal = cartSubtotal(lines)
  const totalsFor = (shippingMethod: ShippingMethod) =>
    calculateTotals({ subtotal, city, method: shippingMethod, coupon, config })
  const totals = totalsFor(method)
  const expressCities = config.cities
    .filter((item) => item.express)
    .map((item) => item.name)

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

  /** Field props: registers the field with the form and links its error message or hint to it. */
  function field(
    name: FieldPath<CheckoutInput>,
    {
      hint = false,
      onChange,
    }: {
      hint?: boolean
      onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
    } = {}
  ) {
    const error = errors[name]
    return {
      ...register(name, { onChange }),
      id: name,
      "aria-invalid": Boolean(error),
      "aria-describedby": error
        ? `${name}-error`
        : hint
          ? `${name}-hint`
          : undefined,
    }
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

      <form
        noValidate
        onSubmit={handleSubmit(placeOrder)}
        className="space-y-6"
      >
        <CartNotices notices={notices} onDismiss={dismiss} />

        <CheckoutSection step={1} title="بيانات التواصل">
          <div className="grid gap-4 sm:grid-cols-2">
            <CheckoutField
              id="fullName"
              label="الاسم الكامل"
              error={errors.fullName?.message}
              className="sm:col-span-2"
            >
              <Input autoComplete="name" {...field("fullName")} />
            </CheckoutField>
            <CheckoutField
              id="phone"
              label="رقم الجوال"
              hint="نتصل بك عليه لتأكيد موعد التوصيل"
              error={errors.phone?.message}
            >
              <Input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                placeholder="05xxxxxxxx"
                className="text-end"
                {...field("phone", { hint: true })}
              />
            </CheckoutField>
            <CheckoutField
              id="email"
              label="البريد الإلكتروني"
              optional
              error={errors.email?.message}
            >
              <Input
                type="email"
                inputMode="email"
                autoComplete="email"
                dir="ltr"
                className="text-end"
                {...field("email")}
              />
            </CheckoutField>
          </div>
        </CheckoutSection>

        <CheckoutSection step={2} title="عنوان التوصيل">
          <div className="grid gap-4 sm:grid-cols-2">
            <CheckoutField
              id="city"
              label="المدينة"
              error={errors.city?.message}
            >
              <NativeSelect
                autoComplete="address-level2"
                className="w-full"
                {...field("city", {
                  // Express delivery is available in certain cities, so elsewhere the choice goes back to standard
                  onChange: (event) => {
                    const next = config.cities.find(
                      (item) => item.name === event.target.value
                    )
                    if (!next?.express) setValue("shippingMethod", "standard")
                  },
                })}
              >
                <NativeSelectOption value="">اختر المدينة</NativeSelectOption>
                {config.cities.map((item) => (
                  <NativeSelectOption key={item.name} value={item.name}>
                    {item.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </CheckoutField>
            <CheckoutField
              id="district"
              label="الحي"
              error={errors.district?.message}
            >
              <Input autoComplete="address-level3" {...field("district")} />
            </CheckoutField>
            <CheckoutField
              id="street"
              label="الشارع ورقم المبنى"
              error={errors.street?.message}
              className="sm:col-span-2"
            >
              <Input autoComplete="street-address" {...field("street")} />
            </CheckoutField>
            <CheckoutField
              id="notes"
              label="ملاحظات للمندوب"
              optional
              error={errors.notes?.message}
              className="sm:col-span-2"
            >
              <Textarea
                rows={3}
                placeholder="مثال: الدور الثاني، بجانب المسجد"
                {...field("notes")}
              />
            </CheckoutField>
          </div>
        </CheckoutSection>

        <CheckoutSection step={3} title="طريقة الشحن">
          <fieldset
            aria-describedby={
              errors.shippingMethod ? "shippingMethod-error" : undefined
            }
          >
            <legend className="sr-only">طريقة الشحن</legend>
            <div className="grid gap-3">
              <ShippingOption
                icon={TruckIcon}
                title="توصيل عادي"
                description={
                  city
                    ? deliveryTime(city.days)
                    : "اختر المدينة لمعرفة مدة التوصيل"
                }
                price={totalsFor("standard").shipping}
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
                price={city?.express ? totalsFor("express").shipping : null}
                disabled={!city?.express}
                {...register("shippingMethod")}
                value="express"
              />
            </div>
            {errors.shippingMethod && (
              <p
                id="shippingMethod-error"
                className="mt-2 text-xs font-medium text-destructive"
              >
                {errors.shippingMethod.message}
              </p>
            )}
          </fieldset>
        </CheckoutSection>

        <CheckoutSection step={4} title="طريقة الدفع">
          <div className="flex items-center gap-3 rounded-xl border border-primary bg-primary/5 p-4">
            <BanknoteIcon
              className="size-6 shrink-0 text-primary"
              aria-hidden
            />
            <div>
              <p className="font-bold">الدفع عند الاستلام</p>
              <p className="text-sm text-muted-foreground">
                ادفع نقداً عند وصول طلبك، دون أي رسوم إضافية.
              </p>
            </div>
          </div>
        </CheckoutSection>

        <div className="space-y-3">
          <p className="flex gap-2 rounded-xl bg-muted p-3 text-sm leading-6">
            <InfoIcon
              className="mt-1 size-4 shrink-0 text-primary"
              aria-hidden
            />
            هذا متجر تجريبي للعرض: لن يُرسل طلبك لأي جهة، ولن يُطلب منك أي دفع،
            وبياناتك تبقى في متصفحك فقط.
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
    </div>
  )
}
