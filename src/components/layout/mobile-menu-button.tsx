"use client"

import { MenuIcon } from "lucide-react"

import { HEADER_ICON_BUTTON } from "@/components/layout/header-styles"
import { useUiStore } from "@/lib/ui-store"
import { cn } from "@/lib/utils"

/**
 * The menu button at the start of the header on mobile. It opens the mobile menu (LazyMobileNavSheet
 * in StoreShell), which the "الفئات" (Categories) button in the bottom bar opens too.
 */
export function MobileMenuButton() {
  const open = useUiStore((state) => state.menuOpen)
  const setOpen = useUiStore((state) => state.setMenuOpen)

  return (
    <button
      type="button"
      aria-label="فتح القائمة"
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={() => setOpen(true)}
      className={cn(HEADER_ICON_BUTTON, "-ms-2 md:hidden")}
    >
      <MenuIcon aria-hidden />
    </button>
  )
}
