"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { setHidden } from "@/modules/admin/actions"
import { toast } from "@/lib/toast"

interface VisibilityButtonProps {
  id: number
  name: string
  hidden: boolean
}

/** Hides a product from the store or shows it again; a product is never deleted, because orders name it. */
export function VisibilityButton({ id, name, hidden }: VisibilityButtonProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <Button
      variant="outline"
      size="xl"
      disabled={pending}
      aria-label={
        hidden ? `إظهار ${name} في المتجر` : `إخفاء ${name} من المتجر`
      }
      onClick={() =>
        startTransition(async () => {
          const result = await setHidden(id, !hidden)
          if (!result.ok) {
            toast.error(result.message)
            return
          }
          toast(result.message)
          router.refresh()
        })
      }
    >
      {hidden ? "إظهار" : "إخفاء"}
    </Button>
  )
}
