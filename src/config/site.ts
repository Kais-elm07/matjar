export type NavLink = {
  title: string
  href: string
}

export type FooterNavGroup = {
  title: string
  links: NavLink[]
}

/**
 * إعدادات المتجر العامة.
 * الاسم والوصف مؤقتان حتى اعتماد الهوية: غيّرهما هنا فيتغيران في كل الموقع.
 */
export const siteConfig = {
  name: "متجري",
  description:
    "تسوّق منتجاتك المفضلة بسهولة: تصفّح سريع، وبحث ذكي، وخيارات واضحة لكل منتج، والدفع عند الاستلام.",
  /** رابط الموقع المنشور، يُستخدم في روابط المشاركة وخريطة الموقع */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/+$/,
    ""
  ),

  /**
   * العملة: مؤقتاً الريال السعودي حتى تحديد الدولة (القرار 1 في الخطة).
   * الأسعار تُكتب في ملفات البيانات بالريال، وتُحسب داخلياً بأصغر وحدة (هللة).
   */
  currency: {
    code: "SAR",
    symbol: "ر.س",
    fractionDigits: 2,
  },

  /** عدد المنتجات في كل صفحة من صفحات القوائم */
  productsPerPage: 24,

  /** يظهر تنبيه "بقي عدد قليل" عندما يصل المخزون إلى هذا الرقم أو أقل */
  lowStockThreshold: 5,

  /** روابط التسوق: بجانب الفئات في الرأس، وفي قائمة الجوال */
  shopNav: [
    { title: "كل المنتجات", href: "/products" },
    { title: "وصل حديثاً", href: "/products?sort=newest" },
    { title: "العروض", href: "/products?sale=1" },
  ] satisfies NavLink[],

  /** روابط المساعدة في قائمة الجوال */
  helpNav: [
    { title: "الشحن والتوصيل", href: "/pages/shipping" },
    { title: "الأسئلة الشائعة", href: "/pages/faq" },
    { title: "تواصل معنا", href: "/pages/contact" },
  ] satisfies NavLink[],

  footerNav: [
    {
      title: "تسوّق",
      links: [
        { title: "كل المنتجات", href: "/products" },
        { title: "وصل حديثاً", href: "/products?sort=newest" },
        { title: "العروض", href: "/products?sale=1" },
      ],
    },
    {
      title: "خدمة العملاء",
      links: [
        { title: "الشحن والتوصيل", href: "/pages/shipping" },
        { title: "الإرجاع والاستبدال", href: "/pages/returns" },
        { title: "الأسئلة الشائعة", href: "/pages/faq" },
        { title: "تواصل معنا", href: "/pages/contact" },
      ],
    },
    {
      title: "عن المتجر",
      links: [
        { title: "من نحن", href: "/pages/about" },
        { title: "سياسة الخصوصية", href: "/pages/privacy" },
        { title: "الشروط والأحكام", href: "/pages/terms" },
      ],
    },
  ] satisfies FooterNavGroup[],
}
