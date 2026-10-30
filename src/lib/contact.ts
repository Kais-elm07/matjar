import { siteConfig } from "@/config/site"

/** يحذف المسافات والرموز من الرقم ليصلح للروابط، فيصبح "+966 50 123 4567" هكذا: "+966501234567". */
function dialable(value: string) {
  return value.replace(/[^\d+]/g, "")
}

/** رابط الاتصال بالهاتف، أو null إن لم يُضبط الرقم. */
export function phoneHref() {
  const { phone } = siteConfig.contact
  return phone ? `tel:${dialable(phone)}` : null
}

/** رابط محادثة واتساب برسالة جاهزة، أو null إن لم يُضبط الرقم. */
export function whatsappHref(message = "مرحباً، لدي استفسار عن متجركم") {
  const { whatsapp } = siteConfig.contact
  if (!whatsapp) return null
  const number = dialable(whatsapp).replace(/^\+/, "")
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

/** رابط العنوان في خرائط Google، أو null إن لم يُضبط العنوان. */
export function mapHref() {
  const { address } = siteConfig.contact
  return address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : null
}
