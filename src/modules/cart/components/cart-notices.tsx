"use client"

import { InfoIcon } from "lucide-react"

import { cartNoticeText, type CartNotice } from "@/modules/cart/store"
import { cn } from "@/lib/utils"

interface CartNoticesProps {
  notices: CartNotice[]
  onDismiss: () => void
  className?: string
}

/** A notice of what changed in the cart after matching it against the site's current data. */
export function CartNotices({
  notices,
  onDismiss,
  className,
}: CartNoticesProps) {
  if (notices.length === 0) return null
  return (
    <div
      role="status"
      className={cn(
        "flex gap-3 rounded-2xl border border-warning/30 bg-warning/5 p-3 text-sm",
        className
      )}
    >
      <InfoIcon className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
      <div className="space-y-1">
        <p className="font-bold">تغيّرت بعض المنتجات في سلتك</p>
        <ul className="space-y-0.5 text-muted-foreground">
          {notices.map((notice) => (
            <li key={`${notice.sku}-${notice.kind}`}>
              {cartNoticeText(notice)}
            </li>
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
