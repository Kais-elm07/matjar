"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

/**
 * After the first move to another page of the store, every page renders all its sections at once
 * (data-render-all, see RENDER_ALL_SCRIPT in src/lib/render-later.ts), so "back" returns to the same
 * place. Rendering sections later only helps the first page of a visit, which opens at its top.
 */
export function RenderAllAfterNavigation() {
  const pathname = usePathname()
  const firstPathname = useRef(pathname)

  useEffect(() => {
    if (pathname !== firstPathname.current) {
      document.documentElement.dataset.renderAll = ""
    }
  }, [pathname])

  return null
}
