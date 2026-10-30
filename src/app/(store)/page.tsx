import Image from "next/image"
import Link from "next/link"
import {
  BanknoteIcon,
  ChevronRightIcon,
  HeadsetIcon,
  RotateCcwIcon,
  ShoppingBagIcon,
  TruckIcon,
  type LucideIcon,
} from "lucide-react"

import { ProductRail } from "@/components/product/product-grid"
import { JsonLd } from "@/components/store/json-ld"
import { buttonVariants } from "@/components/ui/button"
import { PRODUCT_FORMS, pluralize } from "@/lib/arabic-plural"
import { getHomeSections, getRootCategories } from "@/lib/catalog/catalog"
import type { ProductCard } from "@/lib/catalog/types"
import { websiteJsonLd } from "@/lib/seo"
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
  const categories = getRootCategories()
  const { newArrivals, bestSellers, onSale } = getHomeSections()

  return (
    <div className="page-container space-y-12 py-6 md:space-y-16 md:py-10">
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

      <section aria-labelledby="categories-heading">
        <SectionHeader
          id="categories-heading"
          title="تسوّق حسب الفئة"
          href="/products"
          linkLabel="كل المنتجات"
        />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
          {categories.map((category, index) => {
            // الفئة الأخيرة بعرض كامل على الجوال عندما يكون عدد الفئات فردياً
            const spansRow =
              index === categories.length - 1 && categories.length % 2 === 1
            return (
              <li
                key={category.slug}
                className={cn(spansRow && "col-span-2 sm:col-span-1")}
              >
                <Link
                  href={`/category/${category.slug}`}
                  className={cn(
                    "group relative flex overflow-hidden rounded-xl bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:aspect-square",
                    // نفس ارتفاع البقية: ضعف العرض يعني نسبة 8 إلى 3
                    spansRow ? "aspect-[8/3]" : "aspect-[4/3]"
                  )}
                >
                  {category.image && (
                    <Image
                      src={category.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10 text-white">
                    <span className="block font-bold">{category.name}</span>
                    <span className="text-xs text-white/85">
                      {pluralize(category.productCount, PRODUCT_FORMS)}
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <ProductSection
        id="new-arrivals"
        title="وصل حديثاً"
        href="/products?sort=newest"
        products={newArrivals}
      />
      <ProductSection
        id="best-sellers"
        title="الأكثر مبيعاً"
        href="/products"
        products={bestSellers}
      />
      {onSale.length > 0 && (
        <ProductSection
          id="offers"
          title="العروض"
          href="/products?sale=1"
          products={onSale}
        />
      )}

      {websiteJsonLd().map((data) => (
        <JsonLd key={data["@type"]} data={data} />
      ))}
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 md:py-16">
      <div className="relative z-10 max-w-xl space-y-4">
        <p className="inline-flex rounded-md bg-highlight px-3 py-1 text-sm font-medium text-highlight-foreground">
          الدفع عند الاستلام متاح
        </p>
        <h1 className="text-3xl leading-snug font-bold md:text-5xl md:leading-tight">
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
              "bg-background text-primary hover:bg-background/90"
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

function ProductSection({
  id,
  title,
  href,
  products,
}: {
  id: string
  title: string
  href: string
  products: ProductCard[]
}) {
  return (
    <section aria-labelledby={`${id}-heading`}>
      <SectionHeader id={`${id}-heading`} title={title} href={href} />
      <ProductRail products={products} />
    </section>
  )
}

function SectionHeader({
  id,
  title,
  href,
  linkLabel = "عرض الكل",
}: {
  id: string
  title: string
  href?: string
  linkLabel?: string
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
          {linkLabel}
          <ChevronRightIcon className="size-4 rtl:rotate-180" aria-hidden />
        </Link>
      )}
    </div>
  )
}
