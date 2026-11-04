"use client"

import { SearchIcon, XIcon } from "lucide-react"

import { SearchBox } from "@/components/layout/search-box"
import { useUiStore } from "@/lib/store/ui"
import { cn } from "@/lib/utils"

import { HEADER_ICON_BUTTON as ICON_BUTTON } from "./header-styles"

/** زر البحث في رأس الجوال: يفتح حقل البحث في سطر تحت الرأس ويغلقه. */
export function MobileSearchButton({ className }: { className?: string }) {
  const open = useUiStore((state) => state.searchOpen)
  const setOpen = useUiStore((state) => state.setSearchOpen)
  return (
    <button
      type="button"
      aria-label={open ? "إغلاق البحث" : "البحث"}
      aria-expanded={open}
      aria-controls="mobile-search"
      onClick={() => setOpen(!open)}
      className={cn(ICON_BUTTON, className)}
    >
      {open ? <XIcon aria-hidden /> : <SearchIcon aria-hidden />}
    </button>
  )
}

/** سطر البحث تحت الرأس على الجوال، يظهر عند الضغط على زر البحث. */
export function MobileSearchRow() {
  const open = useUiStore((state) => state.searchOpen)
  const setOpen = useUiStore((state) => state.setSearchOpen)
  return (
    <div id="mobile-search" className="md:hidden">
      {open && (
        <div className="page-container pb-3">
          <SearchBox autoFocus onSubmitted={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}
