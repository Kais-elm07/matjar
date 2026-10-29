import "server-only"

import { PrismaPg } from "@prisma/adapter-pg"

import { PrismaClient } from "@/generated/prisma/client"

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL غير معرّف. انسخ الملف .env.example إلى .env ثم عدّل القيم."
    )
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) })
}

// نحتفظ بنسخة واحدة أثناء التطوير، لأن إعادة التحميل السريع
// تعيد تنفيذ الملفات وقد تفتح اتصالات جديدة في كل مرة.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
