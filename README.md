# Matjari (متجري): an Arabic online store

An Arabic online store, right to left and made for phones first, built with Next.js and run by a Next.js server with a PostgreSQL database. It is a demo: nothing is sold or shipped, and the visitor is told so. It runs at https://matjrii.netlify.app.

The storefront is in Arabic; the code and its documentation are in English.

## What the store does

- **Catalog:** categories and subcategories, product pages with sizes, colors and a photo gallery, deals with a real end date, and a share image for every product and category.
- **Finding products:** filters, sorting and pages kept in the address, and an Arabic search that understands hamza forms, taa marbuta and Arabic digits.
- **Cart and wishlist:** saved in the browser, and checked against the current prices and stock.
- **Checkout:** one page in four steps, with shipping, coupons and cash on delivery. The server checks and prices every order, saves it in the database with a page of its own, and lowers the stock.
- **Admin panel** at `/admin/`: the store owner adds and edits products and categories, changes the stock, hides products and uploads photos, with no deploy.
- **Najm (نجم):** a 3D mascot who catches what the visitor adds to the cart and suggests similar products.
- **Help pages:** about us, contact, shipping, returns, privacy, terms and FAQ, each a text file.

**Built with:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui on Base UI, Zustand, react-hook-form with Zod, Prisma 7 with PostgreSQL, and three.js; Vitest and Playwright for the tests; Netlify and Supabase for hosting.

## Running it

You need Node.js 22 or later, pnpm 12 (`npm install -g pnpm`) and PostgreSQL 16's tools on the machine (`pnpm db:start` runs its own database).

```bash
pnpm install
cp .env.example .env
pnpm db:start
pnpm db:deploy
pnpm db:seed
pnpm dev
```

Then open http://localhost:3000. `pnpm db:start` starts a local PostgreSQL on port 5433, `pnpm db:deploy` creates its tables, and `pnpm db:seed` fills the catalog from `src/data`. The route types that pages use (`PageProps`, `LayoutProps`) are generated into `.next/types`, which is not in Git, so run `pnpm dev` or `pnpm typecheck` once after cloning.

`pnpm build` then `pnpm start` run the production server, as it runs once deployed. Putting it online (Netlify, Supabase, and the variables the server needs) is in [DEPLOYMENT.md](DEPLOYMENT.md).

### See every state

The products API and the two data files the browser loads (`/cart-catalog.json`, `/similar-products.json`) take demo switches in their address, like the course's API. They work under `pnpm dev`; the live store ignores them (`src/lib/demo-switches.ts`).

| Address                     | What comes back                                               |
| --------------------------- | ------------------------------------------------------------- |
| `/api/products/?delay=3000` | The normal answer, after 3 seconds (10 at most)               |
| `/api/products/?fail=500`   | That error, with `{ "error": "..." }`                         |
| `/api/products/?empty=1`    | No products; `/similar-products.json?empty=1`: no suggestions |

To see the whole store in one state, put a switch in `.env` and restart `pnpm dev`:

| `NEXT_PUBLIC_DEMO_SWITCHES` | What you see                                                                                       |
| --------------------------- | -------------------------------------------------------------------------------------------------- |
| `""`                        | The normal store                                                                                   |
| `"delay=3000"`              | Skeletons on the search and wishlist pages; the cart shows its saved lines until the check answers |
| `"fail=500"`                | Search and wishlist errors with "إعادة المحاولة" (Try again); the cart keeps its saved lines       |
| `"empty=1"`                 | Search finds nothing, Najm suggests nothing, and the wishlist says the store has no products       |

`?empty=1` doesn't empty `/cart-catalog.json`, which would take every line out of the visitor's cart, and an empty answer never empties the wishlist. The order's page reads the database instead, and shows its error page when the database can't be reached.

## Commands

| Command               | What it does                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| `pnpm dev`            | Run the site for development with instant reload on every change                                |
| `pnpm build`          | Build the site for production into `.next/`                                                     |
| `pnpm start`          | Run the production server on the build, as it runs once deployed                                |
| `pnpm images`         | Process images and measure each photo's color (runs before `dev`, `build`)                      |
| `pnpm images:photos`  | Download the original Pexels photos behind the demo cut-outs, if missing                        |
| `pnpm fonts`          | Subset the font files from `assets/fonts` into `src/fonts`                                      |
| `pnpm db:start`       | Start the local PostgreSQL database (set up the first time), port 5433                          |
| `pnpm db:stop`        | Stop it; `pnpm db:status` says whether it runs                                                  |
| `pnpm db:migrate`     | After changing `prisma/schema.prisma`: write a migration and apply it                           |
| `pnpm db:deploy`      | Apply the migrations that haven't run yet (on the host, before each build)                      |
| `pnpm db:seed`        | Fill an empty catalog from `src/data`; `--force` writes it over the products with the same slug |
| `pnpm db:generate`    | Generate the Prisma client (runs by itself after `pnpm install`)                                |
| `pnpm admin:password` | Make the admin panel's password hash and session secret, for `.env` and the host                |
| `pnpm db:studio`      | Browse and edit the database's tables in the browser                                            |
| `pnpm lint`           | ESLint, where any warning counts as an error                                                    |
| `pnpm typecheck`      | Check types, after generating the route types (`next typegen`)                                  |
| `pnpm knip`           | Find files, exports and packages that nothing uses any more                                     |
| `pnpm check`          | Check formatting, lint errors, types, the design file and unused code                           |
| `pnpm verify`         | `pnpm check` plus the unit tests: the full check before saving or deploying                     |
| `pnpm test`           | Unit tests (Vitest), in seconds                                                                 |
| `pnpm test:db`        | Database tests: saving orders and lowering the stock, against the local database                |
| `pnpm test:e2e`       | Browser tests (Playwright) against the production server                                        |
| `pnpm design:lint`    | Validate `DESIGN.md` and its color contrast                                                     |
| `pnpm format`         | Format every file automatically                                                                 |

## Project structure

Each feature of the store has one folder in `src/modules`, holding its logic and, in `components/`, what the visitor sees of it. To explain or change a feature, open its folder.

| Feature                 | Folder                     | What it holds                                                                                                            |
| ----------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Products and categories | `src/modules/catalog`      | Reading the catalog from the database, the data rules, the products API's answers, the product card, grid and page       |
| Product lists           | `src/modules/listing`      | Filters, sorting and pages, kept in the URL, and the list pages                                                          |
| Search                  | `src/modules/search`       | Arabic search: normalizing text, matching cards, the search index, the search box and the results page                   |
| Cart                    | `src/modules/cart`         | The cart's store, its sync with the current prices, the quantity limit, the cart panel and page, the add-to-cart buttons |
| Wishlist                | `src/modules/wishlist`     | Its store, its page and its heart button                                                                                 |
| Checkout and orders     | `src/modules/checkout`     | The form and its steps, shipping, coupons, totals, `placeOrder`, saving and reading orders, and the order's page         |
| Home page               | `src/modules/home`         | The home page's sections                                                                                                 |
| Help pages              | `src/modules/content`      | Reading the pages in `src/content/pages`, the contact cards, the FAQ and the shipping table                              |
| Najm, the mascot        | `src/modules/mascot`       | His behavior on each page, his sentences and suggestions, his 3D scene, his store and his components                     |
| Admin panel             | `src/modules/admin`        | Signing in, reading and writing the catalog, uploading photos, and the panel's forms                                     |
| Share images            | `src/modules/share-images` | The images drawn for shared links: their layouts and the drawing helpers                                                 |

Inside a feature, files are named for their job, not for the feature: `store.ts` (its Zustand store), `schema.ts` (its form rules), `types.ts`, `guards.ts`, `actions.ts` (its Server Actions) and `api.ts` (the answers of its API routes), and its components in `components/`, one per file. The orders are part of checkout, because saving the order is checkout's last step.

### Layers

```
src/app                 the routes: each page reads its data and renders a feature's components
src/components/layout   the page frame: StoreShell, the header, menus, footer and bottom bar, and what the shell mounts once
src/modules             the features, which may use each other
src/components/shared   pieces many features use: breadcrumbs, swiped rows, the stage, empty states, error messages, rich text
src/components/ui       base components from shadcn/ui, adapted to the store
src/lib, src/hooks      general tools and React hooks that know no feature
```

Each layer imports only from the layers under it, and `src/lib`, `src/hooks` and `src/components/shared` may import a feature's types (`import type`), never its code. ESLint fails on an import that goes up (`eslint.config.mjs`).

### Pages

| Address                                        | Page                                                                   | Feature          |
| ---------------------------------------------- | ---------------------------------------------------------------------- | ---------------- |
| `/`                                            | Home                                                                   | `home`           |
| `/products/`                                   | All products                                                           | `listing`        |
| `/category/<slug>/`                            | A category and its subcategories                                       | `listing`        |
| `/product/<slug>/`                             | A product                                                              | `catalog`        |
| `/search/`                                     | Search results                                                         | `search`         |
| `/cart/`                                       | The cart                                                               | `cart`           |
| `/wishlist/`                                   | The wishlist                                                           | `wishlist`       |
| `/checkout/`                                   | Checkout                                                               | `checkout`       |
| `/orders/<id>/`                                | A placed order                                                         | `checkout`       |
| `/pages/<slug>/`                               | A help page: about us, contact, shipping, returns, privacy, terms, FAQ | `content`        |
| `/admin/`                                      | The admin panel: products, `/admin/categories/`, `/admin/login/`       | `admin`          |
| `/api/products/`, `/api/products/<slug>/`      | The products API                                                       | `catalog`        |
| `/api/health/`                                 | Whether the database, the photo tools and the storage work             | (its route only) |
| `/cart-catalog.json`, `/similar-products.json` | Data the browser loads: current prices and stock, Najm's suggestions   | `cart`, `mascot` |
| `/og/...`                                      | Share images                                                           | `share-images`   |

### Who owns which state

| State                       | Owner                                                                      | Why there                                                                                 |
| --------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Products, categories, stock | The database, read through Next.js's cache (`getCatalog()`)                | One copy for every page; every order and every save in the admin panel expires the cache  |
| Cart lines                  | `useCartStore` (`src/modules/cart/store.ts`), saved in the browser         | The header, the panel and three pages need it, and it survives a refresh                  |
| Wishlist                    | `useWishlistStore` (`src/modules/wishlist/store.ts`), saved in the browser | The header, every product card and its page need it                                       |
| Najm shown or hidden        | `useMascotPreferences` (`src/modules/mascot/store.ts`), saved              | The visitor's choice lasts between visits                                                 |
| Which pop-up is open        | `useUiStore` (`src/lib/ui-store.ts`)                                       | The header, the bottom bar and the add-to-cart buttons open the same panels               |
| Filters, sort and page      | The URL (`src/modules/listing/params.ts`, read with `useListingQuery()`)   | A filtered list can be shared, and back and forward work                                  |
| Checkout fields             | `CheckoutView`, through `useCheckoutForm()` (react-hook-form)              | Only the form needs them                                                                  |
| Order totals                | Computed (`src/modules/checkout/totals.ts`), never stored                  | The browser shows a preview; the server computes them again and refuses a different total |
| Placed orders               | The database (`src/modules/checkout/orders-db.ts`)                         | The order's page reads them back                                                          |

A cart line keeps a copy of its product's name, photo, price and stock, so the cart panel opens at once on any page; `/cart-catalog.json` refreshes the copy when the cart or the checkout opens, and the server prices every order from the database.

### The page frame and the pages

```
RootLayout (src/app/layout.tsx)                  Analytics, LazyToaster, RenderAllAfterNavigation
└─ StoreLayout ((store)/layout.tsx)
   └─ StoreShell (components/layout)
      ├─ AnnouncementBar, SiteHeader             SearchBox, CategoryMenu, cart and wishlist counts
      ├─ <page>
      │  ├─ /                 HeroSlider, TrustStrip, PromoGrid, BestSellers, ... (modules/home)
      │  ├─ /products/, /category/<slug>/        ListingView (modules/listing) → ProductGrid → ProductCard
      │  ├─ /product/<slug>/  ProductDetails, ProductTabs, ProductRail (modules/catalog)
      │  ├─ /search/          SearchView (modules/search) → ListingView
      │  ├─ /cart/            CartView (modules/cart)
      │  ├─ /wishlist/        WishlistView (modules/wishlist)
      │  ├─ /checkout/        CheckoutView (modules/checkout): ContactStep, AddressStep, ShippingStep, PaymentStep, OrderSummary
      │  ├─ /orders/<id>/     OrderConfirmation (modules/checkout)
      │  └─ /pages/<slug>/    RichText, HelpPagesNav, ContactCards, FaqList, ShippingTable
      ├─ SiteFooter, MobileTabBar, WhatsAppButton
      ├─ LazyMascot (modules/mascot), LazyCartSheet (modules/cart), LazyMobileNavSheet
      └─ SavedStoresRestorer, ListingUrlListener
```

### The other folders

```
src/app/                       the routes (Next.js App Router)
  layout.tsx, globals.css      the root layout (metadata) and the Tailwind theme and utilities
  fonts.ts                     the store's font, for the root layout and the last-resort error page
  (store)/                     the store's pages; error.tsx is the error page inside the store shell
  admin/                       the admin panel's pages
  not-found.tsx                the 404 page, inside the store shell
  global-error.tsx             the last-resort error page, when the store shell itself fails
  sitemap.ts, robots.ts        the sitemap and robots file
  api/products/, api/health/   the products API, and whether the server reaches its services
  cart-catalog.json/           the current price and stock of every variant, as JSON
  similar-products.json/       the similar products Najm suggests, as JSON
  og/                          share images for every product, category and the site (JPEG, drawn at build time)

src/lib/                       general tools
  db.ts                        the database client (Prisma), on the server only
  zod.ts                       Zod, set up once (Arabic messages, no eval): import z from here
  guards.ts                    type guards for data read at runtime (JSON files, browser storage)
  json-loader.ts               loads JSON from the site once per visit, and checks its shape
  demo-switches.ts             the ?delay=, ?fail= and ?empty=1 switches, to see the loading, error and empty states
  storage.ts                   browser storage that keeps working, in memory, when the browser blocks it
  saved-stores.ts              restores the stores saved in the browser after the first render
  ui-store.ts                  which pop-up is open: the cart panel, the mobile menu, the mobile search
  routes.ts                    the addresses of the product, category and static pages
  seo.ts                       share metadata and structured data for search engines
  money.ts                     prices in halalas, and formatting them
  dates.ts                     today's date and deal end times in the store's time zone
  arabic-plural.ts             Arabic plural forms for counts
  arabic-digits.ts             Arabic and Persian digits to 0-9
  text-format.ts               the small text format of product descriptions and help pages
  image-loader.ts              picks the right prepared image size for the screen, local or uploaded
  image-prepare.ts             a photo's five WebP copies and its measured tone, for pnpm images and the uploads
  tone.ts                      the product's tone: a photo's color as the light behind it (OKLCH), and its CSS variables
  slider.ts                    the slide in view, scrolling to a slide, and the stage's 3D turn and light during a swipe
  toast.ts                     toast messages, whose library loads with the first message
  render-later.ts              the script that renders every section at once after a reload or "back"
  contact.ts                   phone, WhatsApp and map links
  motion.ts                    smooth scrolling that respects the "reduce motion" setting
  placeholders.ts              keys for loading placeholders
  utils.ts                     cn(), which merges Tailwind classes
src/hooks/                     general React hooks: useIdle (after the page has loaded), useFirstInteraction
                               (the visitor's first move after that), useMediaQuery, and useStageMotion (the 3D
                               turn of a stage's photos and its light during a swipe)

src/data/                      the store's data: categories, products, home page, reviews, shipping, coupons
src/config/site.ts             general store settings
src/content/pages/             static page text (.md files, in Arabic)
src/fonts/                     the font files cut to the store's characters (written by pnpm fonts)
src/types/                     type declarations (CSS variables in style props)

assets/                        original images and fonts, before processing
scripts/                       image and font processing, demo photo download, the local database
prisma/                        the database tables (schema.prisma) and their migrations
src/generated/prisma/          the Prisma client, generated (not in Git)
tests/unit/, tests/db/, tests/e2e/  unit tests and database tests (Vitest), browser tests (Playwright)
next.config.ts                 Next.js settings: image sizes, security and caching headers
netlify.toml                   Netlify build settings
.github/workflows/ci.yml       automated checks in GitHub Actions
.claude/skills/                skills for Claude: the design system, and Vercel's React guides
AGENTS.md, CLAUDE.md           the rules for the code, and the rules learned from the store's mistakes
EDITING.md, DEPLOYMENT.md      changing the store's content and look, and putting it online
DESIGN.md                      the visual identity
```

### The catalog's files

`src/modules/catalog` holds everything about products and categories. Files that run only on the server (while pages are built, and in the running server) import `server-only`, so importing them from browser code fails the build:

| File                   | Job                                                                                                                   | Runs                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `types.ts`             | The types of the data files and of the built catalog                                                                  | Both                   |
| `define.ts`            | Helpers for writing the products file (`productImages`, `optionMatrix`)                                               | Server                 |
| `schema.ts`            | Rules for every field in the category and product files, with Arabic messages                                         | Server                 |
| `validate.ts`          | Checks the two files together (duplicate slugs, missing categories, duplicate variants)                               | Server                 |
| `rows.ts`              | The catalog as the database keeps it, and the conversion from the files (prices in halalas, photo tones)              | Both                   |
| `file-rows.ts`         | The rows from `src/data`, validated: what `pnpm db:seed` writes and the unit tests read                               | Server                 |
| `image-meta.ts`        | Reads the photo colors `pnpm images` measured, for the seed                                                           | Seed (Node)            |
| `load.ts`              | Reads the catalog from the database once, through Next.js's data cache (tag `catalog`)                                | Server (`server-only`) |
| `build.ts`             | Builds the catalog from the rows: category paths and covers, sorted lists, expired deals, photo looks                 | Server                 |
| `queries.ts`           | The read functions the pages and the products API use                                                                 | Server (`server-only`) |
| `api.ts`               | The answers of the products API (`src/app/api/products`)                                                              | Server (`server-only`) |
| `cards.ts`             | The card data that reaches the browser, with as few fields as possible                                                | Server                 |
| `options.ts`           | Option names and color swatches                                                                                       | Both                   |
| `variant-key.ts`       | The key that ties a cart line to its options                                                                          | Both                   |
| `guards.ts`            | Checks the JSON the browser downloads (the products API and two data files), and the photo colors file                | Both                   |
| `variant-selection.ts` | Choosing a variant on the product page: the matching variant, which values can be chosen, the color's photo           | Browser                |
| `components/`          | The product card, grid, row and mini card, and the product page: gallery, zoom, option picker, purchase buttons, tabs | Browser and server     |

## How the code fits together

Most pages are prepared once by `pnpm build`. The server then sends them as they are and answers the products API, and the browser only adds what depends on the visitor.

**On the server** (server components, route handlers, Server Actions, and the files that import `server-only`):

1. The database holds the categories and products, with prices in halalas (1 riyal = 100 halalas). `pnpm db:seed` fills it from `src/data` after checking the files (`schema.ts`, `validate.ts`), so a mistake there stops with an Arabic message. `src/data` also holds the home page, shipping and coupons, which the code reads directly; the shipping and coupon files are checked in `src/modules/checkout/config.ts`.
2. `src/modules/catalog/load.ts` reads the catalog's rows through Next.js's data cache (tag `catalog`), and `build.ts` builds the catalog from them: category paths and covers, expired deals back to their old price, every photo's look, and, during `next build`, a check that every image exists.
3. The pages in `src/app/(store)` read the catalog through `src/modules/catalog/queries.ts` and `src/modules/home/sections.ts`, and pass client components only the fields they need (`cards.ts`).
4. The products API, `/cart-catalog.json`, `/similar-products.json` and the sitemap are computed on every request from the same cached catalog, in milliseconds. The share images in `src/app/og` are drawn at build time only, and kept until the next deploy.

**In the browser** (client components, marked `"use client"`):

- Listing pages arrive with every product of the category in the HTML. Filters, sorting and pages then run in the browser (`src/modules/listing`), reading the address through `useListingQuery()`.
- Search downloads every product card from the products API the first time it is needed, and matches products in Arabic in the browser (`src/modules/search`).
- The cart and the wishlist are Zustand stores saved in localStorage. When the cart or the checkout opens, the cart is checked against `/cart-catalog.json`, so its prices and stock are current.
- Checkout checks the form (`src/modules/checkout/schema.ts`) and computes the totals (`totals.ts`) from the shipping settings the page received. Coupons and orders go through Server Actions (`actions.ts`): the server checks everything again, prices the order from the database and saves it (`orders-db.ts`), and the order's page reads it back.
- Panels that open on a tap (the cart, the mobile menu, image zoom, the filter sheet and toast messages) load their code once the page has loaded (`src/hooks/use-idle.ts`). Each of them, like Najm and the search suggestions, sits inside `Optional` (`src/components/shared/optional.tsx`): if its code doesn't arrive, that part alone is left out and the page keeps working.
- A page that fails shows an Arabic message inside the store's frame, with "حاول مرة أخرى" (Try again), through `ErrorMessage` (`src/components/shared/error-message.tsx`), which also writes the error to the console; an error in the frame itself falls back to `src/app/global-error.tsx`. The admin panel, which reads the database on every request, shows a skeleton meanwhile (`loading.tsx`). The store's pages that call `notFound()` have none, because a streamed skeleton would turn their 404 into a 200.
- The hero and the product gallery are stages: during a swipe, `useStageMotion` writes each photo's 3D turn and the blend of the light straight to CSS variables on every frame, without rendering React again (`src/hooks/use-stage-motion.ts`, with the arithmetic in `src/lib/slider.ts`).
- Najm is loaded by `LazyMascot` in the store shell. `MascotScene` (`src/modules/mascot/scene`) draws him with three.js and queues his moves; React only holds his speech bubble. The add-to-cart buttons tell him about a new product through `announceAddedProduct` (`src/modules/mascot/events.ts`), which doesn't import three.js.

## Data and orders

- **Database:** PostgreSQL through Prisma 7, with the orders and the catalog (categories, products, their photos and variants). The tables are in `prisma/schema.prisma` and every change is a migration in `prisma/migrations`. The client is generated into `src/generated/prisma` (not in Git), and the code reaches it only through `getDb()` in `src/lib/db.ts`, on the server.
- **The catalog's cache:** pages built from the catalog are kept, and drawn again after a day so ended deals reprice. Every order and every save in the admin panel expires them at once (`updateTag("catalog")` in the Server Action). While the database is down, the pages and the products API keep answering from the rows read last; only placing an order, the order's page, the admin panel and `/api/health/` need it.
- **Health:** `GET /api/health/` answers `{ "status": "ok", "database": "up", "photos": "up", "storage": "up" }`, or a 503.
- **Placing an order:** `placeOrder` checks the form again with the same rules, rebuilds the lines from the database by SKU (never from the browser's prices), applies the coupon, and refuses a total that differs from the one the visitor saw. It saves the order and lowers the stock in one transaction, only while the stock still covers the quantity, so the last piece can't be sold twice.
- **A cart behind the store:** a refusal over a sold-out product, missing pieces or a new price carries the cart's current prices and stock, which the checkout applies at once, naming the product.
- **One order per confirmation:** the checkout sends a request id with the order, which the database keeps unique, so a confirmation sent again after a lost answer gets the saved order back.
- **Limits:** one address may save 10 orders an hour, counted inside the saving transaction under a lock on the address (`takeAddressTurn`), so orders sent all at once can't pass together. An order holds at most 50 products, and every text field has a maximum length.
- **The order's page:** `/orders/<id>/`, with a long id that can't be guessed, read from the database on every request.

### Products API

Prices are in halalas, and every address ends with `/` (without it, the server redirects with a 308).

| Request                                   | Answer                                                                                 |
| ----------------------------------------- | -------------------------------------------------------------------------------------- |
| `GET /api/products/`                      | `{ items, total }`: every product card with its search text                            |
| `GET /api/products/?q=قميص`               | Only the products that match the words, in the same order as the store's search box    |
| `GET /api/products/?category=men`         | Only the products of a category and its subcategories; 404 for an unknown category     |
| `GET /api/products/classic-cotton-shirt/` | The full product: description, specs, photos, options and every variant with its stock |
| `GET /api/products/no-such-product/`      | 404 with `{ "error": "المنتج غير موجود" }`                                             |

## Tests

- **Unit tests** (`pnpm test`, `tests/unit`): prices, Arabic search, plural forms, filters and their addresses, the cart and its saved copy, shipping, coupons and the checkout form, what the server checks before saving an order, the data files' rules, the product's tone and its contrast, the stage's arithmetic, Najm's logic, and the demo switches.
- **Database tests** (`pnpm test:db`, `tests/db`): orders saved against the local database, the stock going down with them, the last piece sold once, a request sent twice saved once, and the hourly limit under orders sent all at once. They put back every stock and order they touch.
- **Browser tests** (`pnpm test:e2e`, `tests/e2e`): they write the catalog from `src/data` into the local database again, then use the built site like a visitor: browsing, search, filters, options, the gallery, the cart, checkout with a coupon, an order for more pieces than are left, the wishlist, the admin panel, the API and its demo switches, parts whose code can't be downloaded, the mobile menu, the 404 page and Najm. Run `pnpm build` first.
- **Devices:** a desktop with Chrome, a Galaxy S24 phone, an iPhone 15 with the Safari engine, and Firefox (`E2E_FIREFOX=1 pnpm test:e2e`). The first time on a new machine: `pnpm exec playwright install webkit firefox`.
- **Testing with real people:** the tasks and the feedback table are in [USER-TESTING.md](USER-TESTING.md).

## Quality

- Before every commit the staged files are formatted and linted (Husky and lint-staged), and `DESIGN.md` is checked when it changes. Any ESLint warning blocks the commit.
- ESLint rejects `any`, type assertions (`as`), non-null assertions (`!`), array positions used as list keys, more than one component per file, and an import that goes up the layers. Data read at runtime is checked with the type guards in `src/lib/guards.ts` and `src/modules/catalog/guards.ts`.
- knip (`pnpm knip`) fails when a file, an export or a package is no longer used, and `pnpm verify` runs every check plus the unit tests.
- On every push to `main`, GitHub Actions checks formatting, lint errors, types and unused code, runs the unit and database tests, builds the site, then runs the browser tests on Chrome, Firefox and Safari's engine.
- The rules for writing code here, and the rules learned from this store's mistakes, are in [AGENTS.md](AGENTS.md) and [CLAUDE.md](CLAUDE.md). Claude follows Vercel's React guides in `.claude/skills`, copied unchanged from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (MIT).

## Performance

**Lighthouse on mobile** (November 7, 2026, production server on the development machine, a mid-range phone on a slow 4G network, four runs per page):

| Page         | Performance | Accessibility | Best practices | SEO |
| ------------ | ----------- | ------------- | -------------- | --- |
| Home         | 89-90       | 100           | 100            | 100 |
| Product page | 87-89       | 100           | 100            | 100 |
| All products | 86-87       | 100           | 100            | 100 |

On these three pages the largest element is a photo; a page whose largest element is text, such as a help page, measures 97-100. The live site measured 95-96 on the home page, 90-94 on a product page and 93-94 on the products list.

- **Prepared once:** the catalog and help pages and the share images are built by `pnpm build` and sent as they are.
- **Data the browser loads, once per visit:** `/api/products/` (15 KB) on the first focus of the search field and on the search and wishlist pages, `/cart-catalog.json` (5.3 KB) when the cart or the checkout opens, and `/similar-products.json` (21 KB, 1.5 KB compressed) when Najm appears.
- **Images:** five WebP sizes of every photo, picked by a custom loader (`src/lib/image-loader.ts`), so the server never resizes one. Only the first photo of a slider is in the HTML.
- **Later on the page:** sections below the first screen are laid out only when they come near it (`section-later`, `render-later`), and the panels' code loads after the page appears.
- **Najm** (152 KB compressed, mostly three.js) downloads only after the visitor first moves, touches or scrolls, and never in a browser without WebGL 2.
- **Font:** a subset with only the store's characters (66 KB for three weights).
- **As the store grows:** listing pages carry every product of their category, which suits up to a few hundred per category; the search index grows by about 0.75 KB per product. Beyond that, search can ask the server for the matches only (`/api/products/?q=`, which already exists), and the listings can load page by page.

## Technical notes

- **Prepared pages and a server:** the catalog and help pages list the addresses they know (`generateStaticParams`); the product and category pages also draw a new slug on its first visit (`dynamicParams = true`), and any other address gets the 404 page. The site uses Next.js's classic rendering model, not Cache Components.
- **Trailing slash:** every address ends with `/` (`trailingSlash` in `next.config.ts`), except files with an extension, such as `/cart-catalog.json`.
- **Headers:** security and caching headers are set in `next.config.ts` (`headers()`), so every host gets the same ones.
- **Documentation for this exact Next.js version** is in `node_modules/next/dist/docs`.

## More documentation

- [EDITING.md](EDITING.md): changing the store's products, pages, images, font, colors, mascot and country.
- [DEPLOYMENT.md](DEPLOYMENT.md): putting the store online on Netlify with Supabase, and the errors met on the first deploy.
- [DESIGN.md](DESIGN.md): the visual identity, and [USER-TESTING.md](USER-TESTING.md): testing with real people.
- [AGENTS.md](AGENTS.md) and [CLAUDE.md](CLAUDE.md): the rules for the code, and the rules from the store's mistakes.
