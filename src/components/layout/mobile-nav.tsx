"use client"

import dynamic from "next/dynamic"
import { MenuIcon } from "lucide-react"

import { useUiStore } from "@/lib/store/ui"
import { useIdle } from "@/lib/use-idle"

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
        className="-ms-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-colors outline-none hover:bg-foreground/5 group-data-[tone=light]/hdr:hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-ring md:hidden [&_svg]:size-6"
      >
        <MenuIcon aria-hidden />
      </button>
      {(open || idle) && <MobileNavSheet categories={categories} />}
    </>
  )
}
