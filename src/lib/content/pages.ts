import "server-only"

import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"

import { z } from "zod"

import { siteConfig } from "@/config/site"
import { formatPrice } from "@/lib/catalog/money"
import { getCheckoutConfig } from "@/lib/checkout/config"

/**
 * Static pages from text files in src/content/pages: each .md file is a page,
 * and the file name is its URL (about.md → /pages/about). Read at build time only.
 */

const DIRECTORY = path.join(process.cwd(), "src", "content", "pages")

const frontMatterSchema = z.object({
  title: z.string().trim().min(1, "العنوان title مطلوب"),
  description: z.string().trim().min(1, "الوصف description مطلوب"),
  /** A special layout for some pages: contact cards, a shipping table, or collapsible questions */
  layout: z.enum(["default", "contact", "shipping", "faq"]).default("default"),
  /** The page's position in the side list of pages */
  order: z.coerce.number().int().default(100),
})

export type ContentPage = z.infer<typeof frontMatterSchema> & {
  slug: string
  body: string
}

/** The analytics sentence on the privacy page, based on what is enabled in src/config/site.ts. */
function analyticsSentence() {
  const { analytics } = siteConfig
  if (!analytics) return "لا نستخدم أدوات تحليل ترصد تصفحك."
  const name = { plausible: "Plausible", umami: "Umami" }[analytics.provider]
  return `لا نستخدم أدوات تحليل ترصد تصفحك: نكتفي بعدّ الزيارات بأداة ${name}، دون ملفات تعريف ارتباط ودون حفظ ما يحدد هويتك.`
}

/** Replaces {store}, {email}, {phone}, {freeShipping} and {analytics} with their current settings values. */
function fillPlaceholders(text: string) {
  const values: Record<string, string> = {
    store: siteConfig.name,
    email: siteConfig.contact.email,
    phone: siteConfig.contact.phone,
    freeShipping: formatPrice(getCheckoutConfig().freeShippingFrom),
    analytics: analyticsSentence(),
  }
  return text.replace(
    /\{(\w+)\}/g,
    (match, key: string) => values[key] ?? match
  )
}

function readPage(fileName: string): ContentPage {
  const file = `src/content/pages/${fileName}`
  const raw = readFileSync(path.join(DIRECTORY, fileName), "utf8").replace(
    /\r\n/g,
    "\n"
  )
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) {
    throw new Error(
      `${file}: يجب أن يبدأ الملف بسطر --- ثم title وdescription ثم سطر --- آخر.`
    )
  }
  const meta = Object.fromEntries(
    match[1]
      .split("\n")
      .filter((line) => line.includes(":"))
      .map((line) => {
        const index = line.indexOf(":")
        return [line.slice(0, index).trim(), line.slice(index + 1).trim()]
      })
  )
  const parsed = frontMatterSchema.safeParse(meta)
  if (!parsed.success) {
    throw new Error(
      `${file}: ${parsed.error.issues.map((issue) => issue.message).join("، ")}`
    )
  }
  return {
    ...parsed.data,
    title: fillPlaceholders(parsed.data.title),
    description: fillPlaceholders(parsed.data.description),
    slug: fileName.replace(/\.md$/, ""),
    body: fillPlaceholders(match[2].trim()),
  }
}

function loadPages() {
  const pages = readdirSync(DIRECTORY)
    .filter((fileName) => fileName.endsWith(".md"))
    .map(readPage)
    .sort((a, b) => a.order - b.order)

  // Every /pages/... link in the settings needs a matching file, so a visitor never reaches a page that does not exist
  const slugs = new Set(pages.map((page) => page.slug))
  const links = [
    ...siteConfig.helpNav,
    ...siteConfig.footerNav.flatMap((group) => group.links),
  ]
  for (const link of links) {
    const slug = link.href.match(/^\/pages\/([\w-]+)/)?.[1]
    if (slug && !slugs.has(slug)) {
      throw new Error(
        `الرابط "${link.title}" في src/config/site.ts يشير إلى /pages/${slug}، ولا يوجد ملف src/content/pages/${slug}.md.`
      )
    }
  }
  return pages
}

const pages = loadPages()

export function getContentPages() {
  return pages
}

export function getContentPage(slug: string) {
  return pages.find((page) => page.slug === slug)
}
