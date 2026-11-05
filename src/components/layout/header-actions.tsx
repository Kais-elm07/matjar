"use client"

import Link from "next/link"
import { HeartIcon, ShoppingBagIcon } from "lucide-react"

import { CountBadge } from "@/components/layout/count-badge"
import { HEADER_ICON_BUTTON } from "@/components/layout/header-styles"
import { useCartCount } from "@/lib/state/cart"
import { useUiStore } from "@/lib/state/ui"
import { useWishlistCount } from "@/lib/state/wishlist"
import { cn } from "@/lib/utils"

interface HeaderActionsProps {
  className?: string
}

/** The wishlist and cart icons in the header, with an orange counter that is hidden at zero. */
export function HeaderActions({ className }: HeaderActionsProps) {
  const cartCount = useCartCount()
  const wishlistCount = useWishlistCount()
  const setCartOpen = useUiStore((state) => state.setCartOpen)

  return (
    <div className={cn("flex items-center", className)}>
      <Link
        href="/wishlist"
        aria-label={
          wishlistCount > 0 ? `المفضلة (${wishlistCount})` : "المفضلة"
        }
        className={cn(HEADER_ICON_BUTTON, "hidden sm:inline-flex")}
      >
        <HeartIcon aria-hidden />
        <CountBadge count={wishlistCount} />
      </Link>
      <button
        type="button"
        onClick={() => setCartOpen(true)}
        aria-label={cartCount > 0 ? `السلة (${cartCount})` : "السلة"}
        className={HEADER_ICON_BUTTON}
      >
        <ShoppingBagIcon aria-hidden />
        <CountBadge count={cartCount} />
      </button>
    </div>
  )
}
