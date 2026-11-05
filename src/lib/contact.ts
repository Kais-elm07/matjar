import { siteConfig } from "@/config/site"

/** Strips spaces and symbols from a number for links: "+966 50 123 4567" becomes "+966501234567". */
function dialable(value: string) {
  return value.replace(/[^\d+]/g, "")
}

/** Phone call link, or null if the number is not set. */
export function phoneHref() {
  const { phone } = siteConfig.contact
  return phone ? `tel:${dialable(phone)}` : null
}

/** WhatsApp chat link with a ready-made message, or null if the number is not set. */
export function whatsappHref(message = "مرحباً، لدي استفسار عن متجركم") {
  const { whatsapp } = siteConfig.contact
  if (!whatsapp) return null
  const number = dialable(whatsapp).replace(/^\+/, "")
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

/** Link to the address on Google Maps, or null if the address is not set. */
export function mapHref() {
  const { address } = siteConfig.contact
  return address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : null
}
