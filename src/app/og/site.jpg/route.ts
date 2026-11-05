import { siteCard } from "@/lib/og/cards"
import { jpegResponse } from "@/lib/og/render"

// Generated as a static file at build time: out/og/site.jpg
export const dynamic = "force-static"

/** The general share image: for the home page and every page without its own image. */
export async function GET() {
  return jpegResponse(await siteCard())
}
