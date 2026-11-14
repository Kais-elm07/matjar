"use client"

import { DogIcon } from "lucide-react"

import { siteConfig } from "@/config/site"
import { useMascotRestored } from "@/lib/state/hydration"
import { useMascotPreferences } from "@/modules/mascot/store"

/** The footer button that hides Najm, or brings him back; the choice is saved in the browser. */
export function MascotToggle() {
  const restored = useMascotRestored()
  const hidden = useMascotPreferences((state) => state.hidden)
  const setHidden = useMascotPreferences((state) => state.setHidden)
  if (!restored) return null

  return (
    <button
      type="button"
      onClick={() => setHidden(!hidden)}
      className="inline-flex min-h-11 items-center gap-1.5 rounded-sm transition-colors outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring"
    >
      <DogIcon className="size-4 text-primary" aria-hidden />
      {hidden
        ? `إظهار ${siteConfig.mascotName}`
        : `إخفاء ${siteConfig.mascotName}`}
    </button>
  )
}
