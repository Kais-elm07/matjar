import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import prettier from "eslint-config-prettier/flat"

/** An import that a layer of src may not use, and the reason shown with the error. */
function restricted(group, message, allowTypeImports = false) {
  return { group, message, allowTypeImports }
}

const ROUTES = restricted(
  ["@/app/*"],
  "Only the routes in src/app import from src/app."
)
const FRAME = restricted(
  ["@/components/layout/*"],
  "The page frame (src/components/layout) uses the features, not the other way round."
)
const FEATURES = restricted(
  ["@/modules/*"],
  "This layer is under the features (src/modules) and doesn't know them."
)
const FEATURE_TYPES_ONLY = restricted(
  ["@/modules/*"],
  "General code doesn't depend on a feature: import only its types (import type).",
  true
)

/** The rule for one layer. typescript-eslint's version can allow type-only imports. */
function layerRule(patterns) {
  return ["error", { patterns }]
}

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
      // Every component has a named Props interface, even when it only extends another type
      "@typescript-eslint/no-empty-object-type": [
        "error",
        { allowInterfaces: "with-single-extends" },
      ],
      // One component per file
      "react/no-multi-comp": "error",
      // Zod is set up once in src/lib/zod.ts (Arabic messages, no eval), so every rule imports it from there
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "zod",
              message: "Import z from @/lib/zod, where Zod is set up.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/lib/zod.ts"],
    rules: { "no-restricted-imports": "off" },
  },
  {
    // Compound components keep their parts together (a dialog with its trigger, content and title)
    files: ["src/components/ui/**"],
    rules: { "react/no-multi-comp": "off" },
  },
  {
    // The last-resort error page has no router: its link home loads the page from the server on purpose
    files: ["src/app/global-error.tsx"],
    rules: { "@next/next/no-html-link-for-pages": "off" },
  },
  // The layers of src, each importing only from the layers under it (see "Project structure" in the README)
  {
    // The base components know nothing about the store
    files: ["src/components/ui/**"],
    rules: {
      "@typescript-eslint/no-restricted-imports": layerRule([
        ROUTES,
        FRAME,
        FEATURES,
        restricted(
          ["@/components/shared/*"],
          "src/components/ui holds the base components, which the shared pieces build on."
        ),
      ]),
    },
  },
  {
    // Pieces many pages use: they may know a feature's types, nothing more
    files: ["src/components/shared/**"],
    rules: {
      "@typescript-eslint/no-restricted-imports": layerRule([
        ROUTES,
        FRAME,
        FEATURE_TYPES_ONLY,
      ]),
    },
  },
  {
    // General tools: they may know a feature's types, nothing more, and no component
    files: ["src/lib/**", "src/hooks/**"],
    rules: {
      "@typescript-eslint/no-restricted-imports": layerRule([
        ROUTES,
        FRAME,
        FEATURE_TYPES_ONLY,
        restricted(
          ["@/components/*"],
          "src/lib and src/hooks are general code: components import them, not the other way round."
        ),
      ]),
    },
  },
  {
    // The features may use each other, the general code and the shared pieces, but not the frame or the routes
    files: ["src/modules/**"],
    rules: {
      "@typescript-eslint/no-restricted-imports": layerRule([ROUTES, FRAME]),
    },
  },
  // Turns off the formatting rules in ESLint, because Prettier handles them
  prettier,
  globalIgnores([
    ".next/**",
    "build/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
    "coverage/**",
    // The Prisma client, generated from prisma/schema.prisma
    "src/generated/**",
  ]),
])

export default eslintConfig
