import { getSearchIndex } from "@/lib/catalog/catalog"

// يُولَّد كملف ثابت وقت البناء: out/search-index.json
export const dynamic = "force-static"

/** فهرس البحث: بطاقات كل المنتجات، يحمّله المتصفح عند أول استخدام للبحث. */
export function GET() {
  return Response.json(getSearchIndex())
}
