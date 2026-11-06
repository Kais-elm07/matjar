<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Design

Before any work on the interface, read `DESIGN.md` at the project root and follow it; it is the single reference for the store's colors, fonts, spacing and components. The mapping of its values to Tailwind classes is in the project skill `.claude/skills/design-system/SKILL.md`. After any change to `DESIGN.md`, run `pnpm design:lint`.

The skill `design-taste-frontend` (Taste Skill, from github.com/Leonxlnx/taste-skill) is installed for the user in `~/.claude/skills`, not in this repository. In this project it is used only to review the interface: it points out problems and suggests improvements. Suggestions are carried out only where they agree with `DESIGN.md`, following the `design-system` skill. Don't deal a palette or font pairing with its `start.mjs`, don't copy its `assets/` or `starter.html` into the store, which is a Next.js app, and don't add the skill's files to this repository.

## Code rules

- No `any`, no type assertions (`as`, including `as const`) and no non-null assertions (`!`). Use a type annotation, `satisfies`, or a type guard from `src/lib/guards.ts` (general checks) or `src/lib/catalog/guards.ts` (the catalog's shapes). Data read at runtime (the JSON files the browser downloads, browser storage) is checked with a guard before it is used. ESLint enforces these rules.
- List keys come from the data (a slug, SKU or id), never from the position in the array. Loading placeholders take their keys from `placeholderIds()` in `src/lib/placeholders.ts`.
- One component per file, named after it in kebab-case (`PromoTile` in `promo-tile.tsx`). The exception is the compound components in `src/components/ui` (Dialog, Sheet, Tabs, Breadcrumb, NativeSelect), whose parts only work together. Shared class strings go in a styles file such as `product-styles.ts`.
- Every component that takes props has a `<Component>Props` interface right above it. When the props are a union, which an interface can't express, it is a type alias with the same name (`ListingViewProps`). Route files use Next.js's generated `PageProps<"/route">` and `LayoutProps<"/route">` types.
- For React performance and component structure, follow the project skills `vercel-react-best-practices` and `vercel-composition-patterns` in `.claude/skills`, copied from github.com/vercel-labs/agent-skills.

## Language

The project documentation (`README.md`, `PLAN.md`, `DESIGN.md`, `DEPLOYMENT.md`, `USER-TESTING.md` and the design skill), code comments, test names, CI step names and commit messages are written in English. A comment that refers to interface text quotes it in Arabic with its English meaning, such as "تصفية" (Filter). The storefront stays in Arabic: interface text, product and category data, the static pages in `src/content/pages`, and the validation and error messages the store owner reads, including the output of the scripts in `scripts/`.
