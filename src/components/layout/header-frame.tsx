"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { useUiStore } from "@/lib/store/ui"
import { cn } from "@/lib/utils"

/**
 * إطار الرأس: في الصفحة الرئيسية يكون شفافاً بنص أبيض فوق الواجهة،
 * ويتحول إلى أبيض بحد سفلي عند التمرير أو فتح البحث، وفي بقية الصفحات دائماً أبيض.
 * المكوّنات داخله تقرأ اللون من data-tone عبر صنف المجموعة group/hdr.
 */
export function HeaderFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchOpen = useUiStore((state) => state.searchOpen)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const overlay = pathname === "/" && !scrolled && !searchOpen

  return (
    <header
      data-tone={overlay ? "light" : "dark"}
      className={cn(
        "group/hdr sticky top-0 z-40 transition-colors duration-300",
        overlay
          ? "bg-transparent text-primary-foreground"
          : "border-b bg-background text-foreground"
      )}
    >
      {children}
    </header>
  )
}
