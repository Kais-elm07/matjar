"use client"

import { HeartIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useIsWishlisted, useWishlistStore } from "@/lib/store/wishlist"
import { cn } from "@/lib/utils"

/**
 * زر المفضلة: قلب فوق صورة البطاقة، أو زر بنص في صفحة المنتج.
 * القلب الممتلئ يعني أن المنتج محفوظ.
 */
export function WishlistButton({
  slug,
  name,
  variant = "icon",
  className,
}: {
  slug: string
  name: string
  variant?: "icon" | "labeled"
  className?: string
}) {
  const saved = useIsWishlisted(slug)
  const toggle = useWishlistStore((state) => state.toggle)

  function onClick() {
    const added = toggle(slug)
    toast(added ? "أُضيف إلى المفضلة" : "أُزيل من المفضلة", {
      description: name,
    })
  }

  const icon = (
    <HeartIcon
      aria-hidden
      className={cn("transition-colors", saved && "fill-primary text-primary")}
    />
  )

  if (variant === "labeled") {
    return (
      <Button
        variant="outline"
        size="xl"
        aria-pressed={saved}
        onClick={onClick}
        className={className}
      >
        {icon}
        {saved ? "في المفضلة" : "أضف للمفضلة"}
      </Button>
    )
  }

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={`حفظ ${name} في المفضلة`}
      onClick={onClick}
      className={cn(
        // مساحة لمس 44 بكسل، والدائرة الظاهرة أصغر منها
        "group/heart relative z-10 flex size-11 items-center justify-center rounded-full outline-none",
        className
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-full bg-background/90 shadow-sm transition-colors group-hover/heart:bg-background group-focus-visible/heart:ring-3 group-focus-visible/heart:ring-ring/50 [&_svg]:size-[18px]">
        {icon}
      </span>
    </button>
  )
}
