# Matjari (متجري): a demo Arabic online store

An Arabic (right-to-left), mobile-first online storefront that runs as a fully static site, with no server and no database.
The storefront itself is in Arabic for Arabic-speaking shoppers. The project documentation is in English.
The full plan and implementation phases are in [PLAN.md](PLAN.md).

**Current status:** Phases 1 to 7 are complete: the project scaffold, the full catalog (categories, products, search, filters), the cart and wishlist in the browser, the demo checkout, the static pages, polish (share images, performance, copy and accessibility review, light motion, optional analytics) and automated tests. Items that only the owner can do are still open: a review on a real phone, testing with real people, and real contact details. On November 4, 2026 the interface was redesigned at the owner's request in the "Warm Night" style: a dark background, a single orange accent for actions and prices, dark product cards with a round cart button in the corner, a dark header with a wide search field, a footer ending in an orange bar, and real product photos from Pexels instead of drawn placeholders (details in `DESIGN.md`). For phase 8 (deployment) the hosting files (`public/_headers` and `netlify.toml`) and the [DEPLOYMENT.md](DEPLOYMENT.md) guide are ready, and the owner postponed the deployment itself. After that, a full review of code quality, performance and load capacity was carried out (see "Performance and load capacity"). The GitHub Actions checks pass.

## Requirements

- Node.js 22 or later
- pnpm 12: `npm install -g pnpm`

## Running locally

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Then open http://localhost:3000

## Building for deployment

```bash
pnpm build
pnpm preview
```

The first command creates the `out/` folder with the whole site, which is everything a host needs. The second serves it on http://localhost:3000 exactly as it will look once deployed.

Deployment steps for Cloudflare Pages, Netlify or regular hosting, and what to do after deploying (domain, HTTPS, sitemap, header checks), are in [DEPLOYMENT.md](DEPLOYMENT.md). Security and caching headers live in `public/_headers`, and both hosts read them automatically.

## Commands

| Command              | What it does                                                                |
| -------------------- | --------------------------------------------------------------------------- |
| `pnpm dev`           | Run the site for development with instant reload on every change            |
| `pnpm build`         | Build the static site into `out/`                                           |
| `pnpm preview`       | Serve the built site locally before deploying                               |
| `pnpm images`        | Process images (runs automatically before `dev` and `build`)                |
| `pnpm images:demo`   | Draw SVG placeholders for anything without a real photo                     |
| `pnpm images:photos` | Download the Pexels demo photos listed in `assets/images/sources.json`      |
| `pnpm fonts`         | Subset the font files from `assets/fonts` into `src/fonts`                  |
| `pnpm check`         | Check formatting, lint errors, types and the design file in one go          |
| `pnpm verify`        | `pnpm check` plus the unit tests: the full check before saving or deploying |
| `pnpm test`          | Unit tests (Vitest), in seconds                                             |
| `pnpm test:e2e`      | Browser tests (Playwright) against the built site                           |
| `pnpm design:lint`   | Validate `DESIGN.md` and its color contrast                                 |
| `pnpm format`        | Format every file automatically                                             |

## Editing products and categories

All data lives in `src/data`. Changes show up immediately with `pnpm dev`, and need `pnpm build` plus a new deployment to reach visitors.

- **Categories:** `src/data/categories.ts`. A subcategory names its parent's slug in `parent`.
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

- A visitor cannot add more than the stock written in the products file, or more than 10 pieces of a single variant.
- If the browser blocks storage, the cart keeps working in memory for the visit, and corrupted saved data is discarded instead of breaking the page.
- After every new deployment the cart is matched against `/cart-catalog.json`, which is generated at build time: prices and stock are refreshed, sold-out or removed items are dropped, and the visitor sees a notice describing what changed.

## Checkout (demo)

A single page with four steps: contact details, address, shipping method, and cash on delivery, with an order summary and a coupon field.

- **Demo only:** confirming generates an order number in the browser, shows a confirmation page and empties the cart. Nothing is sent anywhere, and the visitor is told so before and after confirming.
- **Data:** the order is kept only in the current tab (sessionStorage) to show the confirmation page, and is erased when the tab closes.
- **Shipping:** `src/data/shipping.ts`: cities, delivery price and time in working days, the free shipping threshold, and the cities with express delivery.
- **Coupons:** `src/data/coupons.ts`: a percentage (with an optional cap), a fixed amount, or free shipping, with an optional order minimum. On a static site any visitor can see the codes in the page source, so they are for demonstration only.
- **Validation:** Arabic messages under each field. The phone number uses the 05xxxxxxxx format and accepts Arabic digits, +966 and 00966.
- Any mistake in the shipping or coupon files, such as a duplicate city or a percentage above 100, stops the build with an Arabic message.

## Static pages and contact details

Each page is a text file in `src/content/pages`, and the file name is its URL: `about.md` appears at `/pages/about`. The current pages are about us, contact us, shipping and delivery, returns and exchanges, privacy policy, terms and conditions, and FAQ. Their content is customer-facing, so it stays in Arabic.

- **Front matter:** between two `---` lines, write `title`, `description` (for search engines) and `order` (position in the side menu). The optional `layout` field adds a special block: `contact` adds the contact cards, `shipping` adds the table of cities and prices from the shipping file, and `faq` turns the questions into an expandable list.
- **Text formatting:** a blank line between paragraphs, `## ` for a heading, `### ` for a subheading (a question on the FAQ page), `- ` for a bullet, `1. ` for a numbered step, `**text**` for bold, and `[link text](/pages/contact)` for links.
- **Values that update automatically:** `{store}` for the store name, `{email}`, `{phone}`, and `{freeShipping}` for the free shipping threshold.
- **Contact details:** in `src/config/site.ts` under `contact`. The current values are deliberately invalid placeholders: all-zero numbers and an address on the reserved `example.com` domain. Put your real details there, and leave any field empty (`""`) to hide its card. The floating WhatsApp button only appears when a number is set.
- **Announcement bar:** `announcement` in the same file, or `null` to hide it.
- Every `/pages/...` link in the site menus must have a matching file, otherwise the build stops with a message naming the missing link.

## Share images

When a link is shared on WhatsApp or social networks, a 1200×630 image appears: each product has an image with its photo, name, price and discount badge, each category has one with its name and product count, and the rest of the site uses a general store image.

- JPEG files are generated at build time into `out/og` (the routes live in `src/app/og`), so they always follow the current prices and names.
- The layout is in `src/lib/og/cards.ts` and the drawing helpers are in `src/lib/og/render.ts`. Colors and font come from `DESIGN.md`.
- Text is drawn with TTF copies of the store font, generated by `pnpm fonts`.
- **Important when deploying:** set the real site URL in `NEXT_PUBLIC_SITE_URL` before building, because image links must be absolute. Without it they point to `localhost` and do not show up when shared.

## Analytics (optional)

The site has no analytics for now. To enable a cookie-free tool, set this in `src/config/site.ts`:

- `analytics: { provider: "plausible", domain: "example.com" }` for [Plausible](https://plausible.io), or
- `analytics: { provider: "umami", websiteId: "..." }` for [Umami](https://umami.is).

The script loads after the page has finished loading, so it does not slow it down, and the analytics paragraph in the privacy page updates automatically to name the tool.

## Adding images

1. Put the original image in `assets/images/products/` with a name such as `classic-cotton-shirt-1.jpg`. A square image 1200 pixels wide or larger works best.
2. In the products file, write the path without an extension, `/images/products/classic-cotton-shirt-1`, or use `productImages("classic-cotton-shirt", 2)`.
3. When running or building, the image is converted automatically to WebP at 200, 400, 800 and 1200 pixels wide, and the browser picks the right size for the visitor's screen.

The `public/images` folder is generated automatically and is not committed to Git, so never put images there by hand. Category images go in `assets/images/categories/` the same way. A production build stops with a list of any image that the data mentions but that does not exist.

The current images are free real photos from [Pexels](https://www.pexels.com/license/) (their license allows use without attribution), shown until they are replaced by your own product photos with the same names. Each photo's Pexels ID is recorded in `assets/images/sources.json`, and `pnpm images:photos` downloads any that are missing. For any product or category without a photo, `pnpm images:demo` draws an SVG placeholder.

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
- To change the identity: edit `DESIGN.md` first, lint it, then copy the colors into `src/app/globals.css`.

## Where to change...

| What you want to change                  | File                                                        |
| ---------------------------------------- | ----------------------------------------------------------- |
| Store name, description, currency, links | `src/config/site.ts`                                        |
| Home slides and promo cards              | `src/data/home.ts`                                          |
| Shipping cities, prices, free shipping   | `src/data/shipping.ts`                                      |
| Discount coupons                         | `src/data/coupons.ts`                                       |
| Static page text                         | `src/content/pages`                                         |
| Contact details and announcement bar     | `src/config/site.ts` (`contact` and `announcement`)         |
| Analytics                                | `src/config/site.ts` (`analytics`)                          |
| Share image layout                       | `src/lib/og/cards.ts`                                       |
| Brand colors and corner radii            | `DESIGN.md`, then `src/app/globals.css` (`:root`)           |
| Option swatch colors (red, blue...)      | `src/lib/catalog/options.ts`                                |
| Arabic font                              | `assets/fonts`, then `pnpm fonts`, and `src/app/layout.tsx` |
| Site icon                                | `src/app/icon.svg`                                          |

## Project structure

```
assets/images/                 original product and category images, and sources.json with the Pexels IDs
assets/fonts/                  original font files before subsetting
scripts/                       image and font processing, demo photo download, build output fixes
public/_headers                security and caching headers for the host (copied into out/)
netlify.toml                   Netlify build settings
.github/workflows/ci.yml       automated checks in GitHub Actions
tests/unit/                    unit tests (Vitest)
tests/e2e/                     browser tests (Playwright)

src/app/(store)/               store pages: home, categories, products, search, cart, wishlist, checkout, static pages
src/app/not-found.tsx          the 404 page, inside the store shell
src/app/sitemap.ts robots.ts   sitemap and robots file (generated at build time)
src/app/search-index.json/     search index (a static JSON file generated at build time)
src/app/cart-catalog.json/     variant prices and stock for cart matching (a static JSON file)
src/app/og/                    share images for every product, category and the site (JPEG, generated at build time)

src/components/layout/         store shell (StoreShell), header, footer, mobile menu, bottom tab bar, search
src/components/home/           home page sections, one file per section
src/components/product/        product card and grid, gallery, variant picker, cart and wishlist buttons
src/components/listing/        product lists: filters, sorting, pagination, active filters, empty state
src/components/search/         search results page
src/components/cart/           cart drawer, cart and wishlist pages, quantity stepper
src/components/checkout/       checkout form and its fields, order summary, confirmation page
src/components/content/        contact cards, shipping table, FAQ
src/components/store/          shared components: carousels, section headings, breadcrumbs, empty states
src/components/ui/             base interface components (shadcn/ui)

src/config/site.ts             general store settings
src/content/pages/             static page text (.md files, in Arabic)
src/data/                      categories, products, home page, reviews, shipping and coupon data
src/lib/catalog/               the data layer (see the table below), Arabic search, filters, prices
src/lib/store/                 cart and wishlist in the browser (Zustand) and their safe storage
src/lib/checkout/              shipping, coupons, totals, the checkout form rules, building the demo order
src/lib/content/               reading and validating the static pages
src/lib/og/                    share image layout and drawing
src/lib/seo.ts                 share metadata and structured data for search engines
src/lib/image-loader.ts        picks the right prepared image size for the screen
src/lib/guards.ts              type guards that check data read at runtime (JSON files, browser storage)

.claude/skills/                skills for Claude: the design system, and Vercel's React guides
```

The data layer in `src/lib/catalog` runs at build time only, and each file has a single job:

| File          | Job                                                                                     |
| ------------- | --------------------------------------------------------------------------------------- |
| `schema.ts`   | Rules for every field in the category and product files, with Arabic messages           |
| `validate.ts` | Checks the two files together (duplicate slugs, missing categories, duplicate variants) |
| `build.ts`    | Builds the catalog once: prices in halalas, category paths, sorted lists, expired deals |
| `cards.ts`    | The card data that reaches the browser, with as few fields as possible                  |
| `catalog.ts`  | The read functions the pages use                                                        |
| `home.ts`     | Home page sections and promo cards                                                      |

## Tests

- **Unit tests** (`pnpm test`, in `tests/unit`): price formatting, Arabic search (hamza forms, taa marbuta, Arabic and Persian digits and letters), plural forms, filters and sorting and their URLs, the cart, its matching with current prices and its safe storage, shipping and coupons, the checkout form and order building, the product-writing helpers, deal expiry, and data file validation. They run in seconds, so run them after any change in `src/lib` or `src/data`.
- **Browser tests** (`pnpm test:e2e`, in `tests/e2e`): open the built site and act like a visitor: browsing, search, filtering and sorting, picking a size and color, the cart, checkout with a coupon and express delivery, the wishlist, the mobile menu, and the 404 page. Run `pnpm build` first.
- **Devices:** a desktop with Chrome, a Galaxy S24 phone with the Chrome engine (like Samsung Internet), an iPhone 15 with the Safari engine, and a desktop with Firefox. Locally the installed Chrome is used, and Firefox is added with `E2E_FIREFOX=1 pnpm test:e2e`. The first time on a new machine: `pnpm exec playwright install webkit firefox`.
- The tests do not depend on specific product names, so they stay valid when the demo data is replaced.
- **Testing with real people:** the tasks and the feedback table are in [USER-TESTING.md](USER-TESTING.md).

## Quality

- Before every Git commit the code is formatted and linted automatically (Husky and lint-staged), and `DESIGN.md` is linted when it changes. Any ESLint warning blocks the commit.
- ESLint also rejects `any`, type assertions (`as`), non-null assertions (`!`) and array positions used as list keys. Data the code reads at runtime is checked with the type guards in `src/lib/guards.ts` instead of being assumed.
- Each component lives in its own file, named after it, with a `<Component>Props` interface for its props. Only the compound components in `src/components/ui` (such as a dialog and its parts) share a file.
- Code comments, test names, CI step names and commit messages are in English. The interface, the product data and the messages the store owner reads stay in Arabic.
- Claude follows Vercel's React guides for performance and component structure: the skills `vercel-react-best-practices` and `vercel-composition-patterns` in `.claude/skills`, copied unchanged from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (MIT).
- `pnpm verify` runs every check plus the unit tests in one command.
- On every push to `main` and every pull request, GitHub Actions checks formatting, lint errors and types, runs the unit tests, builds the site, then runs the browser tests on Chrome, Firefox and Safari (WebKit). It keeps the built `out` folder for a week, and the test report when something fails.

## Performance and load capacity

**There is no server that can go down.** The site is ready-made files (HTML, images and JSON) built once with `pnpm build`. When someone visits, no code runs on a server and there is no database, so every visitor only requests files. On a content delivery network such as Cloudflare Pages or Netlify, these files are copied to many servers around the world, so the site handles very large numbers of simultaneous visitors without any extra setup.

**The data the browser requests** comes from two static files generated at build time. They are not an API running on a server:

| File                 | Size   | When it loads                                                                    |
| -------------------- | ------ | -------------------------------------------------------------------------------- |
| `/search-index.json` | 15 KB  | On the first focus of the search field, and on the search and wishlist pages     |
| `/cart-catalog.json` | 5.6 KB | Only when the cart or the checkout page opens, to check current prices and stock |

Each file loads once per visit and is shared by every part of the page. A network failure does not break the cart: it stays as it was saved, and search shows a message with a retry button.

**Local load test** (November 4, 2026): a simple single-process file server on the development machine itself (`serve out`), with mixed simultaneous requests for pages, scripts, images and the two data files. This is far weaker than a real delivery network; what matters is that the site needs no computation per visit:

| Simultaneous visitors | Duration   | Requests | Requests per second | 95% of requests within | Errors |
| --------------------- | ---------- | -------- | ------------------- | ---------------------- | ------ |
| 200                   | 20 seconds | 39,011   | 1,944               | 174 ms                 | 0      |
| 1,000                 | 20 seconds | 39,245   | 1,923               | 865 ms                 | 0      |

With 1,000 visitors the wait gets longer but no request fails, because the server only sends ready-made files.

**Lighthouse on mobile** (simulating a mid-range phone on a slow 4G network):

| Page         | Performance | Accessibility | Best practices | SEO |
| ------------ | ----------- | ------------- | -------------- | --- |
| Home         | 90          | 100           | 100            | 100 |
| Product page | 90          | 100           | 100            | 100 |
| All products | 88          | 100           | 100            | 100 |

**Lazy loading and lighter pages:**

- **Images:** every image is prepared in three WebP sizes, and the browser takes the smallest size that fits the screen. Images further down the page load as the visitor approaches them, and only the first hero image is preloaded with high priority.
- **Drawers and panels:** the cart, the mobile menu, the image zoom, the filter sheet and the toast messages load their code after the page appears or on the first tap (`src/lib/use-idle.ts`). The phone filter sheet never loads on desktop, and vice versa.
- **As little JavaScript as possible:** components are rendered ahead of time, only the interactive part runs in the browser, and it receives only the fields it needs (the cart button on a card does not carry the whole product). Buttons and inputs are native elements without a library.
- **Font:** a subset with only the store's characters (66 KB for the three weights).
- **Caching:** JavaScript and CSS files are cached in the browser for a year (their names change with every edit), images for a day, and the two data files are revalidated after every deployment (`public/_headers`).

**As the store grows:** listing pages send the cards of every product in the category with the page so filters work instantly without a server. That is fine up to a few hundred products per category. The search index grows by about 0.75 KB per product (about 150 KB compressed for a thousand products). Beyond that, the index and listing data should be split into smaller files loaded on demand, or a search server added (section 16 of the plan).

## Important technical notes

- **Static site:** `output: "export"` in `next.config.ts`. Features that need a server, such as Server Actions, cookies or dynamic APIs, cannot be used.
- **Search and filters run in the browser:** listing pages are prepared as HTML without filters for search engines, then the URL's filters apply right after loading (`src/lib/catalog/use-listing-search.ts`).
- **Images:** a custom loader (`src/lib/image-loader.ts`) picks from the prepared copies, because a static site has no server to resize images.
- **Drawers load after the page:** the cart drawer, the mobile menu, the image zoom, the filter sheet and the toast messages load their code after the content appears (`src/lib/use-idle.ts`), or immediately if requested earlier. This is what lifted mobile performance above 90. Tabs are a light component without a library (`src/components/ui/tabs.tsx`).
- **Drawing share images:** runs on a single thread and a single queue per build, because the font library inside sharp sometimes crashed on Windows when drawing in parallel.
- **Next.js on Windows:** version 16.4 writes the client navigation files into nested folders when building on Windows. `scripts/fix-export-segments.mjs` fixes this after every build and does nothing on Linux.
- **Long Windows command lines:** the project folder has a long Arabic name, so the pre-commit hook passes files to lint-staged in batches (`--max-arg-length` in `.husky/pre-commit`).
- **Documentation for this exact Next.js version** is in `node_modules/next/dist/docs`.
