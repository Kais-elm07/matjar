"use client"

import { useState } from "react"
import { HeartIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useIsWishlisted, useWishlistStore } from "@/lib/state/wishlist"
import { toast } from "@/lib/toast"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  slug: string
  name: string
  variant?: "icon" | "labeled"
  className?: string
}

/**
 * Wishlist button: a heart in an orange circle on the card image, or a text button on the product page.
 * A filled heart means the product is saved.
 */
export function WishlistButton({
  slug,
  name,
  variant = "icon",
  className,
}: WishlistButtonProps) {
  const saved = useIsWishlisted(slug)
  const toggle = useWishlistStore((state) => state.toggle)
  // Number of adds by click: redraws the heart so it pulses, but not when the saved wishlist is restored
  const [pops, setPops] = useState(0)

  function onClick() {
    const added = toggle(slug)
    if (added) setPops((count) => count + 1)
    toast(added ? "أُضيف إلى المفضلة" : "أُزيل من المفضلة", {
      description: name,
    })
  }

  const icon = (
    <HeartIcon
      key={pops}
      aria-hidden
      className={cn(
        "transition-colors",
        saved && "fill-current",
        saved && pops > 0 && "animate-in duration-300 zoom-in-50"
      )}
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
        // A 44px touch area, with the visible circle smaller than it
        "group/heart relative z-10 flex size-11 items-center justify-center rounded-full outline-none",
        className
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors group-hover/heart:bg-primary/90 group-focus-visible/heart:ring-3 group-focus-visible/heart:ring-foreground [&_svg]:size-[18px]">
        {icon}
      </span>
    </button>
  )
}
