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
    "تسوّق منتجاتك المفضلة بسهولة، وادفع عند الاستلام، وتابع طلبك خطوة بخطوة حتى يصل إلى باب بيتك.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /** روابط التنقل الرئيسية: في الشريط العلوي على الحاسوب وفي القائمة الجانبية على الجوال */
  mainNav: [
    { title: "الرئيسية", href: "/" },
    { title: "كل المنتجات", href: "/products" },
    { title: "وصل حديثاً", href: "/products?sort=newest" },
    { title: "العروض", href: "/products?sale=1" },
  ] satisfies NavLink[],

  /** روابط الحساب والمساعدة في القائمة الجانبية على الجوال */
  helpNav: [
    { title: "حسابي", href: "/account" },
    { title: "تتبع الطلب", href: "/track" },
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
        { title: "تتبع الطلب", href: "/track" },
        { title: "الشحن والتوصيل", href: "/pages/shipping" },
        { title: "الإرجاع والاستبدال", href: "/pages/returns" },
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
