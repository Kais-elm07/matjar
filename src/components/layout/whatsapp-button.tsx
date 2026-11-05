import { MessageCircleIcon } from "lucide-react"

import { whatsappHref } from "@/lib/contact"

/**
 * The floating WhatsApp button in the screen corner on the end side, above the mobile bottom bar.
 * Shown only when a WhatsApp number is set in src/config/site.ts.
 */
export function WhatsAppButton() {
  const href = whatsappHref()
  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className="fixed end-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-30 flex size-14 items-center justify-center rounded-full bg-whatsapp text-foreground shadow-lg transition-transform outline-none hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring md:end-6 md:bottom-6"
    >
      <MessageCircleIcon className="size-7" aria-hidden />
    </a>
  )
}
