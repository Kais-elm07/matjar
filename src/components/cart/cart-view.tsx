"use client"

import Link from "next/link"
import { ShoppingCartIcon } from "lucide-react"

import { CartLineItem } from "@/components/cart/cart-line-item"
import { CartNotices } from "@/components/cart/cart-notices"
import { EmptyState } from "@/components/store/empty-state"
import { Button, buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { pluralize, type PluralForms } from "@/lib/arabic-plural"
import { formatPrice } from "@/lib/catalog/money"
import { cartSubtotal, useCartCount, useCartStore } from "@/lib/store/cart"
import { useCartSync } from "@/lib/store/cart-sync"
import { useCartRestored } from "@/lib/store/hydration"
import { cn } from "@/lib/utils"

const PIECE_FORMS: PluralForms = {
  zero: "لا قطع",
  one: "قطعة واحدة",
  two: "قطعتان",
  few: "{n} قطع",
  many: "{n} قطعة",
  other: "{n} قطعة",
}

/** صفحة السلة: المنتجات مع الكمية والحذف، وملخص المبالغ، وحالة فارغة. */
export function CartView() {
  const restored = useCartRestored()
  const lines = useCartStore((state) => state.lines)
  const count = useCartCount()
  const { notices, dismiss } = useCartSync()

  if (!restored) return <CartSkeleton />

  if (lines.length === 0) {
    return (
      <>
        <CartNotices notices={notices} onDismiss={dismiss} className="mb-4" />
        <EmptyState
          icon={ShoppingCartIcon}
          title="سلتك فارغة"
          description="أضف ما يعجبك من المنتجات، وستبقى محفوظة هنا حتى لو أغلقت المتصفح."
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

  const subtotal = cartSubtotal(lines)

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <section
        aria-labelledby="cart-items-heading"
        className="rounded-lg border"
      >
        <h2 id="cart-items-heading" className="sr-only">
          المنتجات في السلة
        </h2>
        <CartNotices
          notices={notices}
          onDismiss={dismiss}
          className="m-4 mb-0"
        />
        <ul className="divide-y px-4">
          {lines.map((line) => (
            <CartLineItem key={line.sku} line={line} />
          ))}
        </ul>
      </section>

      <aside
        aria-labelledby="cart-summary-heading"
        className="space-y-4 rounded-lg border bg-muted p-5 lg:sticky lg:top-36"
      >
        <h2 id="cart-summary-heading" className="text-lg font-bold">
          ملخص الطلب
        </h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt>المجموع ({pluralize(count, PIECE_FORMS)})</dt>
            <dd className="font-bold">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>الشحن</dt>
            <dd className="text-muted-foreground">يُحسب عند إتمام الطلب</dd>
          </div>
        </dl>
        <div className="flex justify-between gap-4 border-t pt-3 text-base font-bold">
          <span>الإجمالي قبل الشحن</span>
          <span className="text-primary">{formatPrice(subtotal)}</span>
        </div>
        <Button variant="cta" size="xl" className="w-full" disabled>
          إتمام الطلب
        </Button>
        <p className="text-xs leading-5 text-muted-foreground">
          صفحة إتمام الطلب قيد التجهيز وتُفعَّل في المرحلة القادمة. سلتك محفوظة
          في هذا المتصفح حتى ذلك الحين.
        </p>
        <Link
          href="/products"
          className={cn(
            buttonVariants({ variant: "outline", size: "xl" }),
            "w-full"
          )}
        >
          متابعة التسوق
        </Link>
      </aside>
    </div>
  )
}

function CartSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"
      aria-hidden
    >
      <div className="space-y-4 rounded-lg border p-4">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="flex gap-3">
            <Skeleton className="size-20 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-9 w-28 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-64 rounded-lg" />
    </div>
  )
}
