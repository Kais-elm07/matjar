"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

import { isRecord } from "@/lib/guards"
import { useRestored } from "@/lib/saved-stores"
import { safeStorage } from "@/lib/storage"

type MascotPreferences = {
  /** The visitor hid Najm, the store's mascot, with the button in the footer or in his greeting */
  hidden: boolean
  setHidden: (hidden: boolean) => void
}

/** Whether Najm shows, saved in the browser so the visitor's choice lasts between visits. */
export const useMascotPreferences = create<MascotPreferences>()(
  persist(
    (set) => ({
      hidden: false,
      setHidden: (hidden) => set({ hidden }),
    }),
    {
      name: "matjar-mascot",
      version: 1,
      storage: safeStorage(),
      partialize: (state) => ({ hidden: state.hidden }),
      // Anything but a saved "hidden: true" shows Najm
      merge: (persisted, current) => ({
        ...current,
        hidden: isRecord(persisted) && persisted.hidden === true,
      }),
      // Restored after the first render, like the cart, so the page matches the prebuilt HTML
      skipHydration: true,
    }
  )
)

/** Whether the visitor's choice to show or hide Najm has been restored from the browser. */
export function useMascotRestored() {
  return useRestored(useMascotPreferences)
}
