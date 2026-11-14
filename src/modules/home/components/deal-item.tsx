"use client"

import { useSyncExternalStore } from "react"
import { TimerIcon } from "lucide-react"

import { pluralize, type PluralForms } from "@/lib/arabic-plural"
import { saleEndTime } from "@/lib/dates"
import { cn } from "@/lib/utils"

const MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
]

const DAY_FORMS: PluralForms = {
  zero: "",
  one: "يوم واحد",
  two: "يومان",
  few: "{n} أيام",
  many: "{n} يوماً",
  other: "{n} يوم",
}

/**
 * One clock for all the deals on the page: a single timer that ticks every second while at least
 * one deal is shown, instead of a timer for each deal.
 */
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | undefined

function subscribe(onTick: () => void) {
  listeners.add(onTick)
  timer ??= setInterval(() => {
    for (const listener of listeners) listener()
  }, 1000)
  return () => {
    listeners.delete(onTick)
    if (listeners.size === 0) {
      clearInterval(timer)
      timer = undefined
    }
  }
}

const pad = (value: number) => value.toString().padStart(2, "0")

/**
 * The time left until the deal ends (in seconds since 1970), or null once it has ended.
 * Whole days while a day or more is left, so the pill fits on one line on a phone; the ticking
 * clock appears in the last day. The text is what the deal subscribes to, so until the last day
 * it re-renders once a day, not every second.
 */
function timeLeft(end: number) {
  const left = end - Math.floor(Date.now() / 1000)
  if (left <= 0) return null
  const days = Math.floor(left / 86400)
  return days > 0
    ? `ينتهي خلال ${pluralize(days, DAY_FORMS)}`
    : `ينتهي خلال ${pad(Math.floor(left / 3600))}:${pad(Math.floor((left % 3600) / 60))}:${pad(left % 60)}`
}

/** The deal's last day, shown during the build and the first render, before the browser's clock is read. */
function lastDay(endsAt: string) {
  const [, month, day] = endsAt.split("-").map(Number)
  return `ينتهي العرض في ${day} ${MONTHS[month - 1]}`
}

interface DealItemProps {
  /** The last day of the deal, in the format 2026-12-31 */
  endsAt: string
  children: React.ReactNode
  className?: string
}

/**
 * A product in the limited-time deals section, with a real countdown to the end of the deal's last day
 * (in the store's time zone). The product leaves the section when the deal ends.
 */
export function DealItem({ endsAt, children, className }: DealItemProps) {
  const end = saleEndTime(endsAt) / 1000
  const label = useSyncExternalStore(
    subscribe,
    () => timeLeft(end),
    () => lastDay(endsAt)
  )

  if (label === null) return null

  return (
    <li className={cn("flex flex-col gap-2", className)}>
      <p className="flex items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground tabular-nums">
        <TimerIcon className="size-3.5 shrink-0" aria-hidden />
        {label}
      </p>
      <div className="flex-1">{children}</div>
    </li>
  )
}
