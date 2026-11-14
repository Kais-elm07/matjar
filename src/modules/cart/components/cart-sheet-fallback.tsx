"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useUiStore } from "@/lib/ui-store"

/**
 * Stands in for the cart panel when its code can't be loaded (the fallback of Optional in LazyCartSheet):
 * a request to open the panel, from the header, the bottom bar or after adding a product, opens the cart
 * page instead, so the visitor can still reach the checkout.
 */
export function CartSheetFallback() {
  const open = useUiStore((state) => state.cartOpen)
  const setOpen = useUiStore((state) => state.setCartOpen)
  const router = useRouter()

  useEffect(() => {
    if (!open) return
    setOpen(false)
    router.push("/cart")
  }, [open, setOpen, router])

  return null
}
