"use client"

import dynamic from "next/dynamic"

import { useIdle } from "@/hooks/use-idle"
import type { NavCategory } from "@/lib/catalog/types"
import { useUiStore } from "@/lib/state/ui"

const MobileNavSheet = dynamic(
  () =>
    import("@/components/layout/mobile-nav-sheet").then(
      (mod) => mod.MobileNavSheet
    ),
  { ssr: false }
)

interface LazyMobileNavSheetProps {
  categories: NavCategory[]
}

/** The mobile menu: its code loads after the page appears, or as soon as it is asked to open, if sooner. */
export function LazyMobileNavSheet({ categories }: LazyMobileNavSheetProps) {
  const open = useUiStore((state) => state.menuOpen)
  const idle = useIdle()
  return open || idle ? <MobileNavSheet categories={categories} /> : null
}
