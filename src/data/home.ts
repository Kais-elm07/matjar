import type { HomeContentInput } from "@/modules/catalog/types"

/**
 * Home page content: the slides and the promo cards.
 *
 * Each product card points only to the product's slug, so its image, price and discount percentage come from the products file,
 * and it needs no edit when the price changes. A category card takes its image from the categories file.
 *
 * tag: the small badge text. If left empty, the discount percentage shows automatically when there is one.
 */
export const homeContent: HomeContentInput = {
  heroSlides: [
    {
      product: "noise-cancelling-earbuds",
      title: "سماعات لاسلكية بعزل الضوضاء",
      text: "صوت نقي وبطارية تكفي يومك كله",
    },
    {
      product: "floral-summer-dress",
      title: "فستان صيفي مزهر",
      text: "قماش خفيف وألوان مبهجة لأيام الصيف",
      tag: "تشكيلة الصيف",
    },
    {
      product: "classic-wrist-watch",
      title: "ساعة يد كلاسيكية",
      text: "تصميم أنيق يناسب كل المناسبات",
      tag: "هدية مثالية",
    },
  ],
  promos: [
    {
      product: "portable-speaker",
      title: "سماعة بلوتوث محمولة",
    },
    {
      product: "oud-perfume",
      title: "عطر عود فاخر",
      tag: "عطور مختارة",
    },
    {
      product: "coffee-maker",
      title: "صانعة قهوة منزلية",
    },
  ],
  spotlights: [
    {
      category: "home-kitchen",
      title: "كل ما يحتاجه بيتك",
      text: "أواني وإضاءة وسجاد بجودة تدوم",
    },
    {
      category: "beauty",
      title: "عناية تليق بك",
      text: "عطور ومنتجات عناية مختارة بعناية",
    },
  ],
  wideBanner: {
    product: "lightweight-sneakers",
    title: "حذاء رياضي خفيف لكل يوم",
    text: "مريح للمشي الطويل، ومتوفر بعدة مقاسات وألوان",
  },
}
