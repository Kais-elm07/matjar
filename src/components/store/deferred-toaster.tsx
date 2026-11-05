"use client"

import { useEffect } from "react"

import { Toaster } from "@/components/ui/sonner"
import { markToasterMounted } from "@/lib/toast"

/**
 * The toast component itself. Inner components' effects run before outer ones,
 * so when this component reports that it mounted, `Toaster` has already subscribed to the toasts.
 */
export function DeferredToaster() {
  useEffect(() => markToasterMounted(), [])
  return <Toaster />
}
