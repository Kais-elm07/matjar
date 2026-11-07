<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Design

Before any work on the interface, read `DESIGN.md` at the project root and follow it; it is the single reference for the store's colors, fonts, spacing and components. The mapping of its values to Tailwind classes is in the project skill `.claude/skills/design-system/SKILL.md`. After any change to `DESIGN.md`, run `pnpm design:lint`.

The skill `design-taste-frontend` (Taste Skill, from github.com/Leonxlnx/taste-skill) is installed for the user in `~/.claude/skills`, not in this repository. In this project it is used only to review the interface: it points out problems and suggests improvements. Suggestions are carried out only where they agree with `DESIGN.md`, following the `design-system` skill. Don't deal a palette or font pairing with its `start.mjs`, don't copy its `assets/` or `starter.html` into the store, which is a Next.js app, and don't add the skill's files to this repository.

## Code rules

- No `any`, no type assertions (`as`, including `as const`) and no non-null assertions (`!`). Use a type annotation, `satisfies`, or a type guard from `src/lib/guards.ts` (general checks) or `src/lib/catalog/guards.ts` (the catalog's shapes). Data read at runtime (what the browser downloads, browser storage, JSON columns in the database) is checked with a guard before it is used. ESLint enforces these rules.
- List keys come from the data (a slug, SKU or id), never from the position in the array. Loading placeholders take their keys from `placeholderIds()` in `src/lib/placeholders.ts`.
- One component per file, named after it in kebab-case (`PromoTile` in `promo-tile.tsx`). The exception is the compound components in `src/components/ui` (Dialog, Sheet, Tabs, Breadcrumb, NativeSelect), whose parts only work together. Shared class strings go in a styles file such as `product-styles.ts`.
- Every component that takes props has a `<Component>Props` interface right above it. When the props are a union, which an interface can't express, it is a type alias with the same name (`ListingViewProps`). Route files use Next.js's generated `PageProps<"/route">` and `LayoutProps<"/route">` types, and `ErrorInfo` from `next/error` for `error.tsx`.
- For React performance and component structure, follow the project skills `vercel-react-best-practices` and `vercel-composition-patterns` in `.claude/skills`, copied from github.com/vercel-labs/agent-skills.

## Server and data

- The store runs on a Next.js server with the classic rendering model (Cache Components is off). The catalog and help pages keep `generateStaticParams` with `dynamicParams = false`, and the prepared files (data JSON, share images, sitemap, robots) keep `export const dynamic = "force-static"`. A page that reads the database says so with `export const dynamic = "force-dynamic"`.
- Code that runs only on the server imports `server-only`. The database is reached only through `getDb()` in `src/lib/db.ts`, and the orders through `src/lib/checkout/orders.ts`.
- Server Actions (`"use server"`, such as `src/lib/checkout/actions.ts`) can be called by anyone with a POST request: check every argument with Zod, and take prices, stock and coupons from the server's own data, never from the browser.
- A `"use client"` module can't hand functions or constants to server code, so logic both sides need lives in a plain module (`src/lib/checkout/totals.ts`, `quantity.ts`).
- Server code reads files only by a literal path. A computed path makes Turbopack copy the whole project into the server's files; a check that runs only during `next build` is guarded by `NEXT_PHASE` and marked `turbopackIgnore` (`src/lib/catalog/build.ts`).
- Addresses end with `/` (`trailingSlash`), API routes included, and are built in `src/lib/routes.ts`.
- The root layout writes nothing into `<head>` by hand; Next fills it from `metadata` and `viewport`. Hosts add text there (Netlify puts a line break and a comment after `<meta charSet>`), and React then throws away the server's HTML and renders the whole page again in the browser. An inline script that must run before the page is drawn goes at the start of `<body>` (`RENDER_ALL_SCRIPT` in `src/lib/render-later.ts`).
- After changing `prisma/schema.prisma`, run `pnpm db:migrate` and then `pnpm db:generate`, and commit the migration. Migrations only add (new tables, optional columns), because a rollback on the host restores the code but not the tables. The browser tests run against `next start`: they need `pnpm build` and the local database (`pnpm db:start`, `pnpm db:deploy`, `pnpm db:seed`).
- The catalog (categories and products) is in the database and is read only through `getCatalog()` in `src/lib/catalog/load.ts`, which caches the plain rows under the tag `catalog` (`unstable_cache` keeps JSON, so never cache the built catalog, which holds `Map`s). The catalog functions are async. A change to products or stock ends with `revalidateTag("catalog", "max")`. The unit tests build the catalog from `src/data` instead (`tests/unit/support/catalog-load.ts`, swapped in by `vitest.config.mts`).
- The catalog tables are filled from `src/data` by `prisma/seed.ts`, which converts the files with the pure functions in `src/lib/catalog/rows.ts`. The seed runs outside Next (through `tsx`), so nothing it imports may import `server-only`.

## Language

The project documentation (`README.md`, `PLAN.md`, `DESIGN.md`, `DEPLOYMENT.md`, `USER-TESTING.md` and the design skill), code comments, test names, CI step names and commit messages are written in English. A comment that refers to interface text quotes it in Arabic with its English meaning, such as "تصفية" (Filter). The storefront stays in Arabic: interface text, product and category data, the static pages in `src/content/pages`, and the validation and error messages the store owner and the visitors read, including the output of the scripts in `scripts/`.
