<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Design

Before any work on the interface, read `DESIGN.md` at the project root and follow it; it is the single reference for the store's colors, fonts, spacing and components. The mapping of its values to Tailwind classes is in the project skill `.claude/skills/design-system/SKILL.md`. After any change to `DESIGN.md`, run `pnpm design:lint`.

## Language

The project documentation (`README.md`, `PLAN.md`, `DESIGN.md`, `DEPLOYMENT.md`, `USER-TESTING.md` and the design skill) is written in English. The storefront stays in Arabic: interface text, product and category data, the static pages in `src/content/pages`, and validation and error messages.
