import Link from "next/link"
import {
  BanknoteIcon,
  ChevronRightIcon,
  HeadsetIcon,
  LayoutGridIcon,
  PackageOpenIcon,
  RotateCcwIcon,
  ShoppingBagIcon,
  TruckIcon,
  type LucideIcon,
} from "lucide-react"

import { EmptyState } from "@/components/store/empty-state"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const features: { icon: LucideIcon; title: string; description: string }[] = [
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

export default function HomePage() {
  return (
    <div className="page-container space-y-10 py-6 md:space-y-14 md:py-10">
      <Hero />

      <section aria-label="مميزات التسوق معنا">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {features.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold">{title}</p>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* الأقسام التالية تُملأ من قاعدة البيانات في مرحلة الكتالوج (المرحلة 2) */}
      <section aria-labelledby="categories-heading">
        <SectionHeader id="categories-heading" title="تسوّق حسب الفئة" />
        <EmptyState
          icon={LayoutGridIcon}
          title="ستظهر الفئات هنا قريباً"
          description="نجهّز التصنيفات لتصل إلى ما تريده بأقصر طريق."
        />
      </section>

      <section aria-labelledby="new-arrivals-heading">
        <SectionHeader
          id="new-arrivals-heading"
          title="وصل حديثاً"
          href="/products?sort=newest"
        />
        <EmptyState
          icon={PackageOpenIcon}
          title="ستظهر أحدث المنتجات هنا قريباً"
          description="تابعنا، فالمنتجات الجديدة في الطريق."
        />
      </section>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 md:py-16">
      <div className="relative z-10 max-w-xl space-y-4">
        <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
          الدفع عند الاستلام متاح
        </p>
        <h1 className="text-3xl leading-snug font-extrabold md:text-5xl md:leading-tight">
          تسوّق بسهولة، واستلم طلبك حتى باب بيتك
        </h1>
        <p className="text-base leading-8 text-primary-foreground/85 md:text-lg">
          تصفّح المنتجات، وأضفها إلى السلة، وأكمل طلبك في خطوات قليلة.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/products"
            className={cn(
              buttonVariants({ size: "xl" }),
              "bg-white text-primary hover:bg-white/90"
            )}
          >
            تسوّق الآن
          </Link>
          <Link
            href="/products?sale=1"
            className={cn(
              buttonVariants({ variant: "outline", size: "xl" }),
              "border-white/40 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
            )}
          >
            العروض
          </Link>
        </div>
      </div>
      <ShoppingBagIcon
        aria-hidden
        className="pointer-events-none absolute -end-10 -bottom-10 hidden size-64 text-white/10 sm:block md:size-80"
      />
    </section>
  )
}

function SectionHeader({
  id,
  title,
  href,
}: {
  id: string
  title: string
  href?: string
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <h2 id={id} className="text-xl font-bold md:text-2xl">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          عرض الكل
          <ChevronRightIcon className="size-4 rtl:rotate-180" aria-hidden />
        </Link>
      )}
    </div>
  )
}
