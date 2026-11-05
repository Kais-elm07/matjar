"use client"

import { usePathname } from "next/navigation"
import {
  HeartIcon,
  HomeIcon,
  LayoutGridIcon,
  SearchIcon,
  ShoppingCartIcon,
} from "lucide-react"

import { CountBadge } from "@/components/layout/count-badge"
import { TabLink } from "@/components/layout/tab-link"
import { useCartCount } from "@/lib/store/cart"
import { useUiStore } from "@/lib/store/ui"
import { useWishlistCount } from "@/lib/store/wishlist"
import { cn } from "@/lib/utils"

import { TAB_BAR_ITEM as ITEM } from "./tab-bar-styles"

/** شريط التنقل الثابت أسفل شاشة الجوال: الرئيسية والفئات والبحث والمفضلة والسلة. */
export function MobileTabBar() {
  const pathname = usePathname()
  const cartCount = useCartCount()
  const wishlistCount = useWishlistCount()
  const setCartOpen = useUiStore((state) => state.setCartOpen)
  const menuOpen = useUiStore((state) => state.menuOpen)
  const setMenuOpen = useUiStore((state) => state.setMenuOpen)

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <nav
      aria-label="التنقل السريع"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid h-16 grid-cols-5">
        <li>
          <TabLink
            href="/"
            icon={HomeIcon}
            label="الرئيسية"
            active={isActive("/")}
          />
        </li>
        <li>
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className={cn(ITEM, "w-full text-muted-foreground")}
          >
            <LayoutGridIcon aria-hidden />
            الفئات
          </button>
        </li>
        <li>
          <TabLink
            href="/search"
            icon={SearchIcon}
            label="البحث"
            active={isActive("/search")}
          />
        </li>
        <li>
          <TabLink
            href="/wishlist"
            icon={HeartIcon}
            label="المفضلة"
            count={wishlistCount}
            active={isActive("/wishlist")}
          />
        </li>
        <li>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={cartCount > 0 ? `السلة (${cartCount})` : "السلة"}
            className={cn(
              ITEM,
              "w-full",
              isActive("/cart") ? "text-primary" : "text-muted-foreground"
            )}
          >
            <span className="relative">
              <ShoppingCartIcon aria-hidden />
              <CountBadge count={cartCount} className="-end-2.5 -top-2" />
            </span>
            السلة
          </button>
        </li>
      </ul>
    </nav>
  )
}
