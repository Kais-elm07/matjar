import "server-only"

import { PrismaPg } from "@prisma/adapter-pg"

import { PrismaClient } from "@/generated/prisma/client"

/** One client per server process, kept on globalThis because hot reload in development runs this file again. */
const shared: typeof globalThis & { matjarDb?: PrismaClient } = globalThis

/**
 * The database client (PostgreSQL through Prisma). It is created on first use, so every page of the
 * store works without a database; only what reads or writes orders needs DATABASE_URL.
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
    adapter: new PrismaPg({ connectionString }),
  })
  return shared.matjarDb
}
