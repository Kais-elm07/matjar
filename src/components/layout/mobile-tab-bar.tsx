"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  HeartIcon,
  HomeIcon,
  LayoutGridIcon,
  SearchIcon,
  ShoppingCartIcon,
  type LucideIcon,
} from "lucide-react"

import { CountBadge } from "@/components/layout/header-actions"
import { useCartCount } from "@/lib/store/cart"
import { useUiStore } from "@/lib/store/ui"
import { useWishlistCount } from "@/lib/store/wishlist"
import { cn } from "@/lib/utils"

const ITEM =
  "relative flex h-full flex-col items-center justify-center gap-1 text-[11px] font-bold outline-none focus-visible:bg-muted [&_svg]:size-6"

/** شريط التنقل الثابت أسفل شاشة الجوال: الرئيسية والفئات والبحث والمفضلة والسلة. */
export function MobileTabBar() {
  const pathname = usePathname()
  const cartCount = useCartCount()
  const wishlistCount = useWishlistCount()
  const setCartOpen = useUiStore((state) => state.setCartOpen)
  const setMenuOpen = useUiStore((state) => state.setMenuOpen)

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <nav
      aria-label="التنقل السريع"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
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

function TabLink({
  href,
  icon: Icon,
  label,
  count = 0,
  active,
}: {
  href: string
  icon: LucideIcon
  label: string
  count?: number
  active: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      aria-label={count > 0 ? `${label} (${count})` : undefined}
      className={cn(ITEM, active ? "text-primary" : "text-muted-foreground")}
    >
      <span className="relative">
        <Icon aria-hidden />
        <CountBadge count={count} className="-end-2.5 -top-2" />
      </span>
      {label}
    </Link>
  )
}
