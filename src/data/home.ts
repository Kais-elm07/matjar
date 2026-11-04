import type { HomeContentInput } from "@/lib/catalog/types"

/**
 * محتوى الصفحة الرئيسية: الشرائح وبطاقات العروض.
 *
 * كل بطاقة منتج تشير إلى رابط المنتج فقط، فتؤخذ صورته وسعره ونسبة خصمه من ملف المنتجات،
 * ولا تحتاج تعديلاً عند تغيّر السعر. وبطاقة الفئة تأخذ صورتها من ملف الفئات.
 *
 * tag: نص الشارة الصغيرة. إن تُرك فارغاً تظهر نسبة الخصم تلقائياً عند وجودها.
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
