"use client"

import { create } from "zustand"

/** حالة النوافذ المشتركة بين الرأس وشريط الجوال السفلي وأزرار الإضافة للسلة. */
type UiState = {
  cartOpen: boolean
  menuOpen: boolean
  /** حقل البحث تحت الرأس على الجوال */
  searchOpen: boolean
  setCartOpen: (open: boolean) => void
  setMenuOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>()((set) => ({
  cartOpen: false,
  menuOpen: false,
  searchOpen: false,
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
}))
