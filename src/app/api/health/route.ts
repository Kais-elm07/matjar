import { connection } from "next/server"

import { photoToolsStatus, storageStatus } from "@/lib/admin/uploads"
import { getDb } from "@/lib/db"

async function databaseStatus() {
  try {
    await getDb().$queryRaw`SELECT 1`
    return "up"
  } catch {
    return "down"
  }
}

/**
 * GET /api/health/, for a check after deploying: whether the server reaches the database, whether
 * sharp can prepare an uploaded photo here, and whether the photos' storage is ready ("off" when its
 * variables aren't set, which leaves uploading off but the store working). Any other answer is a 503.
 * connection() makes it answer every request, instead of the answer from build time.
 */
export async function GET() {
  await connection()
  const [database, photos, storage] = await Promise.all([
    databaseStatus(),
    photoToolsStatus(),
    storageStatus(),
  ])
  const ok =
    database === "up" &&
    photos === "up" &&
    (storage === "up" || storage === "off")
  return Response.json(
    { status: ok ? "ok" : "error", database, photos, storage },
    { status: ok ? 200 : 503 }
  )
}
