/**
 * Image loader for the static site (there is no server to resize images).
 *
 * Local images are prepared ahead of time in four sizes by the pnpm images command; here we pick the smallest size that fits the screen.
 * The path in the data is written without an extension:
 *   /images/products/shirt-1  becomes  /images/products/shirt-1-800.webp
 * Full URLs (https://...) and paths that have an extension are used as they are.
 * The same sizes are in scripts/images.mjs (WIDTHS) and next.config.ts (deviceSizes).
 */
export const IMAGE_WIDTHS: readonly [200, 400, 800, 1200] = [
  200, 400, 800, 1200,
]

const isExternal = (src: string) => /^https?:\/\//.test(src)
const hasExtension = (src: string) => /\.[a-z0-9]{2,5}(\?.*)?$/i.test(src)

/**
 * Path of the prepared image file with the smallest width that fits: /images/products/shirt-1 at width 700 becomes ...-800.webp.
 * Used by the loader, the share images and the build-time image check.
 */
export function imageFile(src: string, width: number) {
  if (isExternal(src) || hasExtension(src)) return src
  const size =
    IMAGE_WIDTHS.find((available) => available >= width) ??
    IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1]
  return `${src}-${size}.webp`
}

type ImageLoaderParams = {
  src: string
  width: number
  quality?: number
}

export default function imageLoader({ src, width }: ImageLoaderParams) {
  if (src.startsWith("data:")) return src
  if (isExternal(src) || hasExtension(src)) {
    // Add the width to the URL only so Next.js knows the loader takes the size into account
    return `${src}${src.includes("?") ? "&" : "?"}w=${width}`
  }
  return imageFile(src, width)
}
