import { describe, expect, it } from "vitest"

import { parseFaq, plainAnswer } from "@/components/content/faq-list"
import { parseBlocks } from "@/components/store/rich-text"
import { siteConfig } from "@/config/site"
import { getProduct } from "@/lib/catalog/catalog"
import { toSchemaPrice } from "@/lib/catalog/money"
import { getContentPage, getContentPages } from "@/lib/content/pages"
import {
  absoluteImageUrl,
  absoluteUrl,
  breadcrumbJsonLd,
  openGraph,
  plainDescription,
  productJsonLd,
} from "@/lib/seo"

describe("static pages", () => {
  const pages = getContentPages()

  it("reads every page with its title and description", () => {
    expect(pages.map((page) => page.slug).sort()).toEqual([
      "about",
      "contact",
      "faq",
      "privacy",
      "returns",
      "shipping",
      "terms",
    ])
    for (const page of pages) {
      expect(page.title, page.slug).not.toBe("")
      expect(page.description, page.slug).not.toBe("")
    }
  })

  it("leaves no placeholder such as {store} without a value", () => {
    for (const page of pages) {
      expect(
        `${page.title} ${page.description} ${page.body}`,
        page.slug
      ).not.toMatch(/\{\w+\}/)
    }
  })

  it("mentions analytics on the privacy page according to the settings", () => {
    expect(getContentPage("privacy")?.body).toContain(
      siteConfig.analytics
        ? "نكتفي بعدّ الزيارات"
        : "لا نستخدم أدوات تحليل ترصد تصفحك."
    )
  })

  it("reads the FAQ page questions with their answers", () => {
    const items = parseFaq(getContentPage("faq")?.body ?? "").flatMap(
      (group) => group.items
    )
    expect(items.length).toBeGreaterThanOrEqual(5)
    for (const item of items) {
      expect(item.question).toMatch(/؟$/)
      expect(item.answer.trim(), item.question).not.toBe("")
    }
  })

  it("returns nothing for a missing page", () => {
    expect(getContentPage("missing")).toBeUndefined()
  })
})

describe("text formatting", () => {
  it("turns text into headings, paragraphs and lists", () => {
    expect(
      parseBlocks(
        "## الشحن\n\nنوصل الطلبات\nإلى كل المدن.\n\n- سريع\n- آمن\n\n1. اطلب\n2. استلم"
      )
    ).toEqual([
      { type: "heading", level: 2, text: "الشحن", line: 1 },
      { type: "paragraph", text: "نوصل الطلبات إلى كل المدن.", line: 3 },
      {
        type: "list",
        ordered: false,
        items: [
          { text: "سريع", line: 6 },
          { text: "آمن", line: 7 },
        ],
        line: 6,
      },
      {
        type: "list",
        ordered: true,
        items: [
          { text: "اطلب", line: 9 },
          { text: "استلم", line: 10 },
        ],
        line: 9,
      },
    ])
  })

  it("strips the formatting from an answer for search engines", () => {
    expect(
      plainAnswer("راسلنا **الآن** عبر [صفحة التواصل](/pages/contact).\n")
    ).toBe("راسلنا الآن عبر صفحة التواصل.")
  })
})

describe("search engine and sharing data", () => {
  it("shortens the description and turns bullet points into a sentence", () => {
    expect(
      plainDescription(
        "سماعة صغيرة\nبصوت قوي.\n\n- مقاومة للماء\n- 12 ساعة تشغيل"
      )
    ).toBe("سماعة صغيرة بصوت قوي. مقاومة للماء، 12 ساعة تشغيل.")
    const long = plainDescription("كلمة ".repeat(60))
    expect(long.length).toBeLessThanOrEqual(155)
    expect(long.endsWith("…")).toBe(true)
  })

  it("writes full URLs, with a trailing slash for pages", () => {
    expect(absoluteUrl("/products")).toBe(`${siteConfig.url}/products/`)
    expect(absoluteUrl("/")).toBe(`${siteConfig.url}/`)
    expect(absoluteUrl("/icon.svg")).toBe(`${siteConfig.url}/icon.svg`)
    expect(absoluteImageUrl("/images/products/x-1")).toBe(
      `${siteConfig.url}/images/products/x-1-1200.webp`
    )
    expect(absoluteImageUrl("https://cdn.example.com/a.jpg")).toBe(
      "https://cdn.example.com/a.jpg"
    )
  })

  it("starts the breadcrumb with the home page", () => {
    const data = breadcrumbJsonLd([
      { name: "ملابس", path: "/category/clothing" },
    ])
    expect(
      data.itemListElement.map((item) => [item.position, item.name])
    ).toEqual([
      [1, "الرئيسية"],
      [2, "ملابس"],
    ])
  })

  it("writes the product offer with a single price or a price range", () => {
    const watch = getProduct("classic-wrist-watch")
    const charger = getProduct("fast-charger-65w")
    expect(watch && charger).toBeTruthy()
    if (!watch || !charger) return
    expect(watch.maxPrice).toBeGreaterThan(watch.price)
    expect(productJsonLd(watch).offers).toMatchObject({
      "@type": "AggregateOffer",
      lowPrice: toSchemaPrice(watch.price),
      highPrice: toSchemaPrice(watch.maxPrice),
      priceCurrency: siteConfig.currency.code,
    })
    expect(productJsonLd(charger).offers).toMatchObject({
      "@type": "Offer",
      price: toSchemaPrice(charger.price),
    })
  })

  it("uses a 1200×630 share image", () => {
    expect(
      openGraph({ title: "عنوان", description: "وصف", path: "/products/" })
    ).toMatchObject({
      url: "/products/",
      siteName: siteConfig.name,
      locale: "ar_AR",
      images: [
        {
          url: "/og/site.jpg",
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: "عنوان",
        },
      ],
    })
  })
})
