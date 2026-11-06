"use client"

import Image from "next/image"
import Link from "next/link"
import { CircleCheckIcon, InfoIcon, PackageSearchIcon } from "lucide-react"

import { OrderDetailRow } from "@/components/checkout/order-detail-row"
import { EmptyState } from "@/components/shared/empty-state"
import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { PIECE_FORMS, pluralize } from "@/lib/arabic-plural"
import { formatOptions } from "@/lib/catalog/options"
import { useLastOrder } from "@/lib/checkout/last-order"
import { formatPrice, formatShipping } from "@/lib/money"

/** Confirmation page for the demo order: the order number, delivery, amounts and products. */
export function OrderConfirmation() {
  const order = useLastOrder()

  if (order === "pending") {
    return (
      <div className="mx-auto max-w-3xl space-y-6" aria-hidden>
        <Skeleton className="mx-auto size-16 rounded-full" />
        <Skeleton className="mx-auto h-8 w-64" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    )
  }

  if (!order) {
    return (
      <EmptyState
        icon={PackageSearchIcon}
        title="لا يوجد طلب حديث"
        description="تظهر هنا تفاصيل طلبك بعد تأكيده مباشرة، وتختفي عند إغلاق التبويب."
        className="mx-auto max-w-3xl"
      >
        <Link
          href="/products"
          className={buttonVariants({ variant: "cta", size: "xl" })}
        >
          تصفّح المنتجات
        </Link>
      </EmptyState>
    )
  }

  const firstName = order.customer.name.split(/\s+/)[0]
  const count = order.lines.reduce((sum, line) => sum + line.quantity, 0)
  const { totals } = order

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
          <CircleCheckIcon className="size-9" aria-hidden />
        </span>
        <h2 className="mt-4 text-2xl font-bold md:text-3xl">
          شكراً لك يا {firstName}!
        </h2>
        <p className="mt-2 text-muted-foreground">تم تأكيد طلبك التجريبي.</p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
          رقم الطلب:
          <span className="font-bold" dir="ltr">
            {order.number}
          </span>
        </p>
      </div>

      <p className="flex gap-2 rounded-2xl border border-warning/30 bg-warning/5 p-4 text-sm leading-6">
        <InfoIcon className="mt-1 size-4 shrink-0 text-warning" aria-hidden />
        هذا طلب تجريبي للعرض فقط: لم يُرسل لأي جهة، ولن يُشحن، ولن يُطلب منك دفع
        أي مبلغ.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <section
          aria-labelledby="delivery-heading"
          className="rounded-2xl border p-5"
        >
          <h3 id="delivery-heading" className="mb-3 font-bold">
            التوصيل
          </h3>
          <dl className="space-y-2 text-sm">
            <OrderDetailRow label="الاسم" value={order.customer.name} />
            <OrderDetailRow label="الجوال" value={order.customer.phone} ltr />
            <OrderDetailRow label="المدينة" value={order.customer.city} />
            <OrderDetailRow label="العنوان" value={order.customer.address} />
            <OrderDetailRow
              label="طريقة الشحن"
              value={`${order.shipping.label}، ${order.shipping.days}`}
            />
          </dl>
        </section>

        <section
          aria-labelledby="payment-heading"
          className="rounded-2xl border p-5"
        >
          <h3 id="payment-heading" className="mb-3 font-bold">
            الدفع عند الاستلام
          </h3>
          <dl className="space-y-2 text-sm">
            <OrderDetailRow
              label="المجموع"
              value={formatPrice(totals.subtotal)}
            />
            {totals.discount > 0 && (
              <OrderDetailRow
                label={`الخصم (${order.couponCode})`}
                value={`−${formatPrice(totals.discount)}`}
                className="text-success"
              />
            )}
            <OrderDetailRow
              label="الشحن"
              value={formatShipping(totals.shipping ?? 0)}
            />
            <OrderDetailRow
              label="الإجمالي عند الاستلام"
              value={formatPrice(totals.total)}
              className="border-t pt-2 text-base font-bold text-primary"
            />
          </dl>
        </section>
      </div>

      <section
        aria-labelledby="items-heading"
        className="rounded-2xl border p-5"
      >
        <h3 id="items-heading" className="mb-2 font-bold">
          المنتجات ({pluralize(count, PIECE_FORMS)})
        </h3>
        <ul className="divide-y">
          {order.lines.map((line) => (
            <li key={line.sku} className="flex items-center gap-3 py-3">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-xl border bg-muted">
                {line.image && (
                  <Image
                    src={line.image.src}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                  />
                )}
              </span>
              <span className="min-w-0 flex-1 text-sm">
                <span className="line-clamp-1 font-medium">{line.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {[formatOptions(line.options), `الكمية: ${line.quantity}`]
                    .filter(Boolean)
                    .join("، ")}
                </span>
              </span>
              <span className="text-sm font-bold">
                {formatPrice(line.price * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/products"
          className={buttonVariants({ variant: "cta", size: "xl" })}
        >
          متابعة التسوق
        </Link>
        <Link href="/" className={buttonVariants({ size: "xl" })}>
          الصفحة الرئيسية
        </Link>
      </div>
    </div>
  )
}
