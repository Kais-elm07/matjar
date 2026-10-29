import { connection } from "next/server"

import { db } from "@/lib/db"

/**
 * فحص حالة الموقع وقاعدة البيانات.
 * تستخدمه خدمات مراقبة التوافر لاحقاً للتنبيه إذا توقف الموقع.
 */
export async function GET() {
  // الفحص يجب أن يعمل عند كل طلب، وليس مرة واحدة وقت البناء.
  await connection()

  try {
    await db.$queryRaw`SELECT 1`
    return Response.json({ status: "ok", database: "up" })
  } catch (error) {
    console.error("[health] فشل الاتصال بقاعدة البيانات", error)
    return Response.json({ status: "error", database: "down" }, { status: 503 })
  }
}
