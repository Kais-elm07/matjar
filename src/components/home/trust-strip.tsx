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
 * The trust cards under the hero: the six reasons to shop here, each in a card with its icon in a soft
 * blue circle, pulled up into the hero's bottom edge from tablets up (DESIGN.md: trust-card). It is the
 * only list of these reasons on the site, so no other section repeats them.
 */
export function TrustStrip() {
  return (
    <section
      aria-label="لماذا تتسوق معنا"
      className="relative page-container md:-mt-10"
    >
      <ul className="grid grid-cols-2 gap-2.5 pt-4 md:grid-cols-3 md:gap-3 md:pt-0 xl:grid-cols-6">
        {ITEMS.map(({ icon: Icon, title, description }) => (
          <li
            key={title}
            className="flex items-start gap-2.5 rounded-2xl border bg-card p-3 md:gap-3 md:p-3.5"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary md:size-10">
              <Icon className="size-[18px] md:size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold">{title}</p>
              {/* Balanced lines, so no word is left alone on the second line */}
              <p className="text-xs leading-5 text-balance text-muted-foreground">
                {description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
