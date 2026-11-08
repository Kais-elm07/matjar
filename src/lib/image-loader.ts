/**
 * Image loader for prepared images: the server never resizes them, so no request waits for an image to be drawn.
 *
 * A photo is prepared ahead of time in five WebP sizes, and here we pick the smallest size that fits the screen.
 * Its address is written without the size and the extension, wherever it is:
 *   /images/products/shirt-1   (made by pnpm images)              becomes  /images/products/shirt-1-800.webp
 *   https://….supabase.co/storage/v1/object/public/product-images/products/<id>
 *                              (uploaded in the admin panel)       becomes  …/products/<id>-800.webp
 * Addresses that have an extension, such as /images/logo.png, are used as they are.
 * The sizes are made by src/lib/images/prepare.ts, and next.config.ts (deviceSizes) lists the same ones.
 */
export const IMAGE_WIDTHS: readonly [200, 400, 600, 800, 1200] = [
  200, 400, 600, 800, 1200,
]

const hasExtension = (src: string) => /\.[a-z0-9]{2,5}(\?.*)?$/i.test(src)

/**
 * Address of the prepared image file with the smallest width that fits: /images/products/shirt-1 at width 700
 * becomes ...-800.webp. Used by the loader, the share images and the build-time image check.
 */
export function imageFile(src: string, width: number) {
  if (hasExtension(src)) return src
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
  if (hasExtension(src)) {
    // Add the width to the URL only so Next.js knows the loader takes the size into account
    return `${src}${src.includes("?") ? "&" : "?"}w=${width}`
  }
  return imageFile(src, width)
}
