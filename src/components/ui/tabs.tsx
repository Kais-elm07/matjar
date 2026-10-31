"use client"

import {
  createContext,
  use,
  useId,
  useState,
  type ComponentProps,
  type KeyboardEvent,
} from "react"
import { cn } from "cn"

/**
 * تبويبات خفيفة بنفس واجهة تبويبات shadcn، دون مكتبة Base UI، لتقليل JavaScript الصفحة.
 * كل اللوحات موجودة في HTML (غير النشطة مخفية بالخاصية hidden)، فتقرؤها محركات البحث.
 * الأسهم تنتقل بين التبويبات بحسب اتجاه الصفحة، وHome وEnd إلى الأول والأخير.
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

function Tabs({
  defaultValue,
  className,
  ...props
}: ComponentProps<"div"> & { defaultValue: string }) {
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

/** الأسهم تنقل التركيز إلى التبويب المجاور وتختاره. */
function moveBetweenTabs(event: KeyboardEvent<HTMLDivElement>) {
  const tabs = [
    ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]:not(:disabled)'
    ),
  ]
  const current = tabs.findIndex((tab) => tab === document.activeElement)
  if (current === -1) return

  // في الاتجاه العربي السهم الأيسر يعني التالي
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

function TabsList({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      role="tablist"
      data-slot="tabs-list"
      onKeyDown={moveBetweenTabs}
      className={cn(
        "inline-flex w-fit items-center rounded-lg bg-muted p-[3px] text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  value,
  className,
  ...props
}: ComponentProps<"button"> & { value: string }) {
  const { baseId, value: active, select } = useTabs()
  const selected = value === active

  return (
    <button
      type="button"
      role="tab"
      id={tabId(baseId, value)}
      aria-controls={panelId(baseId, value)}
      aria-selected={selected}
      // التبويب النشط وحده في ترتيب Tab، والبقية بالأسهم
      tabIndex={selected ? 0 : -1}
      data-slot="tabs-trigger"
      data-active={selected ? "" : undefined}
      onClick={() => select(value)}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-active:bg-background data-active:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  value,
  className,
  ...props
}: ComponentProps<"div"> & { value: string }) {
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
