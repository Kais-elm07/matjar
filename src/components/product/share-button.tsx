"use client"

import { Share2Icon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

/** مشاركة رابط المنتج: قائمة المشاركة في الجوال، أو نسخ الرابط في الحاسوب. */
export function ShareButton({
  title,
  className,
}: {
  title: string
  className?: string
}) {
  async function share() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // أغلق الزائر قائمة المشاركة دون اختيار
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
