import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ContactCards } from "@/components/content/contact-cards"
import { FaqList, parseFaq, plainAnswer } from "@/components/content/faq-list"
import { RichText } from "@/components/content/rich-text"
import { ShippingTable } from "@/components/content/shipping-table"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { JsonLd } from "@/components/shared/json-ld"
import { getContentPage, getContentPages } from "@/lib/content/pages"
import { breadcrumbJsonLd, openGraph } from "@/lib/seo"
import { cn } from "@/lib/utils"

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
    alternates: { canonical: `/pages/${page.slug}/` },
    openGraph: openGraph({
      title: page.title,
      description: page.description,
      path: `/pages/${page.slug}/`,
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
        <nav
          aria-label="صفحات المساعدة"
          className="hidden rounded-xl border bg-card p-2 lg:sticky lg:top-32 lg:block"
        >
          <ul>
            {getContentPages().map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/pages/${item.slug}`}
                  aria-current={item.slug === page.slug ? "page" : undefined}
                  className={cn(
                    "flex h-11 items-center rounded-lg px-3 text-sm outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
                    item.slug === page.slug &&
                      "bg-primary/10 font-bold text-primary hover:bg-primary/15"
                  )}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <article className="max-w-3xl min-w-0 space-y-6">
          <h1 className="text-2xl font-bold md:text-3xl">{page.title}</h1>
          {page.layout === "contact" && <ContactCards />}
          {faq ? <FaqList groups={faq} /> : <RichText text={page.body} />}
          {page.layout === "shipping" && <ShippingTable />}
        </article>
      </div>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: page.title, path: `/pages/${page.slug}` },
        ])}
      />
      {faq && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.flatMap((group) =>
              group.items.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: plainAnswer(item.answer),
                },
              }))
            ),
          }}
        />
      )}
    </div>
  )
}
