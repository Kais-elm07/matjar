import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import prettier from "eslint-config-prettier/flat"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Type safety: data from outside is checked with a type guard, never assumed with a cast
    files: ["**/*.{ts,tsx,mts}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSAsExpression",
          message:
            "Don't use `as`: use a type annotation, `satisfies`, or a type guard from src/lib/guards.ts.",
        },
        {
          selector: "TSTypeAssertion",
          message:
            "Don't use type assertions: use a type annotation, `satisfies`, or a type guard.",
        },
      ],
      // List keys come from the data (a slug, SKU or id), never from the position in the array
      "react/no-array-index-key": "error",
    },
  },
  // يعطّل قواعد التنسيق في ESLint لأن Prettier يتولاها
  prettier,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
    "coverage/**",
  ]),
])

export default eslintConfig
