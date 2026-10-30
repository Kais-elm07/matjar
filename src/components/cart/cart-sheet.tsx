"use client"

import Link from "next/link"
import { ShoppingCartIcon } from "lucide-react"

import { CartLineItem } from "@/components/cart/cart-line-item"
import { CartNotices } from "@/components/cart/cart-notices"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { formatPrice } from "@/lib/catalog/money"
import { cartSubtotal, useCartCount, useCartStore } from "@/lib/store/cart"
import { useCartSync } from "@/lib/store/cart-sync"
import { useUiStore } from "@/lib/store/ui"

/** نافذة السلة الجانبية: تنزلق من جهة النهاية عند الإضافة للسلة أو الضغط على أيقونتها. */
export function CartSheet() {
  const open = useUiStore((state) => state.cartOpen)
  const setOpen = useUiStore((state) => state.setCartOpen)
  const lines = useCartStore((state) => state.lines)
  const count = useCartCount()
  const { notices, dismiss } = useCartSync(open)
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-[90%] gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b pe-14">
          <SheetTitle className="text-lg font-bold">
            سلة التسوق
            {count > 0 && (
              <span className="ms-1.5 font-normal text-muted-foreground">
                ({count})
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">
            المنتجات التي أضفتها إلى سلتك
          </SheetDescription>
        </SheetHeader>

        <CartNotices
          notices={notices}
          onDismiss={dismiss}
          className="m-4 mb-0"
        />

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <ShoppingCartIcon className="size-6" aria-hidden />
            </span>
            <div className="space-y-1">
              <p className="font-bold">سلتك فارغة</p>
              <p className="text-sm text-muted-foreground">
                أضف ما يعجبك من المنتجات وسيظهر هنا.
              </p>
            </div>
            <Link
              href="/products"
              onClick={close}
              className={buttonVariants({ variant: "cta", size: "xl" })}
            >
              تصفّح المنتجات
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y overflow-y-auto px-4">
              {lines.map((line) => (
                <CartLineItem key={line.sku} line={line} onNavigate={close} />
              ))}
            </ul>
            <SheetFooter className="gap-3 border-t">
              <div className="flex items-center justify-between text-base">
                <span>المجموع</span>
                <span className="font-bold text-primary">
                  {formatPrice(cartSubtotal(lines))}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                تكلفة الشحن تظهر عند إتمام الطلب.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/cart"
                  onClick={close}
                  className={buttonVariants({ variant: "cta", size: "xl" })}
                >
                  عرض السلة
                </Link>
                <Button variant="outline" size="xl" onClick={close}>
                  متابعة التسوق
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
