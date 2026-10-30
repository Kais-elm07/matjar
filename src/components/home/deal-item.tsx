"use client"

import { useSyncExternalStore } from "react"
import { TimerIcon } from "lucide-react"

import { siteConfig } from "@/config/site"
import { pluralize, type PluralForms } from "@/lib/arabic-plural"
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

/** ساعة تتحدث كل ثانية في المتصفح، وقيمتها null أثناء البناء وأول عرض. */
function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 1000)
  return () => clearInterval(timer)
}
const nowInSeconds = () => Math.floor(Date.now() / 1000)
const atBuildTime = () => null

const pad = (value: number) => value.toString().padStart(2, "0")

/**
 * منتج في قسم العروض المحدودة، مع عدّاد تنازلي حقيقي حتى نهاية آخر يوم في العرض
 * (بتوقيت المتجر). يختفي المنتج من القسم عند انتهاء العرض.
 */
export function DealItem({
  endsAt,
  children,
  className,
}: {
  /** آخر يوم في العرض بصيغة 2026-12-31 */
  endsAt: string
  children: React.ReactNode
  className?: string
}) {
  const now = useSyncExternalStore(subscribe, nowInSeconds, atBuildTime)
  const end = Date.parse(`${endsAt}T23:59:59${siteConfig.utcOffset}`) / 1000

  if (now !== null && now >= end) return null

  const [, month, day] = endsAt.split("-").map(Number)
  let label = `ينتهي العرض في ${day} ${MONTHS[month - 1]}`
  if (now !== null) {
    const left = end - now
    const days = Math.floor(left / 86400)
    const clock = `${pad(Math.floor((left % 86400) / 3600))}:${pad(Math.floor((left % 3600) / 60))}:${pad(left % 60)}`
    label =
      days > 0
        ? `ينتهي خلال ${pluralize(days, DAY_FORMS)} و ${clock}`
        : `ينتهي خلال ${clock}`
  }

  return (
    <li className={cn("flex flex-col gap-2", className)}>
      <p className="flex items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground tabular-nums">
        <TimerIcon className="size-3.5 shrink-0 text-highlight" aria-hidden />
        {label}
      </p>
      <div className="flex-1">{children}</div>
    </li>
  )
}
