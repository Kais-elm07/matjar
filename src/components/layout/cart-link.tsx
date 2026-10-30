import Link from "next/link"
import { ShoppingCartIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * رابط السلة مع عداد المنتجات.
 * العداد يُربط بمحتوى السلة الفعلي في مرحلة السلة (المرحلة 3).
 */
export function CartLink({ count = 0 }: { count?: number }) {
  return (
    <Link
      href="/cart"
      // صفحة السلة تُبنى في المرحلة 3، فلا داعي لتحميلها مسبقاً الآن
      prefetch={false}
      aria-label={count > 0 ? `السلة (${count})` : "السلة"}
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon-xl" }),
        "relative"
      )}
    >
      <ShoppingCartIcon aria-hidden />
      {count > 0 && (
        <span
          aria-hidden
          className="absolute end-0.5 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] leading-none font-bold text-primary-foreground tabular-nums"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  )
}
