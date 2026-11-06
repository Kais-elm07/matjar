import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ContactCards } from "@/components/content/contact-cards"
import { FaqList } from "@/components/content/faq-list"
import { HelpPagesNav } from "@/components/content/help-pages-nav"
import { RichText } from "@/components/content/rich-text"
import { ShippingTable } from "@/components/content/shipping-table"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { JsonLd } from "@/components/shared/json-ld"
import { getContentPage, getContentPages } from "@/lib/content/pages"
import { parseFaq } from "@/lib/content/text-format"
import { contentPagePath } from "@/lib/routes"
import { breadcrumbJsonLd, faqJsonLd, openGraph } from "@/lib/seo"

// Every page is prepared at build time from the src/content/pages files, and any other URL shows the 404 page
export const dynamicParams = false

export function generateStaticParams() {
  return getContentPages().map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/pages/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const page = getContentPage(slug)
  if (!page) return {}
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: contentPagePath(page.slug) },
    openGraph: openGraph({
      title: page.title,
      description: page.description,
      path: contentPagePath(page.slug),
    }),
  }
}

/** A static page: about us, contact us, shipping, returns, privacy, terms, FAQ. */
export default async function ContentPageRoute({
  params,
}: PageProps<"/pages/[slug]">) {
  const { slug } = await params
  const page = getContentPage(slug)
  if (!page) notFound()

  const faq = page.layout === "faq" ? parseFaq(page.body) : null

  return (
    <div className="page-container py-5 md:py-8">
      <Breadcrumbs items={[{ name: page.title }]} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
        <HelpPagesNav currentSlug={page.slug} />

        <article className="max-w-3xl min-w-0 space-y-6">
          <h1 className="text-2xl font-bold md:text-3xl">{page.title}</h1>
          {page.layout === "contact" && <ContactCards />}
          {faq ? <FaqList groups={faq} /> : <RichText text={page.body} />}
          {page.layout === "shipping" && <ShippingTable />}
        </article>
      </div>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: page.title, href: contentPagePath(page.slug) },
        ])}
      />
      {faq && <JsonLd data={faqJsonLd(faq)} />}
    </div>
  )
}
