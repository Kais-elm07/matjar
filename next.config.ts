import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // موقع ثابت بالكامل: الأمر pnpm build ينشئ مجلد out/ يُرفع على أي استضافة
  output: "export",
  // كل صفحة في مجلد خاص بها (/products/index.html) حتى تعمل على كل الاستضافات
  trailingSlash: true,
  images: {
    // الصور تُجهَّز مسبقاً بثلاثة أحجام (pnpm images)، والمحمّل يختار الحجم المناسب للشاشة
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [400, 800, 1200],
    imageSizes: [64, 128, 256],
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
