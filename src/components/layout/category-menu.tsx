"use client"

import { useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react"

import type { NavCategory } from "@/lib/catalog/types"
import { categoryPath } from "@/lib/routes"
import { cn } from "@/lib/utils"

interface CategoryMenuProps {
  categories: NavCategory[]
  /** The button's styling, to match the other header links */
  className?: string
}

/**
 * The "الفئات" (Categories) button in the desktop navigation row: opens a large panel with a
 * column for each main category and its subcategories. It opens on click or mouse hover, and closes
 * with Escape or a click outside it. Built as a simple disclosure button without a popover library,
 * so it doesn't weigh down the mobile pages, which don't show it.
 */
export function CategoryMenu({ categories, className }: CategoryMenuProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Cancel a delayed open or close if the menu disappears before it runs
  useEffect(() => () => clearTimeout(hoverTimer.current), [])

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      const target = event.target
      if (target instanceof Node && rootRef.current?.contains(target)) return
      setOpen(false)
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

  // Open on mouse hover after a short delay, so the panel doesn't open on a passing hover
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
      // Focus leaving the button and the panel (with the Tab key, for example) closes the panel
      onBlur={(event) => {
        const next = event.relatedTarget
        if (next instanceof Node && rootRef.current?.contains(next)) return
        setOpen(false)
      }}
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
        className={cn("gap-1", className)}
      >
        الفئات
        <ChevronDownIcon
          className={cn("size-4 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        // The panel spans the full width of the desktop link row, whose <nav> is the relative container
        className="absolute inset-x-0 top-full z-50 border-b bg-popover text-popover-foreground shadow-lg"
      >
        <div className="page-container py-6">
          <ul className="grid grid-cols-3 gap-x-8 gap-y-6 lg:grid-cols-5">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={categoryPath(category.slug)}
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
                          href={categoryPath(child.slug)}
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
