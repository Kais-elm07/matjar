import { fileURLToPath } from "node:url"

import { defineConfig } from "vitest/config"

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url))

/** اختبارات الوحدات (pnpm test): دوال الأسعار والبحث والفلاتر والسلة والشحن والبيانات. */
export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\//, replacement: fromRoot("./src/") },
      // server-only يمنع استيراد كود وقت البناء في المتصفح، وفي الاختبارات يكفي ملف فارغ
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
