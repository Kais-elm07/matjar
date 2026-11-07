# Matjari (متجري): a demo Arabic online store

An Arabic (right-to-left), mobile-first online storefront built with Next.js and run by a Next.js server. The catalog pages are prepared at build time, and the server answers everything else.
The storefront itself is in Arabic for Arabic-speaking shoppers. The project documentation is in English.
The full plan and implementation phases are in [PLAN.md](PLAN.md).

**Current status:** Phases 1 to 7 are complete: the project scaffold, the full catalog (categories, products, search, filters), the cart and wishlist in the browser, the demo checkout, the static pages, polish (share images, performance, copy and accessibility review, light motion, optional analytics) and automated tests. Items that only the owner can do are still open: a review on a real phone, testing with real people, and real contact details. On November 4, 2026 the interface was redesigned at the owner's request in the "Warm Night" style: a dark background, a single orange accent for actions and prices, dark product cards with a round cart button in the corner, a dark header with a wide search field, a footer ending in an orange bar, and real product photos from Pexels instead of drawn placeholders (details in `DESIGN.md`). For phase 8 (deployment) the hosting settings (`netlify.toml`) and the [DEPLOYMENT.md](DEPLOYMENT.md) guide are ready, and the owner postponed the deployment itself. On November 4 and 5, 2026 the code was reviewed for quality, performance and load capacity: strict types, one component per file, English code comments, a design polish, a faster first screen on phones, and folders and names that say what they hold (see "Project structure", "How the code fits together" and "Performance and load capacity"). On November 6, 2026 the interface moved to the "Spotlight" identity at the owner's request (phase 10 of the plan): a dark stage with a blue tint and a single electric blue, every product photo cut out of its background, a light behind each product that takes the product's own color, photos that turn in 3D as they move, and the same look on the cards, the category tiles and the product page (details in `DESIGN.md`). On November 6 and 7, 2026 the store got a 3D mascot at the owner's request (phase 11 of the plan): Najm (نجم), a small blue dog in the corner of every page, who follows the visitor with his eyes, carries what they add to the cart and suggests similar products (see "Najm, the mascot"). On November 7, 2026 the store moved to a Next.js server at the owner's request (phase 12 of the plan): a products API, a PostgreSQL database for the orders, orders checked and saved by the server with a page for each one, and coupons that stay on the server (see "Products API", "Database" and "Checkout and orders"). The chosen host is Netlify. The GitHub Actions checks pass.

## Requirements

- Node.js 22 or later
- pnpm 12: `npm install -g pnpm`
- PostgreSQL 16 installed on the machine, for the orders database (only the tools are needed: `pnpm db:start` runs its own instance)

## Running locally

```bash
pnpm install
cp .env.example .env
pnpm db:start
pnpm db:deploy
pnpm db:seed
pnpm dev
```

Then open http://localhost:3000

`pnpm db:start` starts a local PostgreSQL for the store on port 5433, `pnpm db:deploy` creates its tables, and `pnpm db:seed` fills the catalog tables from `src/data`. The pages read the catalog from the database, so the store pages need it running.

The route types that pages and layouts use (`PageProps`, `LayoutProps`) are generated into `.next/types`, which is not in Git. After cloning, run `pnpm dev` or `pnpm typecheck` once, or the editor reports them as missing.

## Building for deployment

```bash
pnpm build
pnpm start
```

The first command builds the site into `.next/`: the catalog pages, the share images and the data files are prepared there once. The second runs the production server on http://localhost:3000, exactly as it will run once deployed.

Deployment steps on Netlify, the variables the server needs (`NEXT_PUBLIC_SITE_URL`, `DATABASE_URL` and `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`) and what to do after deploying are in [DEPLOYMENT.md](DEPLOYMENT.md). Security and caching headers are set in `next.config.ts` (`headers()`), so every host gets the same ones.

## Commands

| Command              | What it does                                                                                    |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| `pnpm dev`           | Run the site for development with instant reload on every change                                |
| `pnpm build`         | Build the site for production into `.next/`                                                     |
| `pnpm start`         | Run the production server on the build, as it runs once deployed                                |
| `pnpm images`        | Process images and measure each photo's color (runs before `dev`, `build`)                      |
| `pnpm images:photos` | Download the original Pexels photos behind the demo cut-outs, if missing                        |
| `pnpm fonts`         | Subset the font files from `assets/fonts` into `src/fonts`                                      |
| `pnpm db:start`      | Start the local PostgreSQL database (set up the first time), port 5433                          |
| `pnpm db:stop`       | Stop it; `pnpm db:status` says whether it runs                                                  |
| `pnpm db:migrate`    | After changing `prisma/schema.prisma`: write a migration and apply it                           |
| `pnpm db:deploy`     | Apply the migrations that haven't run yet (on the host, before each build)                      |
| `pnpm db:seed`       | Fill an empty catalog from `src/data`; `--force` writes it over the products with the same slug |
| `pnpm db:generate`   | Generate the Prisma client (runs by itself after `pnpm install`)                                |
| `pnpm db:studio`     | Browse and edit the database's tables in the browser                                            |
| `pnpm lint`          | ESLint, where any warning counts as an error                                                    |
| `pnpm typecheck`     | Check types, after generating the route types (`next typegen`)                                  |
| `pnpm knip`          | Find files, exports and packages that nothing uses any more                                     |
| `pnpm check`         | Check formatting, lint errors, types, the design file and unused code                           |
| `pnpm verify`        | `pnpm check` plus the unit tests: the full check before saving or deploying                     |
| `pnpm test`          | Unit tests (Vitest), in seconds                                                                 |
| `pnpm test:db`       | Database tests: saving orders and lowering the stock, against the local database                |
| `pnpm test:e2e`      | Browser tests (Playwright) against the production server                                        |
| `pnpm design:lint`   | Validate `DESIGN.md` and its color contrast                                                     |
| `pnpm format`        | Format every file automatically                                                                 |

## Database

PostgreSQL, through [Prisma](https://www.prisma.io) 7. It keeps the orders, and the catalog: categories, products, their photos and their variants.

- `pnpm db:seed` (`prisma/seed.ts`) validates `src/data` with the build's rules and writes it to the catalog tables, in one transaction, with prices in halalas and each photo's measured tone from `public/images/image-meta.json` (it runs `pnpm images` first). It does nothing when the database already has products, so it never overwrites the store owner's changes; `pnpm db:seed --force` writes the `src/data` products over the ones with the same slug, for the local database and the tests. The Netlify build runs it, so a new database is filled on its first deploy.

- The tables are described in `prisma/schema.prisma`, and every change to them is a migration in `prisma/migrations`, kept in Git. After editing the schema, run `pnpm db:migrate`, which writes the migration and applies it locally, then `pnpm db:generate` (Prisma 7 no longer regenerates the client during a migration).
- The client is generated into `src/generated/prisma` (not in Git), and the code reaches it only through `getDb()` in `src/lib/db.ts`, on the server, with at most two connections per server process.
- The pages don't ask the database on every visit. `src/lib/catalog/load.ts` reads the whole catalog in one go and keeps the rows in Next.js's data cache under the tag `catalog`; the pages, `/cart-catalog.json`, `/similar-products.json` and the sitemap built from it are kept too. They are prepared by `pnpm build`, refreshed after a day (so ended deals reprice) or when the tag is revalidated (after every order, since it lowers the stock), and a product or category added later is drawn on its first visit. The share images are the exception: they are drawn by `pnpm build` from the photos in `public/images`, which the server's functions don't carry, so they read the database outside the cache (`getBuildCatalog`) and stay as built until the next deploy. While the database is down, the saved pages and the products API keep answering; only placing an order and `/api/health/` need it.
- `GET /api/health/` answers `{ "status": "ok", "database": "up" }`, or 503 when the server can't reach the database.
- The Prisma CLI reads `prisma7.config.ts` (the name Prisma 7 looks for), which loads `DATABASE_URL` from `.env`.

## Editing products and categories

The products and categories live in the database; `src/data` holds the store's starting catalog, which `pnpm db:seed` writes into an empty database, and the home page, shipping, coupons and reviews, which the code reads directly. After editing the products or categories in `src/data`, run `pnpm db:seed --force` to write them into the local database. The live database keeps its own copy: an admin panel to edit it is the next steps of phase 13 (`PLAN.md`).

- **Categories:** `src/data/categories.ts`. A subcategory names its parent's slug in `parent`. A category's cover on its tile is a product photo: set it in `image`, such as `/images/products/portable-speaker-2`, or leave it out to show the first photo of the category's most popular product.
- **Products:** `src/data/products.ts`. Prices are in riyals, and `optionMatrix` generates every size and color combination automatically, with optional price or stock overrides for a single value or a full combination.
- **Slugs:** lowercase English with dashes, such as `classic-cotton-shirt`, because they work on every host.

Any data mistake, such as a duplicate slug, a missing category, or a compare-at price lower than the price, stops the build with an Arabic message that names the product and the field.

## Editing the home page

- **Slides and promo cards:** `src/data/home.ts`. Each card only names a product or category slug, and the image, price and discount are filled in automatically.
- **Limited-time deals:** give a product `saleEndsAt: "2026-12-31"` (the last day of the offer) and a compare-at price. It appears in the deals section with a real countdown and leaves the section after that date. When the site is rebuilt after the end date, the price returns to the compare-at price.
- **Customer reviews:** `src/data/testimonials.ts`. The section stays hidden while the list is empty, so only add real reviews with their authors' permission.
- **Trending and best sellers:** calculated automatically from `popularity` in the products file.

## Cart and wishlist

Both are saved in the visitor's browser (localStorage), so they survive closing the browser but do not move to another device.

- A visitor cannot add more than the variant's stock, or more than 10 pieces of a single variant.
- If the browser blocks storage, the cart keeps working in memory for the visit, and corrupted saved data is discarded instead of breaking the page.
- After every new deployment the cart is matched against `/cart-catalog.json`, which is generated at build time: prices and stock are refreshed, sold-out or removed items are dropped, and the visitor sees a notice describing what changed.
- Adding a product is confirmed at once: Najm catches it when he is on screen, otherwise the cart panel opens.

## Najm, the mascot

Najm (نجم, "star") is a small glossy blue dog in 3D, drawn with [three.js](https://threejs.org) from simple shapes in code, so there is no model file to download. He stands in the corner of every page on the start side (the WhatsApp button is on the other side), with no background, and lets every tap through to the page. His look and rules are in `DESIGN.md` (Mascot).

- **On each page:** he greets the visitor on the home page once per visit. On product lists, search, product pages and the wishlist his cart stands beside him: when a product is added, its photo flies from the pressed button into his paws, he throws it into his basket, and his speech bubble names it and suggests two similar products that aren't in the cart yet, with "View cart". On the cart page he says how many pieces the cart holds, and takes out whatever the visitor deletes. On the checkout form he stays quiet, and on the confirmation page he celebrates and sends his cart off with the order.
- **Suggestions** come from `/similar-products.json`, written at build time from the same "similar products" the product page shows (up to four in-stock products per product).
- **Hiding him:** "Hide Najm" in his greeting, and a button in the footer that hides him or brings him back. The choice is saved in the browser.
- **Speed:** his code (about 150 KB compressed, mostly three.js) downloads only after the page has loaded and the visitor first moves, touches or scrolls, and only if the browser can draw WebGL 2. Drawing stops a few seconds after the visitor stops moving, and while the tab is hidden.
- **Reduced motion:** he stands still, doesn't follow the pointer, and products appear in his basket at once; his bubbles still speak.
- **Renaming him or changing what he says:** `mascotName` in `src/config/site.ts`, and his sentences in `src/lib/mascot/messages.ts`.

## Products API

The server answers JSON about the catalog on every request (`src/app/api/products`, built by `src/lib/api/products.ts`). Prices are in halalas (1 riyal = 100 halalas), and every address ends with `/`: without it the server answers with a 308 redirect to the address with the slash.

| Request                                   | Answer                                                                                 |
| ----------------------------------------- | -------------------------------------------------------------------------------------- |
| `GET /api/products/`                      | `{ items, total }`: every product card with its search text                            |
| `GET /api/products/?q=قميص`               | Only the products that match the words, in the same order as the store's search box    |
| `GET /api/products/?category=men`         | Only the products of a category and its subcategories; 404 for an unknown category     |
| `GET /api/products/classic-cotton-shirt/` | The full product: description, specs, photos, options and every variant with its stock |
| `GET /api/products/no-such-product/`      | 404 with `{ "error": "المنتج غير موجود" }`                                             |

The store's own search box, search page and wishlist load `GET /api/products/` once per visit and match in the browser at every key press. A cache may keep an answer only while it checks with the server (`Cache-Control: public, max-age=0, must-revalidate`).

## Checkout and orders

A single page with four steps: contact details, address, shipping method, and cash on delivery, with an order summary and a coupon field.

- **Placing an order:** confirming calls the Server Action `placeOrder` (`src/lib/checkout/actions.ts`). The server checks the form again with the same rules, rebuilds the lines from the database by SKU, read at that moment rather than from the cache (its own names, prices and stock, never the browser's), applies the coupon, and refuses the order if the total differs from the one the visitor saw. It then saves the order and its lines with a short number such as `261107-4827` and lowers each variant's stock, all in one transaction: the stock goes down only while it still covers the quantity, so the last piece can't be sold twice, and an order with a line that ran out saves nothing. The catalog's tag is then revalidated, so the pages and `/cart-catalog.json` show the new stock (the next visitor may still get the saved copy while the new one is drawn). The cart is emptied, and the visitor goes to the order's page.
- **The order's page:** `/orders/<id>/`, read from the database on every request. The id is long and can't be guessed, so only whoever has the link sees the order; an unknown id gets the 404 page, and a database that can't be reached shows a message with "حاول مرة أخرى" (Try again). Najm celebrates once per order there.
- **Still a demo:** nothing is shipped and nobody pays, and the visitor is told so before and after confirming. The orders are in the database, where `pnpm db:studio` shows them.
- **Shipping:** `src/data/shipping.ts`: cities, delivery price and time in working days, the free shipping threshold, and the cities with express delivery.
- **Coupons:** `src/data/coupons.ts`: a percentage (with an optional cap), a fixed amount, or free shipping, with an optional order minimum. The codes stay on the server: the coupon field asks it about a code (`lookupCoupon`), and the checkout page receives only the shipping settings.
- **Validation:** Arabic messages under each field. The phone number uses the 05xxxxxxxx format and accepts Arabic digits, +966 and 00966.
- Any mistake in the shipping or coupon files, such as a duplicate city or a percentage above 100, stops the build with an Arabic message.

## Static pages and contact details

Each page is a text file in `src/content/pages`, and the file name is its URL: `about.md` appears at `/pages/about`. The current pages are about us, contact us, shipping and delivery, returns and exchanges, privacy policy, terms and conditions, and FAQ. Their content is customer-facing, so it stays in Arabic.

- **Front matter:** between two `---` lines, write `title`, `description` (for search engines) and `order` (position in the side menu). The optional `layout` field adds a special block: `contact` adds the contact cards, `shipping` adds the table of cities and prices from the shipping file, and `faq` turns the questions into an expandable list.
- **Text formatting:** a blank line between paragraphs, `## ` for a heading, `### ` for a subheading (a question on the FAQ page), `- ` for a bullet, `1. ` for a numbered step, `**text**` for bold, and `[link text](/pages/contact)` for links.
- **Values that update automatically:** `{store}` for the store name, `{email}`, `{phone}`, `{freeShipping}` for the free shipping threshold, and `{analytics}` for the privacy page's sentence about analytics.
- **Contact details:** in `src/config/site.ts` under `contact`. The current values are deliberately invalid placeholders: all-zero numbers and an address on the reserved `example.com` domain. Put your real details there, and leave any field empty (`""`) to hide its card. The floating WhatsApp button only appears when a number is set.
- **Announcement bar:** `announcement` in the same file, or `null` to hide it. Its text can use the same values as the pages, such as `{freeShipping}`.
- Every `/pages/...` link in the site menus must have a matching file, otherwise the build stops with a message naming the missing link.

## Share images

When a link is shared on WhatsApp or social networks, a 1200×630 image appears: each product has an image with its photo, name, price and discount badge, each category has one with its name and product count, and the rest of the site uses a general store image. A cut-out stands on its platform in the light of its tone, as on the site's stage.

- JPEG files are drawn at build time by the routes in `src/app/og` and served at `/og/...`, so they always follow the prices and names of the deployed build.
- The layout is in `src/lib/og/share-images.ts` and the drawing helpers are in `src/lib/og/render.ts`. Colors and font come from `DESIGN.md`.
- Text is drawn with TTF copies of the store font, generated by `pnpm fonts`.
- **Important when deploying:** set the real site URL in `NEXT_PUBLIC_SITE_URL` before building, because image links must be absolute. Without it they point to `localhost` and do not show up when shared.

## Analytics (optional)

The site has no analytics for now. To enable a cookie-free tool, set this in `src/config/site.ts`:

- `analytics: { provider: "plausible", domain: "example.com" }` for [Plausible](https://plausible.io), or
- `analytics: { provider: "umami", websiteId: "..." }` for [Umami](https://umami.is).

The script loads after the page has finished loading, so it does not slow it down, and the analytics paragraph in the privacy page updates automatically to name the tool.

## Adding images

1. Remove the photo's background, so the product stands alone on a transparent background (a cut-out), and save it as PNG or WebP, at least 1200 pixels on its long side, with the product in the middle and no text on it. Any tool works: remove.bg, the "Remove Background" of photo editors, or the open-source [`@imgly/background-removal-node`](https://github.com/imgly/background-removal-js) model that cut out the demo photos on the developer's computer. A regular photo still works: it stands in a frame instead of floating.
2. Put it in `assets/images/products/` with a name such as `classic-cotton-shirt-1.png`.
3. In the products file, write the path without an extension, `/images/products/classic-cotton-shirt-1`, or use `productImages("classic-cotton-shirt", 2)`.
4. When running or building, the image is converted automatically to WebP at 200, 400, 600, 800 and 1200 pixels wide (WebP keeps the transparent background), and the browser picks the right size for the visitor's screen. `pnpm images` also measures the photo's main color into `public/images/image-meta.json`, and the site turns it into the light behind the product (DESIGN.md: the product's tone). A black or white product has no clear color and takes the store's blue. To choose the light yourself, give the image a color in the products file: `{ src: "/images/products/x-1", tone: "#c2410c" }`.

The `public/images` folder is generated automatically and is not committed to Git, so never put images there by hand. A category's cover is one of the product photos (see "Editing products and categories"). A production build stops with a list of any image that the data mentions but that does not exist.

The current images are free real photos from [Pexels](https://www.pexels.com/license/) (their license allows changing them and using them without attribution), with their backgrounds removed, shown until they are replaced by your own product photos with the same names. Each photo's Pexels ID is recorded in `assets/images/sources.json`, and `pnpm images:photos` downloads the original photo, with its background, of any product photo that is missing.

## Font

The font is IBM Plex Sans Arabic in three weights, with the original files in `assets/fonts`. `pnpm fonts` removes every character the store does not need and writes the result to `src/fonts`, which shrinks the font from 190 KB to 66 KB.

- Characters kept: Arabic with diacritics and punctuation, the digits 0-9 and basic Latin letters. The list is at the top of `scripts/fonts.mjs`.
- If you need other characters, such as those of a new language, add them to the list and run `pnpm fonts`.
- The files in `src/fonts` are committed because the build needs them, so do not edit them by hand: WOFF2 files for the site, and TTF files with the same characters for drawing text in share images.
- The Arabic file is preloaded with the page, and the digits and Latin file loads when first needed, so neither competes with images at the start of loading.

## Design system (DESIGN.md)

The whole visual identity is described in [DESIGN.md](DESIGN.md), in [Google's DESIGN.md format](https://github.com/google-labs-code/design.md): colors, type, spacing, corner radii and components, with the reason behind each value.

- It is the reference Claude reads before any interface work, through the project skill `.claude/skills/design-system`.
- `pnpm design:lint` validates the file and its color contrast, and runs automatically in GitHub Actions and before each commit that changes it.
- To change the identity: edit `DESIGN.md` first and lint it, then copy the colors into `src/app/globals.css`, `OG_COLORS` in `src/lib/og/render.ts` (share images), `BRAND_HEX` in `src/lib/tone.ts` (the light behind photos without a clear color), `themeColor` in `src/app/layout.tsx` and `src/app/icon.svg`. The full checklist is at the end of `.claude/skills/design-system/SKILL.md`.

## Where to change...

| What you want to change                  | File                                                              |
| ---------------------------------------- | ----------------------------------------------------------------- |
| Store name, description, currency, links | `src/config/site.ts`                                              |
| Home slides and promo cards              | `src/data/home.ts`                                                |
| Shipping cities, prices, free shipping   | `src/data/shipping.ts`                                            |
| Discount coupons                         | `src/data/coupons.ts`                                             |
| Static page text                         | `src/content/pages`                                               |
| Contact details and announcement bar     | `src/config/site.ts` (`contact` and `announcement`)               |
| Analytics                                | `src/config/site.ts` (`analytics`)                                |
| Share image layout                       | `src/lib/og/share-images.ts`                                      |
| Brand colors and corner radii            | `DESIGN.md`, then the files listed under "Design system"          |
| Option swatch colors (red, blue...)      | `src/lib/catalog/options.ts`                                      |
| Arabic font                              | `assets/fonts`, then `pnpm fonts`, and `src/app/layout.tsx`       |
| Site icon                                | `src/app/icon.svg`                                                |
| A category's cover photo                 | `image` in `src/data/categories.ts`                               |
| The light behind one product photo       | `tone` on the image in `src/data/products.ts`                     |
| Najm's name and what he says             | `src/config/site.ts` (`mascotName`), `src/lib/mascot/messages.ts` |

## Changing the country

The store is set up for Saudi Arabia for now (decision 1 in the plan). Another country touches these places:

- `src/config/site.ts`: the currency (`currency`: its code, symbol and decimal places), the time zone (`utcOffset`, which decides when a deal ends), and the contact numbers.
- `src/data/shipping.ts`: the cities, prices and delivery times.
- `src/data/coupons.ts`: the coupon descriptions, which name the currency.
- `src/lib/checkout/form-schema.ts`: the mobile number rule (05xxxxxxxx, also accepting +966 and 00966) and its Arabic messages.
- `playwright.config.ts`: the locale of the browser tests (`ar-SA`).

## Project structure

The code is grouped by feature. Each part of the store has a folder in `src/components` for what the visitor sees and, when it has logic of its own, a folder with the same name in `src/lib` (listing, search, checkout, content).

```
src/app/                       the pages (Next.js App Router)
  layout.tsx, globals.css      the root layout (fonts, metadata) and the Tailwind theme and utilities
  (store)/                     store pages: home, category, product, all products, search, cart, wishlist,
                               checkout, static pages
  not-found.tsx                the 404 page, inside the store shell
  sitemap.ts, robots.ts        the sitemap and robots file
  api/products/                the products API: the product list and one product by its slug
  api/health/                  whether the server reaches the database
  cart-catalog.json/           the current price and stock of every variant, a static JSON file
  similar-products.json/       the similar products Najm suggests, a static JSON file
  og/                          share images for every product, category and the site (JPEG, written at build time)

src/components/
  ui/                          base components from shadcn/ui, adapted to the store (button, dialog, sheet, tabs)
  layout/                      the page frame: StoreShell, header, category menu, mobile menu, footer, bottom tab bar
  global/                      mounted once for the whole site: analytics, toast messages, restoring the saved
                               cart and wishlist, listening to URL changes, rendering every section after a move
  shared/                      small pieces many pages use: breadcrumbs, swiped rows, the stage (the light behind
                               a product and the photo on its platform), photo boxes, empty states, section
                               headings, structured data (JSON-LD)
  home/                        the home page sections, one file per section
  product/                     product card, grid and row, and the product page: gallery, option picker,
                               purchase buttons, tabs
  listing/                     product lists: filters, sorting, pagination, active filters
  search/                      the search box with its suggestions, and the search results page
  cart/                        cart panel, cart and wishlist pages, quantity stepper
  checkout/                    checkout form (one component per step), order summary, an order's confirmation
  content/                     static pages: their text, contact cards, shipping table, FAQ
  mascot/                      Najm: his lazy loader, his canvas and speech bubble, his suggestions, the footer
                               button that hides him, and the hooks that tie him to the cart and the pages

src/lib/
  catalog/                     products and categories (see the table below)
  listing/                     filtering, sorting and pages in the browser, and the listing pages' URL
  search/                      Arabic search: normalizing text, matching products, loading the search index
  state/                       what the browser remembers: the cart, the wishlist, open panels and whether Najm
                               is hidden (Zustand stores)
  mascot/                      Najm's logic: his behavior on each page, his sentences, the suggestions, and
                               scene/, his 3D drawing with three.js (his body, his cart, his poses and moves)
  checkout/                    shipping, coupons, totals, the checkout form rules, the Server Actions, and
                               building, saving and reading orders
  content/                     the static pages: reading and checking them, their text format, and the values
                               such as {store} that fill them
  og/                          share image layout and drawing
  routes.ts                    the addresses of the product, category and static pages
  db.ts                        the database client (Prisma), on the server only
  zod.ts                       Zod, set up once (Arabic messages, no eval): import z from here
  json-loader.ts               loads JSON from the site once per visit, and checks its shape
  api/                         the answers of the API routes in src/app/api
  money.ts                     prices in halalas, and formatting them
  dates.ts                     today's date and deal end times in the store's time zone
  arabic-plural.ts             Arabic plural forms for counts
  arabic-digits.ts             Arabic and Persian digits to 0-9
  seo.ts                       share metadata and structured data for search engines
  image-loader.ts              picks the right prepared image size for the screen
  guards.ts                    type guards for data read at runtime (JSON files, browser storage)
  toast.ts                     toast messages, whose library loads with the first message
  render-later.ts              the script that renders every section at once after a reload or "back"
  slider.ts                    the slide in view, scrolling to a slide, and the stage's 3D turn and light during a swipe
  tone.ts                      the product's tone: a photo's color as the light behind it (OKLCH), and its CSS variables
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
tests/unit/, tests/e2e/        unit tests (Vitest) and browser tests (Playwright)
next.config.ts                 Next.js settings: image sizes, security and caching headers
netlify.toml                   Netlify build settings
.github/workflows/ci.yml       automated checks in GitHub Actions
.claude/skills/                skills for Claude: the design system, and Vercel's React guides
```

`src/lib/catalog` holds everything about products and categories. Files that run only on the server (while pages are built, and in the running server) import `server-only`, so importing them from browser code fails the build:

| File                   | Job                                                                                                         | Runs                   |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------- |
| `types.ts`             | The types of the data files and of the built catalog                                                        | Both                   |
| `define.ts`            | Helpers for writing the products file (`productImages`, `optionMatrix`)                                     | Server                 |
| `schema.ts`            | Rules for every field in the category and product files, with Arabic messages                               | Server                 |
| `validate.ts`          | Checks the two files together (duplicate slugs, missing categories, duplicate variants)                     | Server                 |
| `rows.ts`              | The catalog as the database keeps it, and the conversion from the files (prices in halalas, photo tones)    | Both                   |
| `file-rows.ts`         | The rows from `src/data`, validated: what `pnpm db:seed` writes and the unit tests read                     | Server                 |
| `image-meta.ts`        | Reads the photo colors `pnpm images` measured, for the seed                                                 | Seed (Node)            |
| `load.ts`              | Reads the catalog from the database once, through Next.js's data cache (tag `catalog`)                      | Server (`server-only`) |
| `build.ts`             | Builds the catalog from the rows: category paths and covers, sorted lists, expired deals, photo looks       | Server                 |
| `catalog.ts`           | The read functions the pages and the products API use                                                       | Server (`server-only`) |
| `home.ts`              | Home page sections and promo cards                                                                          | Server (`server-only`) |
| `cards.ts`             | The card data that reaches the browser, with as few fields as possible                                      | Server                 |
| `options.ts`           | Option names and color swatches                                                                             | Both                   |
| `variant-key.ts`       | The key that ties a cart line to its options                                                                | Both                   |
| `guards.ts`            | Checks the JSON the browser downloads (the products API and two data files), and the photo colors file      | Both                   |
| `variant-selection.ts` | Choosing a variant on the product page: the matching variant, which values can be chosen, the color's photo | Browser                |

## How the code fits together

Most pages are prepared once by `pnpm build`. The server then sends them as they are and answers the products API, and the browser only adds what depends on the visitor.

**On the server** (server components, route handlers, and the files that import `server-only`), at build time and in the running server:

1. The database holds the categories and products, with prices in halalas; `pnpm db:seed` fills it from `src/data` after checking the files (`schema.ts`, `validate.ts`), so any mistake there stops with an Arabic message. `src/data` also holds the home page, shipping and coupons, which the code reads directly; the shipping and coupon files go through the same kind of check in `src/lib/checkout/config.ts`.
2. `src/lib/catalog/load.ts` reads the catalog's rows through Next.js's data cache, and `build.ts` builds the catalog from them: category paths and covers, expired deals back to their old price, every photo's look, and, during `next build`, a check that every image exists.
3. The pages in `src/app/(store)` read the catalog through `src/lib/catalog/catalog.ts` and `home.ts`, and pass client components only the fields they need (`cards.ts`).
4. The products API (`src/app/api/products`) answers from the same cached catalog on every request. Two routes write JSON files at build time and again when the catalog changes: `/cart-catalog.json` (the current price and stock of every variant) and `/similar-products.json` (Najm's suggestions). The share images in `src/app/og` are drawn at build time only, and kept until the next deploy.

**In the browser** (client components, marked `"use client"`):

- Listing pages arrive with every product of the category in the HTML. Filters, sorting and pages then run in the browser (`src/lib/listing`), reading the URL through `useListingQuery()`.
- Search downloads every product card from the products API (`/api/products/`) the first time it is needed, and matches products in Arabic in the browser (`src/lib/search`). The API runs on the server, on the same catalog the pages were built from.
- The cart and wishlist are Zustand stores saved in localStorage (`src/lib/state`). When the cart or checkout opens, the cart is checked against `/cart-catalog.json`, so prices and stock are current.
- Checkout checks the form (`src/lib/checkout/form-schema.ts`) and calculates the totals (`totals.ts`) from the shipping settings the page received. Coupons and orders go through Server Actions (`actions.ts`): the server checks everything again, prices the order from the catalog and saves it (`orders.ts`), and the order's page reads it back.
- Panels that open on a tap (the cart, the mobile menu, image zoom, the filter sheet and toast messages) load their code once the page has loaded (`src/hooks/use-idle.ts`).
- The hero and the product gallery are stages: during a swipe, `useStageMotion` writes each photo's 3D turn and the blend of the light straight to CSS variables on every frame, without rendering React again (`src/hooks/use-stage-motion.ts`, with the arithmetic in `src/lib/slider.ts`).
- Najm is loaded by `LazyMascot` in the store shell. `MascotScene` (`src/lib/mascot/scene`) draws him with three.js and queues his moves; React only holds his speech bubble. The add-to-cart buttons tell him about a new product through `announceAddedProduct` (`src/lib/mascot/events.ts`), which doesn't import three.js, and open the cart panel when he isn't listening. He watches the cart store for removals, and the page address for his behavior on each page (`src/lib/mascot/persona.ts`).

## Tests

- **Unit tests** (`pnpm test`, in `tests/unit`): price formatting, Arabic search (hamza forms, taa marbuta, Arabic and Persian digits and letters), plural forms, filters and sorting and their URLs, the cart, its matching with current prices and its safe storage, shipping and coupons, the checkout form and order building, the product-writing helpers, deal expiry, data file validation, the product's tone (with a check that white text keeps a contrast of 7:1 on the light of every hue), the photo colors file, the stage's swipe arithmetic, and Najm's logic (his behavior on each page, his suggestions, his sentences and the saved choice to hide him). They run in seconds, so run them after any change in `src/lib` or `src/data`.
- **Database tests** (`pnpm test:db`, in `tests/db`): save orders against the local database: the stock goes down with the order, two orders for the last piece leave one of them refused, and an order with a line out of stock saves nothing. They put back every stock and order they touch.
- **Browser tests** (`pnpm test:e2e`, in `tests/e2e`): they start by writing the catalog from `src/data` into the local database again (`pnpm db:seed --force`), since every order lowers the stock, then open the built site and act like a visitor: browsing, search, filtering and sorting, picking a size and color, the gallery's arrows and thumbnails, the light of the product page's stage following the chosen color, the cart, checkout with a coupon and express delivery (and the stock the store shows going down after the order), the wishlist, the mobile menu, the 404 page, and Najm catching an added product, suggesting similar ones and hiding from the footer. Every other test starts with Najm hidden (`storageState` in `playwright.config.ts`), so adding to the cart opens the cart panel there. Najm's tests are skipped in a browser without WebGL 2. Run `pnpm build` first.
- **Devices:** a desktop with Chrome, a Galaxy S24 phone with the Chrome engine (like Samsung Internet), an iPhone 15 with the Safari engine, and a desktop with Firefox. Locally the installed Chrome is used, and Firefox is added with `E2E_FIREFOX=1 pnpm test:e2e`. The first time on a new machine: `pnpm exec playwright install webkit firefox`.
- The tests do not depend on specific product names, so they stay valid when the demo data is replaced.
- **Testing with real people:** the tasks and the feedback table are in [USER-TESTING.md](USER-TESTING.md).

## Quality

- Before every Git commit the code is formatted and linted automatically (Husky and lint-staged), and `DESIGN.md` is linted when it changes. Any ESLint warning blocks the commit.
- ESLint also rejects `any`, type assertions (`as`), non-null assertions (`!`) and array positions used as list keys. Data the code reads at runtime is checked with the type guards in `src/lib/guards.ts` and `src/lib/catalog/guards.ts` instead of being assumed, and Zod is imported from `src/lib/zod.ts`, where it is set up once.
- Each component lives in its own file, named after it, with a `<Component>Props` interface for its props. Only the compound components in `src/components/ui` (such as a dialog and its parts) share a file.
- Code comments, test names, CI step names and commit messages are in English. The interface, the product data and the messages the store owner reads stay in Arabic.
- Claude follows Vercel's React guides for performance and component structure: the skills `vercel-react-best-practices` and `vercel-composition-patterns` in `.claude/skills`, copied unchanged from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (MIT).
- knip (`pnpm knip`, part of `pnpm check` and GitHub Actions) fails when a file, an export or a package is no longer used. `knip.jsonc` lists the two it cannot see because only a config file uses them.
- `pnpm verify` runs every check plus the unit tests in one command.
- On every push to `main` and every pull request, GitHub Actions checks formatting, lint errors, types and unused code, runs the unit tests, builds the site, then runs the browser tests against the production server on Chrome, Firefox and Safari (WebKit). It keeps the test report for a week when something fails.

## Performance and load capacity

**Most of the site is prepared once.** The home, listing, category, product and help pages, the share images and the data files below are built once with `pnpm build`. The server sends them as they are, without rendering them again for each visitor, and a content delivery network such as Netlify's can keep copies close to visitors. Only what depends on the request runs on each visit.

**The data the browser requests** comes from the products API and two files prepared at build time:

| Address                  | Size   | When it loads                                                                    |
| ------------------------ | ------ | -------------------------------------------------------------------------------- |
| `/api/products/`         | 15 KB  | On the first focus of the search field, and on the search and wishlist pages     |
| `/cart-catalog.json`     | 5.3 KB | Only when the cart or the checkout page opens, to check current prices and stock |
| `/similar-products.json` | 21 KB  | When Najm appears, for his suggestions (1.5 KB compressed)                       |

Each one loads once per visit and is shared by every part of the page. A network failure does not break the cart: it stays as it was saved, and search shows a message with a retry button.

**Local load test** (November 4, 2026, when the store was still a static site): a simple single-process file server on the development machine itself, with mixed simultaneous requests for pages, scripts, images and the two data files. This is far weaker than a real delivery network; what matters is that the site needs no computation per visit:

| Simultaneous visitors | Duration   | Requests | Requests per second | 95% of requests within | Errors |
| --------------------- | ---------- | -------- | ------------------- | ---------------------- | ------ |
| 200                   | 20 seconds | 39,011   | 1,944               | 174 ms                 | 0      |
| 1,000                 | 20 seconds | 39,245   | 1,923               | 865 ms                 | 0      |

With 1,000 visitors the wait gets longer but no request fails, because the server only sends ready-made files.

**Lighthouse on mobile** (November 7, 2026, on the production server (`pnpm start`) on the development machine, simulating a mid-range phone on a slow 4G network; four runs per page):

| Page         | Performance | Accessibility | Best practices | SEO |
| ------------ | ----------- | ------------- | -------------- | --- |
| Home         | 89-90       | 100           | 100            | 100 |
| Product page | 87-89       | 100           | 100            | 100 |
| All products | 86-87       | 100           | 100            | 100 |

The same day, the last static version (phase 11) measured 90, 72-86 and 80-85 on the same pages, so the server is on par with it. On these three pages the largest element is a photo, and Lighthouse counts every file loaded and all the JavaScript run before it appears, most of it React and Next.js themselves; a page whose largest element is text, such as a help page or a category page, measures 97-100. Before the Spotlight design and Najm (November 5), the static site measured 92-93, 91-92 and 88-89.

**Lazy loading and lighter pages:**

- **Images:** every image is prepared in five WebP sizes (200, 400, 600, 800 and 1200 pixels wide), and the browser takes the smallest size that fits the screen. Images further down the page load as the visitor approaches them. Only the first photo of the hero and of the product gallery is in the page's HTML, with high priority; the other slides load once the page has loaded, or as soon as they are shown.
- **Sections further down:** on the home and product pages, the sections below the first screen and the footer are laid out and painted only when they come near the screen (`section-later` and `render-later` in `src/app/globals.css`). After a reload, back or forward, or a move inside the store, everything renders at once, so the browser returns to the same place (`src/lib/render-later.ts`).
- **Drawers and panels:** the cart, the mobile menu, the image zoom, the filter sheet and the toast messages load their code after the page appears or on the first tap (`src/hooks/use-idle.ts`). The phone filter sheet never loads on desktop, and vice versa.
- **Najm:** his code with three.js (607 KB, 152 KB compressed) is a separate file that no page loads with its HTML. It downloads only after the page has loaded and the visitor first moves, touches or scrolls (`src/hooks/use-first-interaction.ts`), so it doesn't count against the first screen, and not at all for a visitor who hid him or a browser without WebGL 2. He draws only while something moves, and stops a few seconds after the visitor does.
- **As little JavaScript as possible:** components are rendered ahead of time, only the interactive part runs in the browser, and it receives only the fields it needs (the cart button on a card does not carry the whole product). Buttons and inputs are native elements without a library.
- **Font:** a subset with only the store's characters (66 KB for the three weights).
- **Caching:** JavaScript and CSS files are cached in the browser for a year (their names change with every edit, and Next.js sets this itself), images for a day and share images for an hour (`headers()` in `next.config.ts`).

**As the store grows:** listing pages send the cards of every product in the category with the page so filters work instantly, without asking the server. That is fine up to a few hundred products per category. The list that search downloads (`/api/products/`) grows by about 0.75 KB per product (about 150 KB compressed for a thousand products). Beyond that, search can ask the server for the matches only (`/api/products/?q=`, which already exists), and the listings can load their products page by page.

## Important technical notes

- **Prepared pages and a server:** the catalog and help pages list the addresses they know (`generateStaticParams`), so they are built once; the product and category pages also draw a new slug on its first visit (`dynamicParams = true`), and any other address gets the 404 page. The data files, the share images, the sitemap and robots.txt are route handlers marked `force-static`, built once too; all but the share images and robots.txt are refreshed with the catalog. The site uses the classic rendering model of Next.js, not Cache Components.
- **Trailing slash:** every address ends with `/` (`trailingSlash` in `next.config.ts`), and the server redirects an address without it with a 308. Addresses of files with an extension, such as `/cart-catalog.json`, are left alone.
- **Search and filters run in the browser:** listing pages are prepared as HTML without filters for search engines, then the URL's filters apply right after loading (`src/lib/listing/url-query.ts`).
- **Images:** a custom loader (`src/lib/image-loader.ts`) picks from the copies `pnpm images` prepares, so the server never resizes images and no request waits for one to be drawn.
- **Drawers load after the page:** the cart drawer, the mobile menu, the image zoom, the filter sheet and the toast messages load their code after the content appears (`src/hooks/use-idle.ts`), or immediately if requested earlier. This is what lifted mobile performance above 90. Tabs are a light component without a library (`src/components/ui/tabs.tsx`).
- **What the server carries:** server code reads files only by a literal path (`public/images/image-meta.json`), and the product photos are left out of the server's files (`outputFileTracingExcludes`), so a deployed function holds only the code it runs. The image check runs only during `next build`.
- **Server and browser code:** a `"use client"` module can't hand functions to server code, so what both sides need (totals, the quantity limit) lives in plain modules in `src/lib/checkout`.
- **Drawing share images:** runs on a single thread and a single queue per build, because the font library inside sharp sometimes crashed on Windows when drawing in parallel.
- **Long Windows command lines:** the project folder has a long Arabic name, so the pre-commit hook passes files to lint-staged in batches (`--max-arg-length` in `.husky/pre-commit`).
- **Documentation for this exact Next.js version** is in `node_modules/next/dist/docs`.
