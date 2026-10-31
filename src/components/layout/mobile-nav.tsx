"use client"

import dynamic from "next/dynamic"
import { MenuIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
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
      <Button
        variant="ghost"
        size="icon-xl"
        className="-ms-2 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground md:hidden"
        aria-label="فتح القائمة"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <MenuIcon aria-hidden />
      </Button>
      {(open || idle) && <MobileNavSheet categories={categories} />}
    </>
  )
}
