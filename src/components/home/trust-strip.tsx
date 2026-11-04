import {
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
]

/** شريط الثقة بعرض الشاشة تحت الواجهة: حقائق الشراء الأربع (DESIGN.md: trust-strip). */
export function TrustStrip() {
  return (
    <section aria-label="لماذا تتسوق معنا" className="border-y bg-card">
      <ul className="page-container grid grid-cols-2 gap-x-6 gap-y-4 py-5 md:grid-cols-4 md:py-6">
        {ITEMS.map(({ icon: Icon, title, description }) => (
          <li key={title} className="flex items-start gap-3">
            <Icon className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden />
            <div>
              <p className="text-sm font-bold md:text-base">{title}</p>
              <p className="text-xs text-muted-foreground md:text-sm">
                {description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
