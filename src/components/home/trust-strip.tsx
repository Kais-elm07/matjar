import {
  BadgeCheckIcon,
  BadgePercentIcon,
  BanknoteIcon,
  HeadsetIcon,
  RotateCcwIcon,
  TruckIcon,
  type LucideIcon,
} from "lucide-react"

const ITEMS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: TruckIcon,
    title: "شحن سريع",
    description: "نوصل طلبك حتى باب بيتك",
  },
  {
    icon: BanknoteIcon,
    title: "الدفع عند الاستلام",
    description: "ادفع عند وصول طلبك",
  },
  {
    icon: RotateCcwIcon,
    title: "إرجاع سهل",
    description: "استبدال أو إرجاع بخطوات بسيطة",
  },
  {
    icon: HeadsetIcon,
    title: "دعم عبر واتساب",
    description: "نجيب عن استفساراتك بسرعة",
  },
  {
    icon: BadgeCheckIcon,
    title: "منتجات مختارة بعناية",
    description: "نراجع جودة كل منتج قبل عرضه",
  },
  {
    icon: BadgePercentIcon,
    title: "عروض مستمرة",
    description: "خصومات حقيقية طوال العام",
  },
]

/**
 * The full-width trust strip under the hero: the six reasons to shop here, and the only list of
 * them on the site, so no other section repeats them (DESIGN.md: trust-strip).
 */
export function TrustStrip() {
  return (
    <section aria-label="لماذا تتسوق معنا" className="border-y bg-card">
      <ul className="page-container grid grid-cols-2 gap-x-6 gap-y-4 py-5 md:grid-cols-3 md:py-6 xl:grid-cols-6">
        {ITEMS.map(({ icon: Icon, title, description }) => (
          <li key={title} className="flex items-start gap-3">
            <Icon className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden />
            <div>
              <p className="text-sm font-bold md:text-base">{title}</p>
              {/* Balanced lines, so no word is left alone on the second line */}
              <p className="text-xs text-balance text-muted-foreground md:text-sm">
                {description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
