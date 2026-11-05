import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // A fully static site: pnpm build creates an out/ folder that can be uploaded to any host
  output: "export",
  // Each page gets its own folder (/products/index.html) so it works on every host
  trailingSlash: true,
  images: {
    // Images are prepared in advance in four sizes (pnpm images), and the loader picks the right size for the screen.
    // The same sizes are in IMAGE_WIDTHS (src/lib/image-loader.ts) and scripts/images.mjs.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [400, 800, 1200],
    // Only the size that has its own file, for the small thumbnails: any other small size
    // would map to a file that already exists and repeat it in every image's list of sizes
    imageSizes: [200],
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
