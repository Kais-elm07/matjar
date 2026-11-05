"use client"

import { SearchIcon, XIcon } from "lucide-react"

import { HEADER_ICON_BUTTON } from "@/components/layout/header-styles"
import { useUiStore } from "@/lib/state/ui"
import { cn } from "@/lib/utils"

interface MobileSearchButtonProps {
  className?: string
}

/** The search button in the mobile header: opens and closes the search field in a row under the header. */
export function MobileSearchButton({ className }: MobileSearchButtonProps) {
  const open = useUiStore((state) => state.searchOpen)
  const setOpen = useUiStore((state) => state.setSearchOpen)
  return (
    <button
      type="button"
      aria-label={open ? "إغلاق البحث" : "البحث"}
      aria-expanded={open}
      aria-controls="mobile-search"
      onClick={() => setOpen(!open)}
      className={cn(HEADER_ICON_BUTTON, className)}
    >
      {open ? <XIcon aria-hidden /> : <SearchIcon aria-hidden />}
    </button>
  )
}
