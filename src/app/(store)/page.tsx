import type { Metadata } from "next"

import { BestSellers } from "@/components/home/best-sellers"
import { CategoryRail } from "@/components/home/category-rail"
import { ContactSection } from "@/components/home/contact-section"
import { DealsRail } from "@/components/home/deals-rail"
import { HeroSlider } from "@/components/home/hero-slider"
import { NewArrivals } from "@/components/home/new-arrivals"
import { PromoGrid } from "@/components/home/promo-grid"
import { SpotlightGrid } from "@/components/home/spotlight-grid"
import { Testimonials } from "@/components/home/testimonials"
import { TrendingTabs } from "@/components/home/trending-tabs"
import { TrustStrip } from "@/components/home/trust-strip"
import { WideBanner } from "@/components/home/wide-banner"
import { JsonLd } from "@/components/shared/json-ld"
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
