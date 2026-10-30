"use client"

import { create } from "zustand"

/** حالة النوافذ المشتركة بين الرأس وشريط الجوال السفلي وأزرار الإضافة للسلة. */
type UiState = {
  cartOpen: boolean
  menuOpen: boolean
  setCartOpen: (open: boolean) => void
  setMenuOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>()((set) => ({
  cartOpen: false,
  menuOpen: false,
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
}))
