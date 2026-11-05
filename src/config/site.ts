export type NavLink = {
  title: string
  href: string
}

export type FooterNavGroup = {
  title: string
  links: NavLink[]
}

/** Analytics tools without cookies or cross-site tracking. src is optional, for self-hosting the tool. */
export type AnalyticsConfig =
  | { provider: "plausible"; domain: string; src?: string }
  | { provider: "umami"; websiteId: string; src?: string }

/** The bar above every page. `href` makes the whole bar a link. */
export type Announcement = { text: string; href?: string }

export interface SiteConfig {
  name: string
  tagline: string
  statement: string
  description: string
  url: string
  currency: { code: string; symbol: string; fractionDigits: number }
  contact: {
    email: string
    phone: string
    whatsapp: string
    hours: string
    address: string
  }
  announcement: Announcement | null
  analytics: AnalyticsConfig | null
  utcOffset: string
  productsPerPage: number
  lowStockThreshold: number
  shopNav: NavLink[]
  helpNav: NavLink[]
  footerNav: FooterNavGroup[]
}

/**
 * General store settings.
 * The name and description are placeholders until the brand is approved: change them here and they change across the site.
 */
export const siteConfig: SiteConfig = {
  name: "متجري",
  /** A short phrase after the name in the home page title, and in the general share image */
  tagline: "تسوّق أونلاين بسهولة",
  /** The large sentence in the footer */
  statement: "تسوّق براحتك، وادفع عند الاستلام، ونوصل طلبك إلى باب بيتك.",
  description:
    "تسوّق منتجاتك المفضلة بسهولة: تصفّح سريع، وبحث ذكي، وخيارات واضحة لكل منتج، والدفع عند الاستلام.",
  /** URL of the published site, used in share links and the sitemap */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/+$/,
    ""
  ),

  /**
   * Currency: the Saudi riyal for now, until the country is decided (decision 1 in the plan).
   * Prices are written in riyals in the data files, and computed internally in the smallest unit (halala).
   */
  currency: {
    code: "SAR",
    symbol: "ر.س",
    fractionDigits: 2,
  },

  /**
   * Contact details: shown on the "تواصل معنا" (contact us) page and in the floating WhatsApp button.
   * The current values are placeholders and invalid on purpose (zeros and the example.com domain reserved for examples),
   * so no visitor reaches a real person. Put your store's details here, or leave a field "" to hide it.
   */
  contact: {
    email: "hello@example.com",
    /** The phone number as the visitor sees it, such as "+966 50 123 4567" */
    phone: "+966 00 000 0000",
    /** WhatsApp number in international format, such as "+966 50 123 4567". If set, the floating button shows */
    whatsapp: "+966 00 000 0000",
    // \u00a0 is a non-breaking space: it keeps each number on the same line as its word
    hours: "السبت إلى الخميس، من 9\u00a0صباحاً حتى 9\u00a0مساءً",
    /** The store's address, if it has a physical place; it shows with a link to Google Maps */
    address: "",
  },

  /**
   * The announcement bar at the top of every page, or null to hide it.
   * {freeShipping} is replaced automatically with the free shipping threshold from src/data/shipping.ts.
   */
  announcement: {
    text: "شحن مجاني للطلبات من {freeShipping}، والدفع عند الاستلام",
    href: "/pages/shipping",
  },

  /**
   * Visit analytics (optional), or null for no analytics.
   * When enabled, the analytics paragraph on the privacy page changes automatically. Examples:
   *   { provider: "plausible", domain: "example.com" }
   *   { provider: "umami", websiteId: "the website ID from the Umami dashboard" }
   */
  analytics: null,

  /**
   * The store's offset from UTC: sales end at the last second of their day in this time zone.
   * Saudi time for now, until the country is decided (decision 1 in the plan).
   */
  utcOffset: "+03:00",

  /** Number of products on each page of the product lists */
  productsPerPage: 24,

  /** The "بقي عدد قليل" (only a few left) notice shows when stock reaches this number or less */
  lowStockThreshold: 5,

  /** Shopping links: next to the categories in the header, and in the mobile menu */
  shopNav: [
    { title: "كل المنتجات", href: "/products" },
    { title: "وصل حديثاً", href: "/products?sort=newest" },
    { title: "العروض", href: "/products?sale=1" },
  ],

  /** Help links in the mobile menu */
  helpNav: [
    { title: "الشحن والتوصيل", href: "/pages/shipping" },
    { title: "الأسئلة الشائعة", href: "/pages/faq" },
    { title: "تواصل معنا", href: "/pages/contact" },
  ],

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
  ],
}
