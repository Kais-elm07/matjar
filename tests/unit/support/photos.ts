import sharp from "sharp"

/** A PNG photo of a disc in one color, on a transparent background ("none") or a solid one. */
export function discPhoto(width: number, color: string, background: string) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${width}">` +
    `<rect width="100%" height="100%" fill="${background}"/>` +
    `<circle cx="50%" cy="50%" r="40%" fill="${color}"/></svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}
