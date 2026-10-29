import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"

import { DirectionProvider } from "@/components/ui/direction"
import { siteConfig } from "@/config/site"

import "./globals.css"

// خط Cairo مستضاف داخل المشروع (ترخيص OFL في src/fonts/cairo)،
// حتى لا يتوقف بناء الموقع إذا تعذّر الاتصال بـ Google Fonts.
// ملفان متغيرا الوزن: الأول للحروف العربية، والثاني للأرقام والحروف اللاتينية.
// ترتيبهما في الخطوط يُضبط عبر --font-sans في src/app/globals.css
const cairoArabic = localFont({
  src: "../fonts/cairo/cairo-arabic-wght-normal.woff2",
  weight: "200 1000",
  display: "swap",
  variable: "--font-cairo-arabic",
  // الخط البديل التلقائي يغطي الحروف اللاتينية أيضاً، فيمنع استخدام ملف الأرقام
  adjustFontFallback: false,
})

const cairoLatin = localFont({
  src: "../fonts/cairo/cairo-latin-wght-normal.woff2",
  weight: "200 1000",
  display: "swap",
  variable: "--font-cairo-latin",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | تسوّق أونلاين بسهولة`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "ar_AR",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
}

export const viewport: Viewport = {
  // لون شريط المتصفح على الجوال، وهو نفس اللون الأساسي
  themeColor: "#047857",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairoArabic.variable} ${cairoLatin.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <DirectionProvider direction="rtl">{children}</DirectionProvider>
      </body>
    </html>
  )
}
