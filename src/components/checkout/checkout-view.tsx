"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  BanknoteIcon,
  InfoIcon,
  LoaderIcon,
  ShoppingCartIcon,
  TruckIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react"
import { useForm, useWatch, type FieldPath } from "react-hook-form"

import { CartNotices } from "@/components/cart/cart-notices"
import { OrderSummary } from "@/components/checkout/order-summary"
import { EmptyState } from "@/components/store/empty-state"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { formatPrice } from "@/lib/catalog/money"
import { deliveryTime } from "@/lib/checkout/delivery"
import { createOrderNumber, saveLastOrder } from "@/lib/checkout/order"
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

/** الحقول 44 بكسل و16 بكسل للنص، حتى لا يكبّر الجوال الصفحة عند الكتابة. */
const INPUT = "h-11 bg-background px-3 text-base md:text-base"

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
      <div role="status" className="py-20 text-center">
        <LoaderIcon
          className="mx-auto size-8 animate-spin text-primary"
          aria-hidden
        />
        <p className="mt-3 font-bold">جارٍ تأكيد طلبك...</p>
      </div>
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
    const chosenCity = config.cities.find((item) => item.name === values.city)
    if (!chosenCity) return
    setPlacing(true)
    saveLastOrder({
      number: createOrderNumber(),
      placedAt: new Date().toISOString(),
      customer: {
        name: values.fullName,
        phone: values.phone,
        city: values.city,
        address: `${values.district}، ${values.street}`,
      },
      shipping:
        values.shippingMethod === "express"
          ? { label: "توصيل سريع", days: config.express.label }
          : { label: "توصيل عادي", days: deliveryTime(chosenCity.days) },
      couponCode: coupon?.code ?? null,
      lines: lines.map(({ sku, name, options, quantity, price, image }) => ({
        sku,
        name,
        options,
        quantity,
        price,
        image,
      })),
      totals: calculateTotals({
        subtotal,
        city: chosenCity,
        method: values.shippingMethod,
        coupon,
        config,
      }),
    })
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
        className="lg:sticky lg:top-36 lg:order-last"
      />

      <form
        noValidate
        onSubmit={handleSubmit(placeOrder)}
        className="space-y-6"
      >
        <CartNotices notices={notices} onDismiss={dismiss} />

        <Section step={1} title="بيانات التواصل">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="fullName"
              label="الاسم الكامل"
              error={errors.fullName?.message}
              className="sm:col-span-2"
            >
              <Input
                autoComplete="name"
                className={INPUT}
                {...field("fullName")}
              />
            </Field>
            <Field
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
                className={cn(INPUT, "text-end")}
                {...field("phone", { hint: true })}
              />
            </Field>
            <Field
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
                className={cn(INPUT, "text-end")}
                {...field("email")}
              />
            </Field>
          </div>
        </Section>

        <Section step={2} title="عنوان التوصيل">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="city" label="المدينة" error={errors.city?.message}>
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
            </Field>
            <Field id="district" label="الحي" error={errors.district?.message}>
              <Input
                autoComplete="address-level3"
                className={INPUT}
                {...field("district")}
              />
            </Field>
            <Field
              id="street"
              label="الشارع ورقم المبنى"
              error={errors.street?.message}
              className="sm:col-span-2"
            >
              <Input
                autoComplete="street-address"
                className={INPUT}
                {...field("street")}
              />
            </Field>
            <Field
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
            </Field>
          </div>
        </Section>

        <Section step={3} title="طريقة الشحن">
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
        </Section>

        <Section step={4} title="طريقة الدفع">
          <div className="flex items-center gap-3 rounded-lg border border-primary bg-primary/5 p-4">
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
        </Section>

        <div className="space-y-3">
          <p className="flex gap-2 rounded-lg bg-muted p-3 text-sm leading-6">
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

function Section({
  step,
  title,
  children,
}: {
  step: number
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      aria-labelledby={`checkout-step-${step}`}
      className="rounded-lg border p-4 md:p-6"
    >
      <h2
        id={`checkout-step-${step}`}
        className="mb-4 flex items-center gap-3 text-lg font-bold"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}

/** حقل بتسمية فوقه، ورسالة الخطأ أو التلميح تحته. */
function Field({
  id,
  label,
  optional = false,
  hint,
  error,
  className,
  children,
}: {
  id: string
  label: string
  optional?: boolean
  hint?: string
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {optional && (
          <span className="font-normal text-muted-foreground">(اختياري)</span>
        )}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

/** خيار شحن كبطاقة قابلة للنقر، والمختار بحد كحلي. */
function ShippingOption({
  icon: Icon,
  title,
  description,
  price,
  disabled = false,
  ...input
}: {
  icon: LucideIcon
  title: string
  description: string
  price: number | null
  disabled?: boolean
} & React.ComponentProps<"input">) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors has-checked:border-primary has-checked:bg-primary/5 has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <input
        type="radio"
        disabled={disabled}
        className="size-4 shrink-0 accent-primary"
        {...input}
      />
      <Icon className="size-5 shrink-0 text-primary" aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block font-bold">{title}</span>
        <span className="block text-sm text-muted-foreground">
          {description}
        </span>
      </span>
      <span className="shrink-0 text-sm font-bold text-primary">
        {price === null ? "" : price === 0 ? "مجاناً" : formatPrice(price)}
      </span>
    </label>
  )
}

function CheckoutSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]"
      aria-hidden
    >
      <div className="space-y-6">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-48 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-72 rounded-lg" />
    </div>
  )
}
