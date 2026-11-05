import type { Metadata } from "next"

import { CategoryRail } from "@/components/home/category-rail"
import { ContactSection } from "@/components/home/contact-section"
import { DealsRail } from "@/components/home/deals-rail"
import { HeroSlider } from "@/components/home/hero-slider"
import { NewArrivals } from "@/components/home/new-arrivals"
import { PromoGrid } from "@/components/home/promo-grid"
import { SpotlightCard } from "@/components/home/spotlight-card"
import { Testimonials } from "@/components/home/testimonials"
import { TrendingTabs } from "@/components/home/trending-tabs"
import { TrustStrip } from "@/components/home/trust-strip"
import { WhyUs } from "@/components/home/why-us"
import { WideBanner } from "@/components/home/wide-banner"
import { ProductRail } from "@/components/product/product-rail"
import { JsonLd } from "@/components/store/json-ld"
import { SectionHeading } from "@/components/store/section-heading"
import { siteConfig } from "@/config/site"
import { getCategories } from "@/lib/catalog/catalog"
import { getHomeContent, getHomeSections } from "@/lib/catalog/home"
import { openGraph, websiteJsonLd } from "@/lib/seo"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: openGraph({
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    path: "/",
  }),
}

/**
 * The home page in the order of DESIGN.md: the hero and the trust strip at full screen width,
 * then the sections inside the page container. Each section is its own component in src/components/home.
 */
export default function HomePage() {
  const { newArrivals, bestSellers, deals, trending, maxDiscount } =
    getHomeSections()
  const { heroSlides, promos, spotlights, wideBanner, testimonials } =
    getHomeContent()

  return (
    <>
      <h1 className="sr-only">
        {siteConfig.name}: تسوّق أونلاين بسهولة والدفع عند الاستلام
      </h1>

      <HeroSlider slides={heroSlides} />
      <TrustStrip />

      {/* Every section here is rendered only when it comes near the screen (section-later in
          globals.css), so a phone shows the hero sooner; the sections have no style of their own */}
      <div className="page-container flex flex-col gap-14 py-10 *:section-later md:gap-20 md:py-14">
        <WhyUs />
        <PromoGrid promos={promos} maxDiscount={maxDiscount} />

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

        <NewArrivals products={newArrivals} />
        <TrendingTabs groups={trending} />
        <DealsRail products={deals} />
        {wideBanner && <WideBanner banner={wideBanner} />}
        <CategoryRail categories={getCategories()} />
        <Testimonials testimonials={testimonials} />
        <ContactSection />

        {websiteJsonLd().map((data) => (
          <JsonLd key={data["@type"]} data={data} />
        ))}
      </div>
    </>
  )
}
