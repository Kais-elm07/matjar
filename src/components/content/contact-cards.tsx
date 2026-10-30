import {
  ClockIcon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
  type LucideIcon,
} from "lucide-react"

import { siteConfig } from "@/config/site"
import { mapHref, phoneHref, whatsappHref } from "@/lib/contact"

type ContactItem = {
  icon: LucideIcon
  label: string
  value: string
  href?: string | null
  /** للبريد والأرقام: تُعرض من اليسار لليمين */
  ltr?: boolean
  external?: boolean
}

/** بطاقات التواصل في صفحة "تواصل معنا". أي حقل فارغ في الإعدادات لا تظهر بطاقته. */
export function ContactCards() {
  const { email, phone, whatsapp, hours, address } = siteConfig.contact
  const items: ContactItem[] = []
  if (whatsapp) {
    items.push({
      icon: MessageCircleIcon,
      label: "واتساب",
      value: "ابدأ محادثة الآن",
      href: whatsappHref(),
      external: true,
    })
  }
  if (phone) {
    items.push({
      icon: PhoneIcon,
      label: "الهاتف",
      value: phone,
      href: phoneHref(),
      ltr: true,
    })
  }
  if (email) {
    items.push({
      icon: MailIcon,
      label: "البريد الإلكتروني",
      value: email,
      href: `mailto:${email}`,
      ltr: true,
    })
  }
  if (hours) items.push({ icon: ClockIcon, label: "ساعات العمل", value: hours })
  if (address) {
    items.push({
      icon: MapPinIcon,
      label: "العنوان",
      value: address,
      href: mapHref(),
      external: true,
    })
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map(({ icon: Icon, label, value, href, ltr, external }) => {
        const content = (
          <>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-tile-yellow text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-sm text-muted-foreground">
                {label}
              </span>
              <span className="block font-bold break-words">
                {ltr ? <span dir="ltr">{value}</span> : value}
              </span>
            </span>
          </>
        )
        const card =
          "flex h-full items-center gap-3 rounded-lg border p-4 outline-none"
        return (
          <li key={label}>
            {href ? (
              <a
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className={`${card} transition-colors hover:border-primary focus-visible:ring-3 focus-visible:ring-ring/50`}
              >
                {content}
              </a>
            ) : (
              <div className={card}>{content}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
