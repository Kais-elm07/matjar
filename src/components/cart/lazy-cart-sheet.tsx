"use client"

import dynamic from "next/dynamic"

import { useUiStore } from "@/lib/store/ui"
import { useIdle } from "@/lib/use-idle"

const CartSheet = dynamic(
  () => import("@/components/cart/cart-sheet").then((mod) => mod.CartSheet),
  { ssr: false }
)

/** نافذة السلة: يُحمَّل كودها بعد ظهور الصفحة، أو فور طلب فتحها إن سبق ذلك. */
export function LazyCartSheet() {
  const open = useUiStore((state) => state.cartOpen)
  const idle = useIdle()
  return open || idle ? <CartSheet /> : null
}
