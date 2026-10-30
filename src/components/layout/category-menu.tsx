"use client"

import { useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import { ChevronDownIcon, ChevronRightIcon, LayoutGridIcon } from "lucide-react"

import type { NavCategory } from "@/components/layout/mobile-nav"
import { cn } from "@/lib/utils"

/**
 * زر "كل الفئات" في صف التنقل على الحاسوب: يفتح لوحة كبيرة بعمود لكل فئة رئيسية
 * وفئاتها الفرعية. يفتح بالنقر أو بمرور الفأرة، ويُغلق بـ Escape أو بالنقر خارجه.
 * مبني كزر إفصاح بسيط دون مكتبة نوافذ عائمة، حتى لا يثقل صفحات الجوال التي لا تعرضه.
 */
export function CategoryMenu({ categories }: { categories: NavCategory[] }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  // فتح بمرور الفأرة مع تأخير بسيط، حتى لا تنفتح اللوحة عند المرور العابر
  function hoverTo(next: boolean) {
    clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => setOpen(next), next ? 120 : 200)
  }

  const close = () => setOpen(false)

  return (
    <div
      ref={rootRef}
      onPointerEnter={(event) => event.pointerType === "mouse" && hoverTo(true)}
      onPointerLeave={(event) =>
        event.pointerType === "mouse" && hoverTo(false)
      }
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          clearTimeout(hoverTimer.current)
          setOpen((value) => !value)
        }}
        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-highlight px-4 text-sm font-bold text-highlight-foreground outline-none hover:bg-highlight/85 focus-visible:ring-3 focus-visible:ring-ring"
      >
        <LayoutGridIcon className="size-4" aria-hidden />
        كل الفئات
        <ChevronDownIcon
          className={cn("size-4 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full z-50 border-b bg-popover text-popover-foreground shadow-lg"
      >
        <div className="page-container py-6">
          <ul className="grid grid-cols-3 gap-x-8 gap-y-6 lg:grid-cols-5">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  onClick={close}
                  className="rounded-sm font-bold underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {category.name}
                </Link>
                {category.children.length > 0 && (
                  <ul className="mt-2 space-y-1.5">
                    {category.children.map((child) => (
                      <li key={child.slug}>
                        <Link
                          href={`/category/${child.slug}`}
                          onClick={close}
                          className="rounded-sm text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <Link
            href="/products"
            onClick={close}
            className="mt-6 inline-flex items-center gap-1 rounded-sm text-sm font-bold text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            تصفّح كل المنتجات
            <ChevronRightIcon className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  )
}
