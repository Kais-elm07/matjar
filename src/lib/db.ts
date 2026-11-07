import "server-only"

import { PrismaPg } from "@prisma/adapter-pg"

import { PrismaClient } from "@/generated/prisma/client"

/** One client per server process, kept on globalThis because hot reload in development runs this file again. */
const shared: typeof globalThis & { matjarDb?: PrismaClient } = globalThis

/**
 * The database client (PostgreSQL through Prisma), created on first use. The catalog reads it through
 * Next.js's cache (src/lib/catalog/load.ts), and the orders directly.
 */
export function getDb() {
  if (shared.matjarDb) return shared.matjarDb
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL غير معرّف. انسخ الملف .env.example إلى .env، ثم شغّل pnpm db:start."
    )
  }
  shared.matjarDb = new PrismaClient({
    adapter: new PrismaPg({
      connectionString,
      // On Netlify every function opens its own connections, and the free Supabase pooler has few:
      // two are enough for one request at a time, and an idle one is closed after ten seconds
      max: 2,
      idleTimeoutMillis: 10_000,
    }),
  })
  return shared.matjarDb
}
