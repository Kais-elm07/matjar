# Changing the store

How to change the store's products, pages, images, look and mascot. How the code works is in [README.md](README.md), and putting the store online is in [DEPLOYMENT.md](DEPLOYMENT.md).

## Where to change...

| What you want to change                  | File                                                                  |
| ---------------------------------------- | --------------------------------------------------------------------- |
| Products, categories, prices and stock   | The admin panel at `/admin/` (below), or `src/data` for the demo data |
| Store name, description, currency, links | `src/config/site.ts`                                                  |
| Home slides and promo cards              | `src/data/home.ts`                                                    |
| Shipping cities, prices, free shipping   | `src/data/shipping.ts`                                                |
| Discount coupons                         | `src/data/coupons.ts`                                                 |
| Static page text                         | `src/content/pages`                                                   |
| Contact details and announcement bar     | `src/config/site.ts` (`contact` and `announcement`)                   |
| Analytics                                | `src/config/site.ts` (`analytics`)                                    |
| Share image layout                       | `src/modules/share-images/layouts.ts`                                 |
| Brand colors and corner radii            | `DESIGN.md`, then the files listed under "Design system"              |
| Option swatch colors (red, blue...)      | `src/modules/catalog/options.ts`                                      |
| Arabic font                              | `assets/fonts`, then `pnpm fonts`, and `src/app/fonts.ts`             |
| Site icon                                | `src/app/icon.svg`                                                    |
| A category's cover photo                 | `image` in `src/data/categories.ts`                                   |
| The light behind one product photo       | `tone` on the image in `src/data/products.ts`                         |
| Najm's name and what he says             | `src/config/site.ts` (`mascotName`), `src/modules/mascot/messages.ts` |

## The admin panel

The store owner's pages, at `/admin/` (`src/app/admin`), where products and categories are changed without touching the code or deploying again:

- **Products:** every product, hidden ones included, with its price range and stock. "تعديل المخزون" (Edit stock) changes the stock of each variant in place; "إخفاء" (Hide) takes a product out of the store and "إظهار" (Show) brings it back. A product is never deleted, because orders name its SKUs.
- **Adding or editing a product:** its name, address, category, description and specifications; its photos in order, each with its color option; and its variants, one row per size and color combination with its options written as `المقاس: M، اللون: أبيض`, its price in riyals, its price before the discount and its stock. The server checks the form with the same rules as `src/data` and answers with the problems to fix, in Arabic.
- **Categories:** adding one, and changing a category's name, address, parent, description and cover photo.
- **When a change shows:** every save expires the catalog's cached copies (`updateTag("catalog")`), so the store shows it from the next request on, on every page; that request waits a moment while the page is drawn again. The panel page comes back drawn again in the same answer. A new product's page is drawn on its first visit; its own share image appears with the next deploy, and until then a shared link shows the store's image.
- **Signing in:** one password for the store owner. `pnpm admin:password` asks for it and prints two variables for `.env` and the host: `ADMIN_PASSWORD_HASH`, its scrypt hash (the password itself is stored nowhere), and `ADMIN_SESSION_SECRET`, which signs the sign-in cookie (seven days, `httpOnly`, only for `/admin`). Without them the panel stays off. Every admin page and every admin Server Action checks the session itself (`src/modules/admin/session.ts`), and the panel is out of the search engines (`noindex` and robots.txt).
- **Photos:** "رفع" (Upload) next to each photo sends a PNG, WebP or JPEG of up to 4 MB, at least 600 pixels wide, from the owner's device. The server checks it again, makes the same five WebP copies as `pnpm images` with `src/lib/image-prepare.ts`, measures its tone and whether it is a cut-out, and keeps the copies in a public bucket of Supabase Storage (`src/modules/admin/uploads.ts`), under a new name each time, so they are cached for a year. The form then holds the photo's address without a size, such as `https://<project>.supabase.co/storage/v1/object/public/product-images/products/<id>`, and the image loader picks its sizes like a local photo's; the measured look waits in the `uploaded_images` table until the product is saved. A photo can still be written as a path in `public/images`, such as `/images/products/classic-cotton-shirt-1`, which keeps the tone measured for it when another product uses it. Uploading needs `SUPABASE_URL` and `SUPABASE_SECRET_KEY` (DEPLOYMENT.md); without them the button doesn't show. The secret key stays on the server, and `SUPABASE_URL` is also added to the content security policy's `img-src` when the site is built.

## The demo data in `src/data`

The products and categories live in the database. `src/data` holds the store's starting catalog, which `pnpm db:seed` writes into an empty database, and the home page, shipping, coupons and reviews, which the code reads directly. After editing the products or categories in `src/data`, run `pnpm db:seed --force` to write them into the local database. The live database keeps its own copy, which the store owner edits from the admin panel.

- **Categories:** `src/data/categories.ts`. A subcategory names its parent's slug in `parent`. A category's cover on its tile is a product photo: set it in `image`, such as `/images/products/portable-speaker-2`, or leave it out to show the first photo of the category's most popular product.
- **Products:** `src/data/products.ts`. Prices are in riyals, and `optionMatrix` generates every size and color combination automatically, with optional price or stock overrides for a single value or a full combination.
- **Slugs:** lowercase English with dashes, such as `classic-cotton-shirt`, because they work on every host.

Any data mistake, such as a duplicate slug, a missing category, or a compare-at price lower than the price, stops `pnpm db:seed` (and so the Netlify build, which runs it) with an Arabic message that names the product and the field.

## The home page

- **Slides and promo cards:** `src/data/home.ts`. Each card only names a product or category slug, and the image, price and discount are filled in automatically.
- **Limited-time deals:** give a product `saleEndsAt: "2026-12-31"` (the last day of the offer) and a compare-at price. It appears in the deals section with a real countdown and leaves the section after that date. The cached pages are drawn again after a day, so the price returns to the compare-at price at most a day after the end date.
- **Customer reviews:** `src/data/testimonials.ts`. The section stays hidden while the list is empty, so only add real reviews with their authors' permission.
- **Trending and best sellers:** calculated automatically from `popularity` in the products file.

## Shipping and coupons

- **Shipping:** `src/data/shipping.ts`: cities, delivery price and time in working days, the free shipping threshold, and the cities with express delivery.
- **Coupons:** `src/data/coupons.ts`: a percentage (with an optional cap), a fixed amount, or free shipping, with an optional order minimum. The codes stay on the server: the coupon field asks it about a code (`lookupCoupon`), and the checkout page receives only the shipping settings.
- Any mistake in the shipping or coupon files, such as a duplicate city or a percentage above 100, stops the build with an Arabic message.

## Static pages and contact details

Each page is a text file in `src/content/pages`, and the file name is its URL: `about.md` appears at `/pages/about`. The current pages are about us, contact us, shipping and delivery, returns and exchanges, privacy policy, terms and conditions, and FAQ. Their content is customer-facing, so it stays in Arabic.

- **Front matter:** between two `---` lines, write `title`, `description` (for search engines) and `order` (position in the side menu). The optional `layout` field adds a special block: `contact` adds the contact cards, `shipping` adds the table of cities and prices from the shipping file, and `faq` turns the questions into an expandable list.
- **Text formatting:** a blank line between paragraphs, `## ` for a heading, `### ` for a subheading (a question on the FAQ page), `- ` for a bullet, `1. ` for a numbered step, `**text**` for bold, and `[link text](/pages/contact)` for links.
- **Values that update automatically:** `{store}` for the store name, `{email}`, `{phone}`, `{freeShipping}` for the free shipping threshold, and `{analytics}` for the privacy page's sentence about analytics.
- **Contact details:** in `src/config/site.ts` under `contact`. The current values are deliberately invalid placeholders: all-zero numbers and an address on the reserved `example.com` domain. Put your real details there, and leave any field empty (`""`) to hide its card. The floating WhatsApp button only appears when a number is set.
- **Announcement bar:** `announcement` in the same file, or `null` to hide it. Its text can use the same values as the pages, such as `{freeShipping}`.
- Every `/pages/...` link in the site menus must have a matching file, otherwise the build stops with a message naming the missing link.

## Adding images

On the live store, the store owner uploads a product's photos from the admin panel, with no build. The steps below are for the photos of `src/data`, which ship with the code.

1. Remove the photo's background, so the product stands alone on a transparent background (a cut-out), and save it as PNG or WebP, at least 1200 pixels on its long side, with the product in the middle and no text on it. Any tool works: remove.bg, the "Remove Background" of photo editors, or the open-source [`@imgly/background-removal-node`](https://github.com/imgly/background-removal-js) model that cut out the demo photos on the developer's computer. A regular photo still works: it stands in a frame instead of floating.
2. Put it in `assets/images/products/` with a name such as `classic-cotton-shirt-1.png`.
3. In the products file, write the path without an extension, `/images/products/classic-cotton-shirt-1`, or use `productImages("classic-cotton-shirt", 2)`.
4. When running or building, `pnpm images` (`scripts/images.ts`, through `src/lib/image-prepare.ts`) converts the image to WebP at 200, 400, 600, 800 and 1200 pixels wide (WebP keeps the transparent background), and the browser picks the right size for the visitor's screen. `pnpm images` also measures the photo's main color into `public/images/image-meta.json`, and the site turns it into the light behind the product (DESIGN.md: the product's tone). A black or white product has no clear color and takes the store's blue. To choose the light yourself, give the image a color in the products file: `{ src: "/images/products/x-1", tone: "#c2410c" }`.

The `public/images` folder is generated automatically and is not committed to Git, so never put images there by hand. A production build stops with a list of any image that the data mentions but that does not exist.

The current images are free real photos from [Pexels](https://www.pexels.com/license/) (their license allows changing them and using them without attribution), with their backgrounds removed, shown until they are replaced by your own product photos with the same names. Each photo's Pexels ID is recorded in `assets/images/sources.json`, and `pnpm images:photos` downloads the original photo, with its background, of any product photo that is missing.

## Share images

When a link is shared on WhatsApp or social networks, a 1200×630 image appears: each product has an image with its photo, name, price and discount badge, each category has one with its name and product count, and the rest of the site uses a general store image. A cut-out stands on its platform in the light of its tone, as on the site's stage.

- JPEG files are drawn at build time by the routes in `src/app/og` and served at `/og/...`, so they follow the prices and names of the deployed build.
- The layout is in `src/modules/share-images/layouts.ts` and the drawing helpers are in `src/modules/share-images/render.ts`. Colors and font come from `DESIGN.md`, and the text is drawn with TTF copies of the store font, generated by `pnpm fonts`.
- **Important when deploying:** set the real site URL in `NEXT_PUBLIC_SITE_URL` before building, because image links must be absolute. Without it they point to `localhost` and do not show up when shared.

## Najm, the mascot

Najm (نجم, "star") is a small glossy blue dog in 3D, drawn with [three.js](https://threejs.org) from simple shapes in code, so there is no model file to download. He stands in the corner of every page on the start side (the WhatsApp button is on the other side), with no background, and lets every tap through to the page. His look and rules are in `DESIGN.md` (Mascot).

- **On each page:** he greets the visitor on the home page once per visit. On product lists, search, product pages and the wishlist his cart stands beside him: when a product is added, its photo flies from the pressed button into his paws, he throws it into his basket, and his speech bubble names it and suggests two similar products that aren't in the cart yet, with "View cart". On the cart page he says how many pieces the cart holds, and takes out whatever the visitor deletes. On the checkout form he stays quiet, and on the confirmation page he celebrates and sends his cart off with the order.
- **Suggestions** come from `/similar-products.json`, computed by the server from the same "similar products" the product page shows (up to four in-stock products per product).
- **Hiding him:** "Hide Najm" in his greeting, and a button in the footer that hides him or brings him back. The choice is saved in the browser.
- **Speed:** his code (about 150 KB compressed, mostly three.js) downloads only after the page has loaded and the visitor first moves, touches or scrolls, and only if the browser can draw WebGL 2. Drawing stops a few seconds after the visitor stops moving, and while the tab is hidden.
- **Reduced motion:** he stands still, doesn't follow the pointer, and products appear in his basket at once; his bubbles still speak.
- **Renaming him or changing what he says:** `mascotName` in `src/config/site.ts`, and his sentences in `src/modules/mascot/messages.ts`.

## Analytics (optional)

The site has no analytics for now. To enable a cookie-free tool, set this in `src/config/site.ts`:

- `analytics: { provider: "plausible", domain: "example.com" }` for [Plausible](https://plausible.io), or
- `analytics: { provider: "umami", websiteId: "..." }` for [Umami](https://umami.is).

The script loads after the page has finished loading, so it does not slow it down, and the analytics paragraph in the privacy page updates automatically to name the tool.

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
- To change the identity: edit `DESIGN.md` first and lint it, then copy the colors into `src/app/globals.css`, `OG_COLORS` in `src/modules/share-images/render.ts` (share images), `BRAND_HEX` in `src/lib/tone.ts` (the light behind photos without a clear color), `themeColor` in `src/app/layout.tsx` and `src/app/icon.svg`. The full checklist is at the end of `.claude/skills/design-system/SKILL.md`.

## Changing the country

The store is set up for Saudi Arabia: riyals, Saudi cities and Saudi mobile numbers. Another country touches these places:

- `src/config/site.ts`: the currency (`currency`: its code, symbol and decimal places), the time zone (`utcOffset`, which decides when a deal ends), and the contact numbers.
- `src/data/shipping.ts`: the cities, prices and delivery times.
- `src/data/coupons.ts`: the coupon descriptions, which name the currency.
- `src/modules/checkout/schema.ts`: the mobile number rule (05xxxxxxxx, also accepting +966 and 00966) and its Arabic messages.
- `playwright.config.ts`: the locale of the browser tests (`ar-SA`).
