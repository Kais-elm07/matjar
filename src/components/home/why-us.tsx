import {
  BadgeCheckIcon,
  BadgePercentIcon,
  HeadsetIcon,
  type LucideIcon,
} from "lucide-react"

const ITEMS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: BadgeCheckIcon,
    title: "منتجات مختارة بعناية",
    description: "نختار كل منتج ونراجع جودته قبل عرضه في المتجر",
  },
  {
    icon: BadgePercentIcon,
    title: "عروض مستمرة",
    description: "خصومات حقيقية على منتجات مختارة طوال العام",
  },
  {
    icon: HeadsetIcon,
    title: "دعم يرد بسرعة",
    description: "تواصل معنا عبر واتساب في ساعات العمل",
  },
]

/** "لماذا تختارنا؟": عنوان في المنتصف وثلاث ميزات في دوائر (DESIGN.md: feature-circle). */
export function WhyUs() {
  return (
    <section aria-labelledby="why-heading" className="text-center">
      <h2 id="why-heading" className="text-2xl font-bold md:text-3xl">
        لماذا تختارنا؟
      </h2>
      <ul className="mx-auto mt-8 grid max-w-4xl gap-8 sm:grid-cols-3">
        {ITEMS.map(({ icon: Icon, title, description }) => (
          <li key={title} className="flex flex-col items-center gap-3">
            <span className="flex size-22 items-center justify-center rounded-full border bg-muted text-primary">
              <Icon className="size-9" aria-hidden />
            </span>
            <p className="font-bold">{title}</p>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
