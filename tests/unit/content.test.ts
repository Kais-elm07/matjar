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

describe("الصفحات الثابتة", () => {
  const pages = getContentPages()

  it("تُقرأ كل الصفحات بعناوينها ووصفها", () => {
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

  it("لا يبقى أي قالب مثل {store} دون قيمة", () => {
    for (const page of pages) {
      expect(
        `${page.title} ${page.description} ${page.body}`,
        page.slug
      ).not.toMatch(/\{\w+\}/)
    }
  })

  it("صفحة الخصوصية تذكر الإحصاءات بحسب الإعدادات", () => {
    expect(getContentPage("privacy")?.body).toContain(
      siteConfig.analytics
        ? "نكتفي بعدّ الزيارات"
        : "لا نستخدم أدوات تحليل ترصد تصفحك."
    )
  })

  it("أسئلة الصفحة الشائعة تُقرأ بإجاباتها", () => {
    const items = parseFaq(getContentPage("faq")?.body ?? "").flatMap(
      (group) => group.items
    )
    expect(items.length).toBeGreaterThanOrEqual(5)
    for (const item of items) {
      expect(item.question).toMatch(/؟$/)
      expect(item.answer.trim(), item.question).not.toBe("")
    }
  })

  it("الصفحة غير الموجودة لا تُعاد", () => {
    expect(getContentPage("missing")).toBeUndefined()
  })
})

describe("تنسيق النصوص", () => {
  it("يحوّل النص إلى عناوين وفقرات وقوائم", () => {
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

  it("ينظّف الإجابة من التنسيق لمحركات البحث", () => {
    expect(
      plainAnswer("راسلنا **الآن** عبر [صفحة التواصل](/pages/contact).\n")
    ).toBe("راسلنا الآن عبر صفحة التواصل.")
  })
})

describe("بيانات محركات البحث والمشاركة", () => {
  it("يختصر الوصف ويحوّل النقاط إلى جملة", () => {
    expect(
      plainDescription(
        "سماعة صغيرة\nبصوت قوي.\n\n- مقاومة للماء\n- 12 ساعة تشغيل"
      )
    ).toBe("سماعة صغيرة بصوت قوي. مقاومة للماء، 12 ساعة تشغيل.")
    const long = plainDescription("كلمة ".repeat(60))
    expect(long.length).toBeLessThanOrEqual(155)
    expect(long.endsWith("…")).toBe(true)
  })

  it("يكتب الروابط كاملة، وبشرطة مائلة في نهاية الصفحات", () => {
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

  it("مسار التنقل يبدأ بالرئيسية", () => {
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

  it("يكتب عرض المنتج بسعر واحد أو بنطاق سعري", () => {
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

  it("صورة المشاركة بمقاس 1200×630", () => {
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
