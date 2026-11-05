import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // A fully static site: pnpm build creates an out/ folder that can be uploaded to any host
  output: "export",
  // Each page gets its own folder (/products/index.html) so it works on every host
  trailingSlash: true,
  images: {
    // Images are prepared in advance in three sizes (pnpm images), and the loader picks the right size for the screen.
    // The same sizes are in IMAGE_WIDTHS (src/lib/image-loader.ts) and scripts/images.mjs.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [400, 800, 1200],
    // No smaller sizes: the loader maps them all to the 400 file, so they would repeat in every image and make the page heavier for nothing
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
