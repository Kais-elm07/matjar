import { siteConfig } from "@/config/site"

/** Format of the UTC offset in src/config/site.ts, such as "+03:00". */
export const UTC_OFFSET_PATTERN = /^([+-])(\d{2}):(\d{2})$/

/** The store's offset from UTC in milliseconds. */
function offsetMs() {
  const match = UTC_OFFSET_PATTERN.exec(siteConfig.utcOffset)
  if (!match) return 0
  const [, sign, hours, minutes] = match
  const total = (Number(hours) * 60 + Number(minutes)) * 60_000
  return sign === "-" ? -total : total
}

/** Today's date in store time, as 2026-10-30, not in the time of the machine that builds the site. */
export function storeToday(now = Date.now()) {
  return new Date(now + offsetMs()).toISOString().slice(0, 10)
}

/** When the sale ends, in milliseconds: the last second of its last day in store time. */
export function saleEndTime(endsAt: string) {
  return Date.parse(`${endsAt}T23:59:59${siteConfig.utcOffset}`)
}
