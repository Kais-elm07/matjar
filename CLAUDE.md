@AGENTS.md

# Rules from mistakes we fixed

The project's rules are in `AGENTS.md`, above. Each rule below comes from a mistake this store really made: what went wrong, then the rule that keeps it from coming back.

## The page and the browser

- **Every page was drawn twice on phones** (React error #418): Netlify adds a line break and a comment after `<meta charSet>`, and an inline script in `<head>` made React throw the server's HTML away. Write nothing into `<head>` by hand; a script that must run before the page is drawn goes at the start of `<body>` (`RENDER_ALL_SCRIPT`).
- **One script that didn't download replaced the whole page** with Next's English "This page couldn't load", on a weak connection or in a tab left open across a deploy. Every part loaded with `next/dynamic` is rendered inside `Optional`.
- **The wishlist kept counting products that had been hidden**, so the header disagreed with the page. Lists saved in the browser are checked against the current store (`prune`), and an empty answer never empties them.
- **A refused order made the visitor reload the page** to see what had changed. The refusal carries the cart's current prices and stock (`cartIsBehind`), and the checkout applies them at once.

## Data, cache and orders

- **`/cart-catalog.json` kept the old stock after a real order on the live site**: on Netlify, the catalog's tag doesn't refresh a route handler prepared at build time. The data files and the sitemap are `force-dynamic`, computed from the cached catalog.
- **A product page reached by a link stayed outdated after a change**: `revalidateTag("catalog", "max")` only marks pages stale, and Next's prefetch served the stale page. A Server Action that changes products or stock ends with `updateTag(CATALOG_TAG)`.
- **A confirmation sent again after a lost answer could save a second order** and lower the stock twice. Every order carries a request id, which `placeOrder` looks up first, and its row is written before the stock goes down.
- **Orders sent all at once from one address passed the hourly limit together**, because they were counted before saving. A count that decides a write is made inside the write's transaction, under a lock (`takeAddressTurn`).

## Building and deploying

- **The server's files took in the whole project**, because a file was read by a computed path and Turbopack's file tracing followed it. Server code reads files by a literal path, and a check that runs only during `next build` is guarded by `NEXT_PHASE` and marked `turbopackIgnore`.
- **The second Netlify deploy couldn't find `@/generated/prisma/client`**: Netlify keeps `node_modules`, so pnpm skipped `postinstall`. The build command runs `pnpm db:generate` first.
- **Netlify's build couldn't reach the database** with Supabase's direct connection string, which answers only over IPv6. Use the session pooler's string, and mark only the variables the server reads at runtime as secret (`DEPLOYMENT.md`).
- **Drawing share images in parallel crashed the build on Windows** (the font library inside sharp). sharp runs on one thread and every drawing goes through one queue on `globalThis`. A local build can still crash now and then: run it again before looking for a bug.
- **The commit hook failed on Windows**, because the project's long Arabic path made the command line too long. `.husky/pre-commit` passes `--max-arg-length` to lint-staged.

## The repository

- **The first commit messages and comments were in Arabic**, against the course's rule. Documentation, comments, test names and commit messages are in English; only the storefront is Arabic.
- **A feature's files were spread over three folders** (`src/components/<feature>`, `src/lib/<feature>` and `src/lib/state`), which made it hard to explain. A feature keeps everything in `src/modules/<feature>`, and ESLint checks the layers between folders.
