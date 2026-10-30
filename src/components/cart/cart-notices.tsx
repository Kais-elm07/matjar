"use client"

import { InfoIcon } from "lucide-react"

import type { CartNotice } from "@/lib/store/cart"
import { cn } from "@/lib/utils"

const MESSAGES: Record<CartNotice["kind"], (name: string) => string> = {
  removed: (name) => `«${name}» لم يعد في المتجر، فحذفناه من السلة.`,
  "sold-out": (name) => `«${name}» نفد من المخزون، فحذفناه من السلة.`,
  reduced: (name) => `قلّت كمية «${name}» لتناسب المخزون المتوفر.`,
  "price-up": (name) => `ارتفع سعر «${name}» منذ أضفته.`,
  "price-down": (name) => `انخفض سعر «${name}» منذ أضفته.`,
}

/** تنبيه بما تغيّر في السلة بعد مطابقتها مع بيانات الموقع الحالية. */
export function CartNotices({
  notices,
  onDismiss,
  className,
}: {
  notices: CartNotice[]
  onDismiss: () => void
  className?: string
}) {
  if (notices.length === 0) return null
  return (
    <div
      role="status"
      className={cn(
        "flex gap-3 rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm",
        className
      )}
    >
      <InfoIcon className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
      <div className="space-y-1">
        <p className="font-bold">تغيّرت بعض المنتجات في سلتك</p>
        <ul className="space-y-0.5 text-muted-foreground">
          {notices.map((notice, index) => (
            <li key={index}>{MESSAGES[notice.kind](notice.name)}</li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-sm text-xs font-medium underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          حسناً
        </button>
      </div>
    </div>
  )
}
