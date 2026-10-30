import { MessageCircleIcon } from "lucide-react"

import { whatsappHref } from "@/lib/contact"

/**
 * زر واتساب العائم في زاوية الشاشة من جهة النهاية، فوق شريط الجوال السفلي.
 * يظهر فقط عند ضبط رقم واتساب في src/config/site.ts.
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
      className="fixed end-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-30 flex size-14 items-center justify-center rounded-full bg-success text-primary-foreground shadow-lg transition-transform outline-none hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring md:end-6 md:bottom-6"
    >
      <MessageCircleIcon className="size-7" aria-hidden />
    </a>
  )
}
