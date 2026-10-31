import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  BanknoteIcon,
  HeadsetIcon,
  RotateCcwIcon,
  StarIcon,
  TruckIcon,
  type LucideIcon,
} from "lucide-react"

import { PromoCard, SpotlightCard, WideBanner } from "@/components/home/banners"
import { DealItem } from "@/components/home/deal-item"
import { HeroSlider } from "@/components/home/hero-slider"
import { TrendingTabs } from "@/components/home/trending-tabs"
import { ProductCard } from "@/components/product/product-card"
import { ProductRail, RAIL_ITEM } from "@/components/product/product-grid"
import { Carousel } from "@/components/store/carousel"
import { JsonLd } from "@/components/store/json-ld"
import { SectionHeading } from "@/components/store/section-heading"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { PRODUCT_FORMS, pluralize } from "@/lib/arabic-plural"
import {
  getCategories,
  getHomeContent,
  getHomeSections,
} from "@/lib/catalog/catalog"
import { openGraph, websiteJsonLd } from "@/lib/seo"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: openGraph({
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    path: "/",
  }),
}

const trustItems: { icon: LucideIcon; title: string; description: string }[] = [
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

/** ألوان باستيل تتناوب على مربعات الفئات (DESIGN.md: tile-yellow إلى tile-orange). */
const TILE_COLORS = [
  "bg-tile-yellow",
  "bg-tile-green",
  "bg-tile-pink",
  "bg-tile-blue",
  "bg-tile-purple",
  "bg-tile-orange",
]

export default function HomePage() {
  const { newArrivals, bestSellers, deals, trending } = getHomeSections()
  const { heroSlides, promos, spotlights, wideBanner, testimonials } =
    getHomeContent()
  const categories = getCategories()

  return (
    <div className="page-container space-y-12 py-5 md:space-y-16 md:py-8">
      <h1 className="sr-only">
        {siteConfig.name}: تسوّق أونلاين بسهولة والدفع عند الاستلام
      </h1>

      <div className="space-y-6">
        <HeroSlider slides={heroSlides} />

        <section aria-label="لماذا تتسوق معنا">
          <ul className="-mx-4 flex snap-x [scrollbar-width:none] gap-6 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-4 md:px-0 [&::-webkit-scrollbar]:hidden">
            {trustItems.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="flex w-[70%] shrink-0 snap-start items-center gap-3 sm:w-[45%] md:w-auto"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-tile-yellow text-primary">
                  <Icon className="size-6" aria-hidden />
                </span>
                <div>
                  <p className="font-bold">{title}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {promos.length > 0 && (
        <section aria-label="عروض مختارة">
          <ul className="grid gap-4 md:grid-cols-3">
            {promos.map((promo) => (
              <li key={promo.href}>
                <PromoCard banner={promo} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="categories-heading">
        <Carousel
          label="الفئات"
          header={
            <SectionHeading
              id="categories-heading"
              title="تسوّق حسب الفئة"
              href="/products"
              linkLabel="كل المنتجات"
            />
          }
        >
          {categories.map((category, index) => (
            <li
              key={category.slug}
              className="w-[30%] shrink-0 snap-start sm:w-[22%] md:w-[17%] lg:w-[13.2%]"
            >
              <Link
                href={`/category/${category.slug}`}
                className="group block rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring"
              >
                <span
                  className={cn(
                    "relative block aspect-square overflow-hidden rounded-lg p-3",
                    TILE_COLORS[index % TILE_COLORS.length]
                  )}
                >
                  {category.image && (
                    <span className="relative block size-full overflow-hidden rounded-md">
                      <Image
                        src={category.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 160px, (min-width: 640px) 22vw, 30vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </span>
                  )}
                </span>
                <span className="mt-2 block text-center text-sm font-bold">
                  {category.name}
                </span>
                <span className="block text-center text-xs text-muted-foreground">
                  {pluralize(category.productCount, PRODUCT_FORMS)}
                </span>
              </Link>
            </li>
          ))}
        </Carousel>
      </section>

      <section aria-labelledby="best-sellers-heading">
        <ProductRail
          label="الأكثر مبيعاً"
          header={
            <SectionHeading
              id="best-sellers-heading"
              title="الأكثر مبيعاً"
              href="/products"
            />
          }
          products={bestSellers}
        />
      </section>

      {spotlights.length > 0 && (
        <section aria-label="أقسام مميزة">
          <ul className="grid gap-4 md:grid-cols-2">
            {spotlights.map((spotlight) => (
              <li key={spotlight.href}>
                <SpotlightCard banner={spotlight} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <TrendingTabs groups={trending} />

      <section
        aria-labelledby="new-arrivals-heading"
        className="grid grid-cols-1 gap-4 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start"
      >
        <div className="flex flex-col justify-between gap-4 rounded-lg bg-highlight p-6 text-highlight-foreground lg:min-h-full">
          <div>
            <p className="text-sm font-bold">وصل حديثاً</p>
            <h2
              id="new-arrivals-heading"
              className="mt-1 text-2xl leading-snug font-bold"
            >
              أحدث المنتجات في متجرنا
            </h2>
            <p className="mt-2 text-sm text-highlight-foreground/80">
              تشكيلة جديدة تصل باستمرار، فلا تفوّتها.
            </p>
          </div>
          <Link
            href="/products?sort=newest"
            className={cn(buttonVariants({ size: "xl" }), "self-start")}
          >
            شاهد الجديد
          </Link>
        </div>
        <ProductRail label="وصل حديثاً" products={newArrivals} />
      </section>

      {deals.length > 0 && (
        <section aria-labelledby="deals-heading">
          <Carousel
            label="عروض لفترة محدودة"
            header={
              <SectionHeading
                id="deals-heading"
                title="عروض لفترة محدودة"
                href="/products?sale=1"
                linkLabel="كل العروض"
              />
            }
          >
            {deals.map((product) => (
              <DealItem
                key={product.slug}
                endsAt={product.saleEndsAt ?? ""}
                className={RAIL_ITEM}
              >
                <ProductCard product={product} />
              </DealItem>
            ))}
          </Carousel>
        </section>
      )}

      {wideBanner && <WideBanner banner={wideBanner} />}

      {testimonials.length > 0 && (
        <section aria-labelledby="testimonials-heading">
          <h2
            id="testimonials-heading"
            className="mb-5 text-xl font-bold md:text-2xl"
          >
            آراء عملائنا
          </h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <li
                key={`${testimonial.name}-${testimonial.title}`}
                className="space-y-3 rounded-lg bg-muted p-6"
              >
                <p
                  className="flex gap-0.5 text-highlight"
                  aria-label={`التقييم ${testimonial.rating} من 5`}
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <StarIcon
                      key={index}
                      aria-hidden
                      className={cn(
                        "size-4",
                        index < testimonial.rating
                          ? "fill-current"
                          : "text-border"
                      )}
                    />
                  ))}
                </p>
                <p className="font-bold">{testimonial.title}</p>
                <p className="text-sm leading-7 text-muted-foreground">
                  {testimonial.text}
                </p>
                <p className="text-sm font-bold">
                  {testimonial.name}
                  {testimonial.role && (
                    <span className="font-normal text-muted-foreground">
                      {" "}
                      · {testimonial.role}
                    </span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {websiteJsonLd().map((data) => (
        <JsonLd key={data["@type"]} data={data} />
      ))}
    </div>
  )
}
