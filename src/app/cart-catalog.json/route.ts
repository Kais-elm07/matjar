import { getCartCatalog } from "@/lib/catalog/catalog"

// يُولَّد كملف ثابت وقت البناء: out/cart-catalog.json
export const dynamic = "force-static"

/** أسعار ومخزون كل المتغيرات، تقارن بها السلة المحفوظة في المتصفح بعد كل نشر جديد. */
export function GET() {
  return Response.json(getCartCatalog())
}
