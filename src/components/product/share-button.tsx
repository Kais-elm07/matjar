"use client"

import { Share2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/lib/toast"

interface ShareButtonProps {
  title: string
  className?: string
}

/** Shares the product link: through the share menu on mobile, or by copying the link on desktop. */
export function ShareButton({ title, className }: ShareButtonProps) {
  async function share() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // The visitor closed the share menu without choosing
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      toast("نُسخ رابط المنتج", { description: "الصقه في أي محادثة لمشاركته." })
    } catch {
      toast.error("تعذّر نسخ الرابط")
    }
  }

  return (
    <Button variant="outline" size="xl" onClick={share} className={className}>
      <Share2Icon aria-hidden />
      مشاركة
    </Button>
  )
}
