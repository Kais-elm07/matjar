import { fileURLToPath } from "node:url"

import { defineConfig } from "vitest/config"

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url))

/** Unit tests (pnpm test): the functions for prices, search, filters, the cart, shipping and the data. */
export default defineConfig({
  resolve: {
    alias: [
      // The catalog comes from the database through Next.js's cache; the tests build it from src/data
      {
        find: /^@\/lib\/catalog\/load$/,
        replacement: fromRoot("./tests/unit/support/catalog-load.ts"),
      },
      { find: /^@\//, replacement: fromRoot("./src/") },
      // server-only blocks importing build-time code in the browser; in tests an empty file is enough
      {
        find: "server-only",
        replacement: fromRoot("./tests/unit/support/empty.ts"),
      },
    ],
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    setupFiles: ["tests/unit/support/setup.ts"],
  },
})
