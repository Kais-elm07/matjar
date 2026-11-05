"use client"

import { create } from "zustand"

/** State of the pop-ups shared by the header, the mobile bottom bar and the add-to-cart buttons. */
type UiState = {
  cartOpen: boolean
  menuOpen: boolean
  /** The search field under the header on mobile */
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
