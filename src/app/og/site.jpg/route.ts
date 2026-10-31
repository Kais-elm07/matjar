import { siteCard } from "@/lib/og/cards"
import { jpegResponse } from "@/lib/og/render"

// يُولَّد كملف ثابت وقت البناء: out/og/site.jpg
export const dynamic = "force-static"

/** صورة المشاركة العامة: للرئيسية وكل صفحة ليس لها صورة خاصة. */
export async function GET() {
  return jpegResponse(await siteCard())
}
