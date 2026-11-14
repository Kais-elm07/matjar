import { fileURLToPath } from "node:url"

import { defineConfig } from "vitest/config"

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url))

/**
 * Two groups of tests:
 * - unit (pnpm test): the functions for prices, search, filters, the cart, shipping and the data, in seconds and
 *   without a database; the catalog is built from src/data.
 * - db (pnpm test:db): saving orders against the local database (pnpm db:start, db:deploy, db:seed).
 */
export default defineConfig({
  resolve: {
    alias: [
      // server-only blocks importing build-time code in the browser; in tests an empty file is enough
      {
        find: "server-only",
        replacement: fromRoot("./tests/unit/support/empty.ts"),
      },
    ],
  },
  test: {
    projects: [
      {
        extends: true,
        resolve: {
          alias: [
            // The catalog comes from the database through Next.js's cache; the unit tests build it from src/data
            {
              find: /^@\/modules\/catalog\/load$/,
              replacement: fromRoot("./tests/unit/support/catalog-load.ts"),
            },
            { find: /^@\//, replacement: fromRoot("./src/") },
          ],
        },
        test: {
          name: "unit",
          include: ["tests/unit/**/*.test.ts"],
          setupFiles: ["tests/unit/support/setup.ts"],
        },
      },
      {
        extends: true,
        resolve: {
          alias: [{ find: /^@\//, replacement: fromRoot("./src/") }],
        },
        test: {
          name: "db",
          include: ["tests/db/**/*.test.ts"],
          // DATABASE_URL from .env, as the Prisma CLI reads it
          setupFiles: ["dotenv/config"],
          // One file at a time: the files change rows that others may read
          fileParallelism: false,
        },
      },
    ],
  },
})
