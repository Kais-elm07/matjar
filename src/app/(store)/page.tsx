import type { Metadata } from "next"

import { BestSellers } from "@/modules/home/components/best-sellers"
import { CategoryRail } from "@/modules/home/components/category-rail"
import { ContactSection } from "@/modules/home/components/contact-section"
import { DealsRail } from "@/modules/home/components/deals-rail"
import { HeroSlider } from "@/modules/home/components/hero-slider"
import { NewArrivals } from "@/modules/home/components/new-arrivals"
import { PromoGrid } from "@/modules/home/components/promo-grid"
import { SpotlightGrid } from "@/modules/home/components/spotlight-grid"
import { Testimonials } from "@/modules/home/components/testimonials"
import { TrendingTabs } from "@/modules/home/components/trending-tabs"
import { TrustStrip } from "@/modules/home/components/trust-strip"
import { WideBanner } from "@/modules/home/components/wide-banner"
import { JsonLd } from "@/components/shared/json-ld"
import { siteConfig } from "@/config/site"
import { getCategories } from "@/modules/catalog/queries"
import { getHomeContent, getHomeSections } from "@/modules/home/sections"
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
export default async function HomePage() {
  const [sections, content, categories] = await Promise.all([
    getHomeSections(),
    getHomeContent(),
    getCategories(),
  ])
  const { newArrivals, bestSellers, deals, trending, maxDiscount } = sections
  const { heroSlides, promos, spotlights, wideBanner, testimonials } = content

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
        <PromoGrid promos={promos} maxDiscount={maxDiscount} />

        <BestSellers products={bestSellers} />
        <SpotlightGrid spotlights={spotlights} />

        <NewArrivals products={newArrivals} />
        <TrendingTabs groups={trending} />
        <DealsRail products={deals} />
        {wideBanner && <WideBanner banner={wideBanner} />}
        <CategoryRail categories={categories} />
        <Testimonials testimonials={testimonials} />
        <ContactSection />
      </div>

      {websiteJsonLd().map((data) => (
        <JsonLd key={data["@type"]} data={data} />
      ))}
    </>
  )
}
