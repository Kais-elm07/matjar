import type { Metadata, Viewport } from "next"

import { Analytics } from "@/components/global/analytics"
import { LazyToaster } from "@/components/global/lazy-toaster"
import { RenderAllAfterNavigation } from "@/components/global/render-all-after-navigation"
import { DirectionProvider } from "@/components/ui/direction"
import { siteConfig } from "@/config/site"
import { RENDER_ALL_SCRIPT } from "@/lib/render-later"
import { openGraph } from "@/lib/seo"

import { HTML_CLASSES } from "./fonts"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: openGraph({
    title: siteConfig.name,
    description: siteConfig.description,
  }),
  // X (Twitter) takes the title and image from openGraph, and shows the image at full width
  twitter: { card: "summary_large_image" },
}

export const viewport: Viewport = {
  // The mobile browser bar takes the store's dark background color, and native fields and menus are dark too
  themeColor: "#0b0e14",
  colorScheme: "dark",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={HTML_CLASSES}
      // The script below may add data-render-all before React starts
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        {/* At the start of <body>, not in <head>: see RENDER_ALL_SCRIPT */}
        <script dangerouslySetInnerHTML={{ __html: RENDER_ALL_SCRIPT }} />
        <DirectionProvider direction="rtl">
          {children}
          <LazyToaster />
          <Analytics />
          <RenderAllAfterNavigation />
        </DirectionProvider>
      </body>
    </html>
  )
}
