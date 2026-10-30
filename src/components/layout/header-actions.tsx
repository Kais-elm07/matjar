"use client"

import Link from "next/link"
import { HeartIcon, ShoppingCartIcon } from "lucide-react"

import { useCartCount } from "@/lib/store/cart"
import { useUiStore } from "@/lib/store/ui"
import { useWishlistCount } from "@/lib/store/wishlist"
import { cn } from "@/lib/utils"

const ICON_BUTTON =
  "relative inline-flex size-11 shrink-0 items-center justify-center rounded-full text-primary-foreground outline-none transition-colors hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-ring [&_svg]:size-6"

/** أيقونتا المفضلة والسلة في الرأس الكحلي، مع عدّاد كهرماني لا يظهر عند الصفر. */
export function HeaderActions({ className }: { className?: string }) {
  const cartCount = useCartCount()
  const wishlistCount = useWishlistCount()
  const setCartOpen = useUiStore((state) => state.setCartOpen)

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Link
        href="/wishlist"
        aria-label={
          wishlistCount > 0 ? `المفضلة (${wishlistCount})` : "المفضلة"
        }
        className={ICON_BUTTON}
      >
        <HeartIcon aria-hidden />
        <CountBadge count={wishlistCount} />
      </Link>
      <button
        type="button"
        onClick={() => setCartOpen(true)}
        aria-label={cartCount > 0 ? `السلة (${cartCount})` : "السلة"}
        className={ICON_BUTTON}
      >
        <ShoppingCartIcon aria-hidden />
        <CountBadge count={cartCount} />
      </button>
    </div>
  )
}

/** عدّاد كهرماني صغير فوق الأيقونة. */
export function CountBadge({
  count,
  className,
}: {
  count: number
  className?: string
}) {
  if (count <= 0) return null
  return (
    <span
      aria-hidden
      className={cn(
        "absolute end-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-highlight px-1 text-[11px] leading-none font-bold text-highlight-foreground tabular-nums",
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  )
}
