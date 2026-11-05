"use client"

import Link from "next/link"
import { HeartIcon, ShoppingBagIcon } from "lucide-react"

import { useCartCount } from "@/lib/store/cart"
import { useUiStore } from "@/lib/store/ui"
import { useWishlistCount } from "@/lib/store/wishlist"
import { cn } from "@/lib/utils"

import { CountBadge } from "./count-badge"
import { HEADER_ICON_BUTTON as ICON_BUTTON } from "./header-styles"

interface HeaderActionsProps {
  className?: string
}

/** أيقونتا المفضلة والسلة في الرأس، مع عدّاد برتقالي لا يظهر عند الصفر. */
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
        className={cn(ICON_BUTTON, "hidden sm:inline-flex")}
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
        <ShoppingBagIcon aria-hidden />
        <CountBadge count={cartCount} />
      </button>
    </div>
  )
}
