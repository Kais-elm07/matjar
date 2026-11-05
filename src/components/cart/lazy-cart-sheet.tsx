"use client"

import dynamic from "next/dynamic"

import { useIdle } from "@/hooks/use-idle"
import { useUiStore } from "@/lib/state/ui"

const CartSheet = dynamic(
  () => import("@/components/cart/cart-sheet").then((mod) => mod.CartSheet),
  { ssr: false }
)

/** The cart panel: its code loads after the page appears, or as soon as it is asked to open, if sooner. */
export function LazyCartSheet() {
  const open = useUiStore((state) => state.cartOpen)
  const idle = useIdle()
  return open || idle ? <CartSheet /> : null
}
