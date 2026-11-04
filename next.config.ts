import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // موقع ثابت بالكامل: الأمر pnpm build ينشئ مجلد out/ يُرفع على أي استضافة
  output: "export",
  // كل صفحة في مجلد خاص بها (/products/index.html) حتى تعمل على كل الاستضافات
  trailingSlash: true,
  images: {
    // الصور تُجهَّز مسبقاً بثلاثة أحجام (pnpm images)، والمحمّل يختار الحجم المناسب للشاشة.
    // الأحجام نفسها في IMAGE_WIDTHS (src/lib/image-loader.ts) وscripts/images.mjs.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [400, 800, 1200],
    // لا أحجام أصغر: المحمّل يعيدها كلها إلى ملف 400، فتتكرر في كل صورة وتثقل الصفحة دون فائدة
    imageSizes: [],
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
