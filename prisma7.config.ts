// Settings for the Prisma CLI (pnpm db:migrate, db:deploy, db:generate, db:studio).
// Prisma 7 reads this file under this name, and doesn't load .env by itself, hence dotenv.
import "dotenv/config"
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Run by prisma migrate reset, after it empties the local database
    seed: "pnpm db:seed",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
