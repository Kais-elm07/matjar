"use client"

import {
  createContext,
  use,
  useId,
  useState,
  type ComponentProps,
  type KeyboardEvent,
} from "react"
import { cn } from "@/lib/utils"

/**
 * Lightweight tabs with shadcn's tabs API but no Base UI library, to reduce the page's JavaScript.
 * All panels are in the HTML (inactive ones get the `hidden` attribute), so search engines read them.
 * Arrow keys move between tabs following the page direction; Home and End go to the first and last.
 * The default look comes from DESIGN.md: pills with a gray border, and the active one is blue
 * with dark text (section-tab-active).
 */

type TabsContextValue = {
  baseId: string
  value: string
  select: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabs() {
  const context = use(TabsContext)
  if (!context) throw new Error("مكوّنات التبويبات يجب أن تكون داخل <Tabs>")
  return context
}

const tabId = (baseId: string, value: string) => `${baseId}-tab-${value}`
const panelId = (baseId: string, value: string) => `${baseId}-panel-${value}`

interface TabsProps extends ComponentProps<"div"> {
  defaultValue: string
}

function Tabs({ defaultValue, className, ...props }: TabsProps) {
  const baseId = useId()
  const [value, select] = useState(defaultValue)

  return (
    <TabsContext value={{ baseId, value, select }}>
      <div
        data-slot="tabs"
        className={cn("flex flex-col gap-2", className)}
        {...props}
      />
    </TabsContext>
  )
}

/** Arrow keys move focus to the adjacent tab and select it. */
function moveBetweenTabs(event: KeyboardEvent<HTMLDivElement>) {
  const tabs = [
    ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]:not(:disabled)'
    ),
  ]
  const current = tabs.findIndex((tab) => tab === document.activeElement)
  if (current === -1) return

  // In the Arabic (RTL) direction the left arrow means next
  const rtl = getComputedStyle(event.currentTarget).direction === "rtl"
  const step = { ArrowLeft: rtl ? 1 : -1, ArrowRight: rtl ? -1 : 1 }[event.key]
  const target =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? tabs.length - 1
        : step
          ? (current + step + tabs.length) % tabs.length
          : undefined
  if (target === undefined) return

  event.preventDefault()
  tabs[target].focus()
  tabs[target].click()
}

interface TabsListProps extends ComponentProps<"div"> {}

function TabsList({ className, ...props }: TabsListProps) {
  return (
    <div
      role="tablist"
      data-slot="tabs-list"
      onKeyDown={moveBetweenTabs}
      className={cn(
        "no-scrollbar flex w-fit items-center gap-2 overflow-x-auto",
        className
      )}
      {...props}
    />
  )
}

interface TabsTriggerProps extends ComponentProps<"button"> {
  value: string
}

function TabsTrigger({ value, className, ...props }: TabsTriggerProps) {
  const { baseId, value: active, select } = useTabs()
  const selected = value === active

  return (
    <button
      type="button"
      role="tab"
      id={tabId(baseId, value)}
      aria-controls={panelId(baseId, value)}
      aria-selected={selected}
      // Only the active tab is in the Tab order; the rest are reached with the arrow keys
      tabIndex={selected ? 0 : -1}
      data-slot="tabs-trigger"
      data-active={selected ? "" : undefined}
      onClick={() => select(value)}
      className={cn(
        "inline-flex h-9 flex-none items-center justify-center gap-1.5 rounded-full border border-border px-4 text-sm font-medium whitespace-nowrap text-foreground transition-colors outline-none hover:border-foreground/40 focus-visible:ring-3 focus-visible:ring-ring/50 data-active:border-primary data-active:bg-primary data-active:text-primary-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

interface TabsContentProps extends ComponentProps<"div"> {
  value: string
}

function TabsContent({ value, className, ...props }: TabsContentProps) {
  const { baseId, value: active } = useTabs()

  return (
    <div
      role="tabpanel"
      id={panelId(baseId, value)}
      aria-labelledby={tabId(baseId, value)}
      tabIndex={0}
      hidden={value !== active}
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
