import { siteConfig } from "@/config/site"

/** صيغة فرق التوقيت في src/config/site.ts، مثل "+03:00". */
export const UTC_OFFSET_PATTERN = /^([+-])(\d{2}):(\d{2})$/

/** فرق توقيت المتجر عن UTC بالملّي ثانية. */
function offsetMs() {
  const match = UTC_OFFSET_PATTERN.exec(siteConfig.utcOffset)
  if (!match) return 0
  const [, sign, hours, minutes] = match
  const total = (Number(hours) * 60 + Number(minutes)) * 60_000
  return sign === "-" ? -total : total
}

/** تاريخ اليوم بتوقيت المتجر بصيغة 2026-10-30، لا بتوقيت الجهاز الذي يبني الموقع. */
export function storeToday(now = Date.now()) {
  return new Date(now + offsetMs()).toISOString().slice(0, 10)
}

/** لحظة نهاية العرض بالملّي ثانية: آخر ثانية من يومه الأخير بتوقيت المتجر. */
export function saleEndTime(endsAt: string) {
  return Date.parse(`${endsAt}T23:59:59${siteConfig.utcOffset}`)
}
