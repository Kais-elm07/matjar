import { connection } from "next/server"

import { getDb } from "@/lib/db"

/**
 * GET /api/health/: whether the server can reach the database, for a check after deploying.
 * connection() makes it answer every request, instead of the answer from build time.
 */
export async function GET() {
  await connection()
  try {
    await getDb().$queryRaw`SELECT 1`
    return Response.json({ status: "ok", database: "up" })
  } catch {
    return Response.json({ status: "error", database: "down" }, { status: 503 })
  }
}
