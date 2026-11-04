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
import {
  CHECKOUT_INPUT,
  CheckoutField,
  CheckoutSection,
  ShippingOption,
} from "@/components/checkout/checkout-fields"
import { CheckoutSkeleton } from "@/components/checkout/checkout-skeleton"
import { OrderSummary } from "@/components/checkout/order-summary"
import { EmptyState } from "@/components/store/empty-state"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { formatPrice } from "@/lib/catalog/money"
import { deliveryTime } from "@/lib/checkout/delivery"
import { buildOrder, saveLastOrder } from "@/lib/checkout/order"
import {
  checkoutSchema,
  type CheckoutInput,
  type CheckoutValues,
} from "@/lib/checkout/schema"
import { calculateTotals } from "@/lib/checkout/totals"
import type {
  CheckoutConfig,
  Coupon,
  ShippingMethod,
} from "@/lib/checkout/types"
import { cartSubtotal, useCartStore } from "@/lib/store/cart"
import { useCartSync } from "@/lib/store/cart-sync"
import { useCartRestored } from "@/lib/store/hydration"
import { cn } from "@/lib/utils"

/**
 * صفحة إتمام الطلب التجريبي: صفحة واحدة بأربع خطوات، وتحقق فوري برسائل عربية،
 * وملخص بالإجمالي. عند التأكيد يُحفظ الطلب في هذا التبويب فقط وتُفرَّغ السلة،
 * ولا يُرسل شيء لأي جهة.
 */
export function CheckoutView({ config }: { config: CheckoutConfig }) {
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

  /** خصائص الحقل: التسجيل في النموذج وربط رسالة الخطأ أو التلميح به. */
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
              <Input
                autoComplete="name"
                className={CHECKOUT_INPUT}
                {...field("fullName")}
              />
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
                className={cn(CHECKOUT_INPUT, "text-end")}
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
                className={cn(CHECKOUT_INPUT, "text-end")}
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
                className="w-full [&_select]:h-11 [&_select]:bg-background [&_select]:text-base"
                {...field("city", {
                  // التوصيل السريع متاح في مدن محددة، فيعود الاختيار للعادي في غيرها
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
              <Input
                autoComplete="address-level3"
                className={CHECKOUT_INPUT}
                {...field("district")}
              />
            </CheckoutField>
            <CheckoutField
              id="street"
              label="الشارع ورقم المبنى"
              error={errors.street?.message}
              className="sm:col-span-2"
            >
              <Input
                autoComplete="street-address"
                className={CHECKOUT_INPUT}
                {...field("street")}
              />
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
                className="bg-background px-3 text-base md:text-base"
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
                    ? config.express.label
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
