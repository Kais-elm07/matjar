import type { NextConfig } from "next"

// The content security policy: only the site's own files, plus the inline scripts and styles Next.js
// needs, and the uploaded photos. A nonce instead of 'unsafe-inline' would make every page render on each request
// (node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md), and the catalog pages are
// prerendered. React uses eval only in development. When analytics is turned on (src/config/site.ts),
// add the tool's domain to script-src and connect-src, such as https://plausible.io
// No upgrade-insecure-requests: every file is the site's own or on https, HSTS below keeps visitors on https, and
// Safari applies it to http://localhost too, so the production server could not be tested locally.
// The photos uploaded in the admin panel are served by Supabase Storage (src/modules/admin/uploads.ts), so
// its address joins img-src; SUPABASE_URL is read when the site is built.
function originOf(address: string | undefined) {
  try {
    return address ? new URL(address).origin : null
  } catch {
    return null
  }
}
const storageOrigin = originOf(process.env.SUPABASE_URL)

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data:${storageOrigin ? ` ${storageOrigin}` : ""}`,
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ")

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
]

const nextConfig: NextConfig = {
  // Addresses end with a slash (/products/), as they did when the store was a static site,
  // so links, canonical addresses and search engine entries stay the same
  trailingSlash: true,
  images: {
    // Images are prepared in advance in five sizes (pnpm images), and the loader picks the right size for the screen,
    // so the server never resizes them. The same sizes are in IMAGE_WIDTHS (src/lib/image-loader.ts), which
    // src/lib/image-prepare.ts makes for pnpm images and for the photos uploaded in the admin panel.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // 600 fits a photo on a stage on most phones, between the card size (400) and the full width (800)
    deviceSizes: [400, 600, 800, 1200],
    // Only the size that has its own file, for the small thumbnails: any other small size
    // would map to a file that already exists and repeat it in every image's list of sizes
    imageSizes: [200],
  },
  // The server builds the catalog in memory and reads only public/images/image-meta.json from that folder
  // (src/modules/catalog/image-meta.ts). The photos are served as files, so they stay out of the server's code.
  outputFileTracingExcludes: { "/*": ["./public/images/**/*.webp"] },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Images may be replaced under the same name, so they are cached for one day.
      // This rule reaches next start and a Node.js server; Netlify serves the files in public itself,
      // so netlify.toml sets the same value there.
      // Scripts, styles and fonts carry a hash in their names, and Next.js caches them for a year itself.
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
      // Share images change with prices and names, so they are cached for an hour
      {
        source: "/og/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600" }],
      },
    ]
  },
  experimental: {
    serverActions: {
      // A photo uploaded in the admin panel goes to a Server Action: up to 4 MB (MAX_UPLOAD_BYTES in
      // src/modules/admin/upload-rules.ts), plus the bytes the form adds around it
      bodySizeLimit: "5mb",
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
}

export default nextConfig
