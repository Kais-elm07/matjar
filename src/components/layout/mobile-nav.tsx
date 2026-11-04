"use client"

import dynamic from "next/dynamic"
import { MenuIcon } from "lucide-react"

import { useUiStore } from "@/lib/store/ui"
import { useIdle } from "@/lib/use-idle"
import { cn } from "@/lib/utils"

import { HEADER_ICON_BUTTON } from "./header-styles"

export type NavCategory = {
  slug: string
  name: string
  children: { slug: string; name: string }[]
}

const MobileNavSheet = dynamic(
  () =>
    import("@/components/layout/mobile-nav-sheet").then(
      (mod) => mod.MobileNavSheet
    ),
  { ssr: false }
)

/**
 * زر قائمة الجوال في الرأس. القائمة نفسها يُحمَّل كودها بعد ظهور الصفحة أو عند أول ضغطة،
 * وتفتح أيضاً من زر "الفئات" في الشريط السفلي.
 */
export function MobileNav({ categories }: { categories: NavCategory[] }) {
  const open = useUiStore((state) => state.menuOpen)
  const setOpen = useUiStore((state) => state.setMenuOpen)
  const idle = useIdle()

  return (
    <>
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
      {(open || idle) && <MobileNavSheet categories={categories} />}
    </>
  )
}
