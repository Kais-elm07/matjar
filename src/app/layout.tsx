import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"

import { DirectionProvider } from "@/components/ui/direction"
import { Toaster } from "@/components/ui/sonner"
import { siteConfig } from "@/config/site"

import "./globals.css"

// خط IBM Plex Sans Arabic مستضاف داخل المشروع (ترخيص OFL في src/fonts/ibm-plex-sans-arabic)،
// حتى لا يتوقف بناء الموقع إذا تعذّر الاتصال بـ Google Fonts.
// الملفات نسخ مصغّرة تحوي الحروف التي يحتاجها المتجر فقط، يولّدها الأمر pnpm fonts من assets/fonts.
// الخط ثابت الأوزان، والمستخدم منه ثلاثة: 400 و500 و700.
// المجموعة الأولى للحروف العربية، والثانية للأرقام والحروف اللاتينية،
// وترتيبهما في الخطوط يُضبط عبر --font-sans في src/app/globals.css
const plexArabic = localFont({
  src: [
    {
      path: "../fonts/ibm-plex-sans-arabic/ibm-plex-sans-arabic-arabic-400-normal.woff2",
      weight: "400",
    },
    {
      path: "../fonts/ibm-plex-sans-arabic/ibm-plex-sans-arabic-arabic-500-normal.woff2",
      weight: "500",
    },
    {
      path: "../fonts/ibm-plex-sans-arabic/ibm-plex-sans-arabic-arabic-700-normal.woff2",
      weight: "700",
    },
  ],
  display: "swap",
  variable: "--font-arabic",
  // الخط البديل التلقائي يغطي الحروف اللاتينية أيضاً، فيمنع استخدام ملفات الأرقام
  adjustFontFallback: false,
})

const plexLatin = localFont({
  src: [
    {
      path: "../fonts/ibm-plex-sans-arabic/ibm-plex-sans-arabic-latin-400-normal.woff2",
      weight: "400",
    },
    {
      path: "../fonts/ibm-plex-sans-arabic/ibm-plex-sans-arabic-latin-500-normal.woff2",
      weight: "500",
    },
    {
      path: "../fonts/ibm-plex-sans-arabic/ibm-plex-sans-arabic-latin-700-normal.woff2",
      weight: "700",
    },
  ],
  display: "swap",
  variable: "--font-latin",
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
  themeColor: "#a4471f",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${plexArabic.variable} ${plexLatin.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <DirectionProvider direction="rtl">
          {children}
          <Toaster />
        </DirectionProvider>
      </body>
    </html>
  )
}
