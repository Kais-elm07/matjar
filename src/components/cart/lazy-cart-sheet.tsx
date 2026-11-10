"use client"

import dynamic from "next/dynamic"

import { CartSheetFallback } from "@/components/cart/cart-sheet-fallback"
import { Optional } from "@/components/shared/optional"
import { useIdle } from "@/hooks/use-idle"
import { useUiStore } from "@/lib/state/ui"

const CartSheet = dynamic(
  () => import("@/components/cart/cart-sheet").then((mod) => mod.CartSheet),
  { ssr: false }
)

/**
 * The cart panel: its code loads after the page appears, or as soon as it is asked to open, if sooner.
 * If the code can't be loaded, the cart page opens in its place.
 */
export function LazyCartSheet() {
  const open = useUiStore((state) => state.cartOpen)
  const idle = useIdle()
  return open || idle ? (
    <Optional fallback={<CartSheetFallback />}>
      <CartSheet />
    </Optional>
  ) : null
}
