"use client"

import { SearchBox } from "@/components/layout/search-box"
import { useUiStore } from "@/lib/store/ui"

/** The search row under the header on mobile, shown when the search button is pressed. */
export function MobileSearchRow() {
  const open = useUiStore((state) => state.searchOpen)
  const setOpen = useUiStore((state) => state.setSearchOpen)
  return (
    <div id="mobile-search" className="md:hidden">
      {open && (
        <div className="page-container pb-3">
          <SearchBox autoFocus onSubmitted={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}
