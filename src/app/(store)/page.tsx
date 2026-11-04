import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  BadgeCheckIcon,
  BadgePercentIcon,
  BanknoteIcon,
  HeadsetIcon,
  RotateCcwIcon,
  StarIcon,
  TruckIcon,
  type LucideIcon,
} from "lucide-react"

import { ContactCards } from "@/components/content/contact-cards"
import {
  DiscountCard,
  PromoTile,
  SpotlightCard,
  WideBanner,
} from "@/components/home/banners"
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
import { discountPercent } from "@/lib/catalog/money"
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

type Feature = { icon: LucideIcon; title: string; description: string }

/** شريط الثقة تحت الواجهة: حقائق الشراء الأربع (DESIGN.md: trust-strip) */
const trustItems: Feature[] = [
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

/** "لماذا تختارنا؟": ثلاث ميزات في دوائر (DESIGN.md: feature-circle) */
const whyItems: Feature[] = [
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

export default function HomePage() {
  const { newArrivals, bestSellers, deals, trending } = getHomeSections()
  const { heroSlides, promos, spotlights, wideBanner, testimonials } =
    getHomeContent()
  const categories = getCategories()
  // أكبر خصم حقيقي بين منتجات العروض، لبطاقة الخصم
  const maxDiscount = Math.max(
    0,
    ...deals.map(
      (product) => discountPercent(product.price, product.compareAtPrice) ?? 0
    )
  )
  const arrivalsImage = newArrivals[0]?.image ?? null

  return (
    <>
      <h1 className="sr-only">
        {siteConfig.name}: تسوّق أونلاين بسهولة والدفع عند الاستلام
      </h1>

      {/* الواجهة وشريط الثقة بعرض الشاشة، خارج حاوية الصفحة */}
      <HeroSlider slides={heroSlides} />
      <section aria-label="لماذا تتسوق معنا" className="border-y bg-card">
        <ul className="page-container grid grid-cols-2 gap-x-6 gap-y-4 py-5 md:grid-cols-4 md:py-6">
          {trustItems.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex items-start gap-3">
              <Icon
                className="mt-0.5 size-6 shrink-0 text-primary"
                aria-hidden
              />
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

      <div className="page-container space-y-14 py-10 md:space-y-20 md:py-14">
        <section aria-labelledby="why-heading" className="text-center">
          <h2 id="why-heading" className="text-2xl font-bold md:text-3xl">
            لماذا تختارنا؟
          </h2>
          <ul className="mx-auto mt-8 grid max-w-4xl gap-8 sm:grid-cols-3">
            {whyItems.map(({ icon: Icon, title, description }) => (
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

        {promos.length > 0 && (
          <section
            aria-labelledby="discount-heading"
            className={cn(
              "grid grid-cols-2 gap-3 md:gap-4",
              promos.length >= 3
                ? "md:grid-cols-[1fr_1fr_1.35fr] md:grid-rows-2"
                : "md:grid-cols-3"
            )}
          >
            {promos.length >= 3 ? (
              // مربعان فوق بعضهما، ومربع طويل بجانبهما، ثم بطاقة الخصم
              <>
                <PromoTile banner={promos[0]} className="aspect-[4/3]" />
                <PromoTile
                  banner={promos[2]}
                  className="row-span-2 md:col-start-2"
                />
                <PromoTile
                  banner={promos[1]}
                  className="aspect-[4/3] md:col-start-1 md:row-start-2"
                />
                <DiscountCard
                  maxDiscount={maxDiscount}
                  className="col-span-2 md:col-span-1 md:col-start-3 md:row-span-2 md:row-start-1"
                />
              </>
            ) : (
              <>
                {promos.map((promo) => (
                  <PromoTile
                    key={promo.href}
                    banner={promo}
                    className="aspect-[4/3]"
                  />
                ))}
                <DiscountCard
                  maxDiscount={maxDiscount}
                  className="col-span-2 md:col-span-1"
                />
              </>
            )}
          </section>
        )}

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

        <section aria-labelledby="new-arrivals-heading" className="space-y-5">
          <div className="relative overflow-hidden rounded-xl border bg-muted">
            {arrivalsImage && (
              <Image
                src={arrivalsImage.src}
                alt=""
                fill
                sizes="(min-width: 1280px) 1232px, 100vw"
                className="object-cover"
              />
            )}
            <div aria-hidden className="absolute inset-0 bg-background/40" />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background/95 via-background/50 to-transparent"
            />
            <div className="relative flex min-h-56 flex-col items-center justify-center gap-3 px-6 py-10 text-center md:min-h-80">
              <h2
                id="new-arrivals-heading"
                className="text-4xl font-bold md:text-6xl"
              >
                وصل حديثاً
              </h2>
              <p className="max-w-md text-base text-foreground/85 md:text-lg">
                تشكيلة جديدة تصل باستمرار، فلا تفوّتها.
              </p>
            </div>
          </div>
          <ProductRail label="وصل حديثاً" products={newArrivals} />
          <div className="flex justify-center">
            <Link
              href="/products?sort=newest"
              className={buttonVariants({ variant: "cta", size: "xl" })}
            >
              استكشف الجديد
            </Link>
          </div>
        </section>

        <TrendingTabs groups={trending} />

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
            {categories.map((category) => (
              <li
                key={category.slug}
                className="w-[44%] shrink-0 snap-start sm:w-[31%] md:w-[23.5%] lg:w-[18.8%]"
              >
                <Link
                  href={`/category/${category.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-xl border bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring"
                >
                  {category.image && (
                    <Image
                      src={category.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 240px, (min-width: 640px) 31vw, 44vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  )}
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/35 to-transparent"
                  />
                  <span className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                    <span className="block text-base font-bold">
                      {category.name}
                    </span>
                    <span className="block text-xs text-foreground/75">
                      {pluralize(category.productCount, PRODUCT_FORMS)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </Carousel>
        </section>

        {testimonials.length > 0 && (
          <section aria-labelledby="testimonials-heading">
            <h2
              id="testimonials-heading"
              className="mb-6 text-2xl font-bold md:text-3xl"
            >
              آراء عملائنا
            </h2>
            <ul className="grid gap-4 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <li
                  key={`${testimonial.name}-${testimonial.title}`}
                  className="space-y-3 rounded-xl border bg-card p-6"
                >
                  <p
                    className="flex gap-0.5 text-primary"
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

        <section aria-labelledby="contact-heading" className="text-center">
          <h2 id="contact-heading" className="text-2xl font-bold md:text-3xl">
            تواصل معنا
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            نجيب عن استفساراتك قبل الطلب وبعده، عبر الوسيلة التي تناسبك.
          </p>
          <ContactCards className="mt-8 text-start lg:grid-cols-4" />
        </section>

        {websiteJsonLd().map((data) => (
          <JsonLd key={data["@type"]} data={data} />
        ))}
      </div>
    </>
  )
}
