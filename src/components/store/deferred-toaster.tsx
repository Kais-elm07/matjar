"use client"

import { useEffect } from "react"

import { Toaster } from "@/components/ui/sonner"
import { markToasterMounted } from "@/lib/toast"

/**
 * مكوّن الرسائل نفسه. تأثيرات المكوّنات الداخلية تسبق الخارجية،
 * فحين يبلّغ هذا المكوّن بظهوره يكون Toaster قد اشترك في الرسائل.
 */
export function DeferredToaster() {
  useEffect(() => markToasterMounted(), [])
  return <Toaster />
}
