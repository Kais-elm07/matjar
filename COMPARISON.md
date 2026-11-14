# Comparing my store with ShopBoard

- **Reference:** [yaman3bd/shopboard-reference](https://github.com/yaman3bd/shopboard-reference), read at commit `e2693e7` on November 14, 2026.
- **My project:** Matjari (متجري), this repository. I compared it at commit `7caf2b9`, then made the changes listed under "What I take" (commits `a619120` to `6f01508`).

## How I studied it

1. **I ran it first.** `npm install`, `cp .env.example .env.local`, `npm run dev`. I clicked through the home page, the products page (category, search and sort, all in the URL), a product page, the cart, the checkout (first empty, to see the messages, then with the demo card) and the success page, then `/products/999` and an unknown address. I wrote a review with the word "spam": it showed at once, disappeared when the API refused it, and my text went back into the form.
2. **I tried the API states** by changing `NEXT_PUBLIC_API_URL` and restarting:
   - `/api/delay/3000`: the product page's skeleton arrived after about 150 ms, the full page after about 6 seconds.
   - `/api/fail/500`: each route showed its own error with "Try again", but the home page was replaced as a whole (see "What I did better").
   - `/api/empty`: the lists came back empty, and both the products page and the home page said "No products match" with a "Clear filters" button.
3. **I read it in the README's order:** the README, `CLAUDE.md`, `DESIGN.md`, `package.json`, the folders, then the reviews feature from the form to the API and back (`review-form.tsx` → `review-section.tsx` → `optimistic.ts` → `api.ts` → `lib/api-client.ts` → `app/api/[...path]/route.ts`), then `git log`: 10 commits, one per layer (setup, UI kit, API, shared code, layout), then one per feature.
4. **I ran its checks.** `typecheck` and `lint` pass. `format:check` fails on 108 files on Windows, because Git turns the line endings into CRLF and the repository has no `.gitattributes`.

The two projects are not the same size. The reference has 96 source files and keeps its data in JSON files; mine has about 300, a PostgreSQL database, an admin panel and a 3D mascot. So I compared how each area is built, not how much there is.

## Structure

**What I did.** At first the code was grouped by layer, then by feature: `src/components/<feature>` for what the visitor sees and `src/lib/<feature>` for the logic, with the stores in `src/lib/state`. One feature was spread over two or three folders: the wishlist's store, page and heart button lived in three.

**What the reference does.** One folder per feature, `modules/<name>/`, holding `types.ts`, `schema.ts`, `api.ts`, `store.ts` and `components/`. Files are named for their job, not for the module, and `app/` holds thin pages only. The import rules are written down, but not checked: its products import the cart's button, and its cart imports the products.

**What I take, and why.** Taken. Each feature now has one folder, `src/modules/<feature>` (catalog, listing, search, cart, wishlist, checkout, home, content, mascot, admin, share-images), with its logic at the top and its components in `components/`, and files named for their job (`store.ts`, `schema.ts`, `actions.ts`). `src/lib` holds only general tools. I went one step further: ESLint fails on an import that goes up the layers (`app` → `components/layout` → `modules` → `components/shared` → `components/ui` → `lib`), so the rule can't be broken by accident. To explain a feature, I now open one folder.

## API client

**What I did.** There is no single client, because most of my data never travels over HTTP: the server pages read the catalog from the database through a cache, and the orders and coupons go through Server Actions. The browser downloads JSON in three places (the products API, `/cart-catalog.json` and `/similar-products.json`), all through `jsonLoader()`: one request per visit, a type guard on the answer, and a new try after a failure.

**What the reference does.** Every request goes through `api<T>()`, the only file that calls `fetch`, with an `ApiError` that carries the HTTP status. Its best teaching tool is the **demo switches**: `/delay/3000`, `/fail/500` or `/empty` in the base URL shows every loading, error and empty state without touching the code.

**What I take, and why.**

- **Taken: demo switches.** The products API and the two data files accept `?delay=3000`, `?fail=500` and `?empty=1` (`src/lib/demo-switches.ts`), and `NEXT_PUBLIC_DEMO_SWITCHES` puts the whole store in one state under `pnpm dev`. Unlike the reference, the live store ignores them, so nobody can slow it down, and an empty answer never empties the visitor's cart or wishlist.
- **Still to do: an error that carries its status** in `jsonLoader()`, so the search can tell "you are offline" from "the server failed".

## Types and schemas

**What I did.** The catalog's types are in `src/modules/catalog/types.ts`, the rows as the database keeps them in `rows.ts`, and `build.ts` turns them into the catalog. Zod checks the data files, the checkout form and every Server Action argument. Data read at runtime goes through type guards, and Zod is imported only from `src/lib/zod.ts`.

**What the reference does.** Plain types in each module's `types.ts`: what the API sends (`ApiProduct`) and what the app uses (`Product`), joined by one mapper. Zod only for forms. It trusts its own API's shape.

**What I take, and why.** Little. Splitting the shape that arrives from the shape the app uses is the same idea as my `rows.ts` → `build.ts`. I keep checking data at runtime, because my browser can receive JSON from an older deploy's cached copy.

## State

**What I did.** Zustand stores, now in their features (`src/modules/cart/store.ts`, `wishlist/store.ts`, `mascot/store.ts`). The saved ones have a `version`, save data only, check what they read with a guard, and keep working in memory when the browser blocks storage. Filters, sort and page live in the URL. A cart line keeps a copy of its price and stock, refreshed from `/cart-catalog.json`; the server prices every order again.

**What the reference does.** The cart saves only `productId` and `quantity`, and prices are joined when the cart is drawn, so every price has one copy. Its README has a **"Who owns which state"** table.

**What I take, and why.**

- **Taken: the "Who owns which state" table**, in my README, so every piece of state and the reason for its owner are in one place.
- **Not the cart that keeps ids only.** The copy lets the cart panel open with photos and prices on any page without a request, and the refresh tells the visitor what changed. The cost is a second copy of each price, which the server never trusts.

## Forms

**What I did.** react-hook-form with `zodResolver`, one schema built from the shipping cities, with Arabic messages that say what to do. The Server Action `placeOrder` checks the **same schema** again, prices the order from the database, and refuses a total that differs from the one the visitor saw; a request id keeps a repeated confirmation from saving two orders.

**What the reference does.** react-hook-form with `zodResolver`, one schema per form, and shadcn's `Field` for every field. When the API refuses a review, `form.reset(values)` gives the text back. The reviews use `useOptimistic` with a pure reducer.

**What I take, and why.**

- **Still to do: shadcn's `Field` parts** instead of my two field components (`CheckoutField` and `AdminField`), which do the same job in two ways.
- **Later: `useOptimistic` with a pure reducer**, when I add data the server owns, such as a wishlist saved in the database.

## Loading, error and not-found

**What I did.** The catalog and help pages are built ahead of time, so they have nothing to wait for. The parts that depend on the browser show skeletons while the saved cart is read. Every part loaded with `next/dynamic` sits inside `Optional`, so a part whose code can't be downloaded is left out instead of taking the page down.

**What the reference does.** Every route that fetches has a `loading.tsx` and an `error.tsx`, a `not-found.tsx` where it reads an id, and one `ErrorMessage` component that logs the error.

**What I take, and why.**

- **Taken: one error component that logs.** `ErrorMessage` (`src/components/shared/error-message.tsx`) draws the store's error pages and writes the error to the console; the two pages used to repeat the same markup and log nothing.
- **Taken, with a lesson: `loading.tsx`.** The admin panel shows a skeleton while it reads the database. I added one to the order page too, and my browser tests caught a bug: the skeleton streams first, which fixes the status at 200, so an unknown order answered 200 instead of 404. The order page has none now, and the rule is in `CLAUDE.md`.
- **Still to do: a not-found page for products**, which says the product left the store, instead of the general 404.

## UI kit and tokens

**What I did.** shadcn/ui (`base-nova` on Base UI, with `rtl: true`), adapted to the store. The identity is in `DESIGN.md`, checked for color contrast before each commit that changes it and in CI.

**What the reference does.** The same shadcn style, using more of its parts as they are (`Field`, `Empty`, `Card`, `AlertDialog`), and a rule against arbitrary values like `h-[32rem]`.

**What I take, and why.** Still to do: the "no arbitrary values" rule. My components have about 60 arbitrary sizes and spacings, and several have a value on Tailwind's scale.

## Tooling

**What I did.** pnpm, ESLint with no warnings allowed (no `any`, `as` or `!`, keys from the data, one component per file, and now the layers), Prettier, Husky with lint-staged, knip for unused code, Vitest for unit and database tests, Playwright on three browser engines, and GitHub Actions on every push.

**What the reference does.** npm, ESLint with `consistent-type-assertions` set to `never`, Prettier, Husky with lint-staged, and `typecheck`. No tests and no CI.

**What I take, and why.** Still to do: the rule `consistent-type-assertions` instead of my two hand-written selectors, and `pnpm typecheck` in the commit hook, which neither project runs today.

## CLAUDE.md

**What I did.** An `AGENTS.md` with the project's rules, written in long paragraphs, and no `CLAUDE.md`.

**What the reference does.** `CLAUDE.md` imports `AGENTS.md`, then lists short rules and a section of **"Rules from mistakes we fixed"**.

**What I take, and why.** Taken. `CLAUDE.md` imports `AGENTS.md` and lists 16 rules, each from a mistake this store really made, such as the line break Netlify adds to `<head>`, pages left stale after `revalidateTag`, orders saved twice, and the 404 that a skeleton turned into a 200. `AGENTS.md` gained a "Project structure" section. The README now starts with what the store does, the guides for changing the store moved to `EDITING.md`, and the planning document `PLAN.md` is gone.

## What I did better

- **The orders are real.** The reference's checkout returns a total and a random order number but saves nothing and never lowers the stock, and its success page shows whatever the URL says: `/checkout/success?order=MADEUP&total=1` printed "You paid $0.01". My orders are saved in PostgreSQL in one transaction, the stock goes down only while it covers the quantity, a repeated confirmation saves one order, one address can save 10 orders an hour (counted under a lock), and `/orders/<id>/` reads the order back.
- **Data from outside is checked.** The reference's `api<T>()` assigns `JSON.parse(text)`, which is `any`, to `T`: a cast its "no `as`" rule can't see. My downloaded JSON and saved stores go through type guards.
- **One set of form rules.** The reference writes the review and checkout rules twice, in the form and in the API. My Server Action uses the form's schema.
- **Empty states say why.** The reference shows "No products match... Clear filters" even on the home page of an empty store. My listings tell apart no match for the filters, no result for a search word, and an empty category.
- **A broken part stays a part.** With `/api/fail/500`, the reference's whole home page became "Something went wrong", though its hero needs no data. My lazy parts sit inside `Optional`.
- **Tests and CI.** Unit tests, database tests and browser tests on three engines, phones included, run by GitHub Actions with the build on every push. The reference has none.
- **The rules are enforced.** One component per file, keys from the data and the layers are ESLint errors in my project; in the reference they are only written, and its own `app/page.tsx` holds two components.
- **It works on every system.** My `.gitattributes` keeps LF line endings; the reference's formatting check fails on 108 files after cloning on Windows.
- **The design is the store's own.** My `DESIGN.md` describes my store's identity; the reference's is an analysis of another company's website (Clay.com).

## My grade

**9 / 10.**

**What earns it.** The store does much more than the task asked, and does it carefully: real orders, a server that checks everything the browser sends, strict types and layers enforced by ESLint, tests at three levels with CI, and measured performance. After this comparison it also has what the reference did better: one folder per feature, demo switches for every state, a shared error component, `CLAUDE.md` with rules from my mistakes, and a README that starts with the store.

**What costs the last point.**

- **It is harder to explain than the reference.** About 300 source files against 96, with a 3D mascot, share images and an admin panel the task didn't ask for. The new structure helps, but the amount is the same.
- **My first 15 commit messages are in Arabic**, against the course's rule; they stay in the history.
- **Small items are still open:** shadcn's `Field` instead of my two field components, fewer arbitrary Tailwind values, a not-found page for products, and `pnpm typecheck` in the commit hook.
