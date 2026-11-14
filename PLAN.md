# Online Store Plan

**Version:** 3.5
**Date:** November 8, 2026
**Status:** Approved up to phase 9. Phases 1 to 7 are complete except the items that need the owner (a review on a real phone and testing with real people). Phase 8, the deployment, was done with phase 12 on Netlify. A full review of code quality, performance and load capacity has been carried out. The project is on GitHub and the GitHub Actions checks pass. Phase 10, a design-only evolution to the "Spotlight" identity, was proposed, prototyped and built on November 6, 2026, on the Git branch `phase-10-spotlight`; the owner's look on a real phone remains. Phase 11, Najm the 3D mascot, was prototyped on November 6 and built on November 7, 2026, on the branch `phase-11-mascot`, which starts from phase 10. Phases 10 and 11 were merged into `main` on November 7, 2026. Phase 12, built on November 7, 2026, runs the store on a Next.js server, with a products API and the orders saved in PostgreSQL; it was deployed the same day on Netlify (`https://matjrii.netlify.app`) with a Supabase database. Phase 13, built on November 7 and 8, 2026, moved the products into the database, with an admin panel at `/admin/`, stock lowered by every order, and photos uploaded to Supabase Storage; it is live since November 8, 2026, and its health check reports the database, the photo tools and the storage all working.

---

## Changelog

| Version | Date | Change |
| --- | --- | --- |
| 3.5 | November 8, 2026 | Phase 13 was completed and deployed: the catalog read from the database through a cached function, stock lowered by orders, the admin panel, photo uploads to Supabase Storage, and share images that fall back to the site's image for products added after a deploy. The first deploy of the uploads reported the storage as off because `SUPABASE_URL` was missing in Netlify; once it was added, the live health check reported the database, the photo tools and the storage all up, and the content security policy allows the Supabase photos. |
| 3.4 | November 7, 2026 | Phase 12 was deployed on Netlify with a Supabase database. Phase 13 was planned at the owner's request (the products in the database, refreshed on demand, an admin panel, stock lowered by orders) and its first step built: the catalog tables and the seed. |
| 3.3 | November 7, 2026 | Phase 12 was built at the owner's request on the branch `server-mode`: the store runs on a Next.js server instead of a static export, with the security headers in `next.config.ts`, a products API (`/api/products/`), PostgreSQL through Prisma for the orders, a Server Action that checks and saves each order, a page for every order, and coupons that stay on the server. Decision 7 is answered for the host: Netlify. |
| 3.2 | November 7, 2026 | Phase 11 was built on the branch `phase-11-mascot`: Najm, a 3D blue dog drawn with three.js from simple shapes, stands in the corner of every page with no background, and behaves differently on the home page, the shopping pages, the cart, checkout and the order confirmation. He catches every product added to the cart, takes out deleted ones, celebrates an order, and suggests similar products from a new static file, `similar-products.json`. While he is on screen he replaces the cart panel as the add confirmation; a footer button hides him. His code loads only after the visitor's first move. `DESIGN.md`, the README, unit tests and two browser tests were added for him. |
| 3.1 | November 6, 2026 | Phase 10 was built on the branch `phase-10-spotlight`: `DESIGN.md` and the design skill were rewritten for the "Spotlight" identity; the colors, the pill buttons and the corners changed in the code; every demo product photo became a cut-out, made with an open-source background-removal model on the developer's computer, with other Pexels photos where a photo could not be cut cleanly or was too small (and the black headset recolored from the red one); the color options of four products now follow their photos, and the category covers are product photos; `pnpm images` measures each photo's color, and the catalog gives every photo its tone; the hero and the product gallery became stages whose light follows the product and whose photos turn in 3D, with no new dependency; the cards, the category tiles, the banners and the share images took the same look. Unit tests for the tone, its contrast on every hue and the swipe arithmetic, and two browser tests for the gallery, were added. |
| 3.0 | November 6, 2026 | Phase 10 was proposed at the owner's request: a design-only evolution toward two concept designs the owner chose (a page whose background takes the product's color, and a dark tech storefront with one electric blue). It defines the "Spotlight" identity, a backdrop that follows the product's color, a 3D turn between photos in CSS only, and a restyle of every component with no change to the structure, the data or the features. It waits for decisions 9 to 11 in section 17. |
| 2.9 | November 5, 2026 | At the owner's request, the project documentation was translated to English and given English file names: this plan (`PLAN.md`), `README.md`, `DESIGN.md`, the design-system skill, the deployment guide (`DEPLOYMENT.md`) and the user-testing guide (`USER-TESTING.md`). The storefront and its content stay in Arabic. The status was also brought up to date: the project is on GitHub, and the checks pass there on Chrome, Firefox and Safari (WebKit). |
| 2.8 | November 4, 2026 | A full review of code quality and performance, at the owner's request before deployment: large files (the data layer, the home page, checkout and the listings) were split into small modules; bugs were fixed (cart storage when the browser blocks it, the slide direction of side panels in RTL, the image gallery, phone numbers written as +966 05, and the price reverting after a deal ends); less is sent to the browser; unused code was removed; and 31 new unit tests, two browser tests and a load test were added. The owner postponed the deployment. |
| 2.7 | November 4, 2026 | The interface was redesigned in a "Warm Night" style at the owner's request, after a concept design whose colors the owner liked (Luxe Living): a dark background with a single orange for actions and prices, dark cards with a round cart button in the corner, a dark header with a wide search field and a row of links, a footer ending in an orange bar, and new home sections (Why choose us, the deals grid, Contact us), with free real product photos from Pexels instead of the demo drawings. DESIGN.md is the reference. |
| 2.6 | November 4, 2026 | The interface was redesigned in a "Modern Simplicity" style, following a mix of real stores the owner chose (the header from Cowboy, the hero and cards from Qiqi, the footer from The Other Glasses): a transparent header over a full-width hero, cards with divider lines, a navy footer with a large tagline, and amber for discount badges only. DESIGN.md is the reference. |
| 2.5 | November 2, 2026 | Phase 7 was done: 121 unit tests (Vitest) and 34 browser tests (Playwright) on Chrome, an Android phone and an iPhone, Firefox in GitHub Actions, and a guide for testing with real people. |
| 2.4 | October 31, 2026 | Phase 6 was done: share images for every product and category, mobile performance above 90 by deferring the code for panels and dialogs, a review of the copy and of accessibility, light motion, and optional analytics (turned off). The review on a real phone remains. |
| 2.3 | October 31, 2026 | Phase 5 was done: static pages from text files, contact cards, a WhatsApp button and an announcement bar, with placeholder contact details until the owner sends the real ones. |
| 2.2 | October 31, 2026 | The demo confirmation was chosen for checkout (decision 3), and phase 4 was done: the checkout page, shipping, coupons and the confirmation page. |
| 2.1 | October 31, 2026 | The layout and colors of the Webishop template (a navy header and amber buttons) were adopted at the owner's request, rebuilt in Arabic without copying its code. New home sections were added, and phase 3 (cart and wishlist) was done as part of the new interface. |
| 2.0 | October 30, 2026 | At the owner's request, the project became a frontend-only showcase with no server and no database. The database, accounts, online payment and the admin dashboard were removed, the phases were reordered, and the timeline was shortened. |
| 1.0 | October 29, 2026 | The first plan: a full store with a frontend, a server and a database. |

---

## How to read this plan

- **Sections 1 to 6** answer "what are we building, and why": the goals, the requirements, the technology, the interface design, the architecture, and the shape of the data files.
- **Section 7** is the heart of the plan: the implementation phases step by step, each with a checklist and a clear definition of done.
- **Sections 8 to 16** are reference material: checkout without a server, privacy, performance, testing, deployment, the timeline, risks, the launch checklist and the roadmap.
- **Section 17** lists the decisions needed from you.

> **Assumptions behind the plan:**
>
> 1. The catalog pages are prepared in advance at build time. Until phase 12 the whole site was static files; since then a Next.js server sends those pages and answers the rest (the products API and the orders).
> 2. Product and category data is written in files inside the project, and any change to it requires rebuilding and redeploying the site.
> 3. The cart and the wishlist are saved only in the visitor's browser.
> 4. "Place order" is a demo with no payment. Until phase 12 nothing was stored; since then the server checks the order and saves it in a database, and each order has its own page. Sending the order over WhatsApp is still an option (section 8).
> 5. Arabic first (right to left), with the Saudi riyal as a temporary currency until the country is decided.
> 6. The team: one developer, with help from Claude Code.

---

## 1. Vision, goals and scope of the first version

### 1.1 Goal

An online store with an Arabic interface that is **easy to use**, fast and excellent on mobile, presents products professionally, and offers a complete shopping experience from browsing to order confirmation. The site runs as static files that can be uploaded to any host, with no server, no database and no running costs.

### 1.2 What does "frontend only" mean?

| In this version | Not included (needs a server; can be added later) |
| --- | --- |
| Product and category data in files inside the project | A database |
| Instant search, filtering and sorting in the browser | Customer accounts and sign-in |
| A cart and a wishlist saved in the visitor's browser | Real online payment |
| A checkout page with full validation and a demo confirmation page | Storing and tracking orders |
| An option to send the order summary over WhatsApp | An admin dashboard for products and orders |
| Content and policy pages | Automatic emails |

### 1.3 What the first version includes

| Area | Included features |
| --- | --- |
| **Catalog** | The home page, main categories and subcategories, an all-products page, a product page with an image gallery and variants (size, color), similar products |
| **Search and filtering** | Instant search with suggestions, a results page, filtering by price, options, availability and deals, sorting, pagination |
| **Cart and wishlist** | Add, change and remove, automatic saving in the browser, counters in the header, a side cart panel |
| **Checkout (demo)** | A one-page form, shipping by city, a demo discount coupon, a total summary, a confirmation page |
| **Content** | About us, Contact us, Shipping, Returns, Privacy, Terms, FAQ |
| **Technical** | Full SEO for every page, high speed, accessibility, runs on any static host |

### 1.4 Out of scope for this version

- Everything that needs a server (the table in 1.2); it is covered in the roadmap (section 16).
- Multiple languages and currencies.
- Real customer reviews.
- A mobile app.

### 1.5 Success metrics

- A Lighthouse mobile performance score of 90 or higher for the home, category and product pages.
- Any product reachable within 3 clicks or one search.
- The demo checkout in 3 steps: add to cart, go to checkout, confirm.
- Any mistake in the data files (a duplicate link, a category that does not exist) stops the build with a clear Arabic message instead of reaching visitors.
- The site works as is on any static file host.

---

## 2. Requirements

### 2.1 Who uses the site?

| Role | What they do |
| --- | --- |
| **Visitor** | Browses, searches and filters, adds to the cart and the wishlist, and tries the checkout |
| **Store owner** | Edits the data files and the images, then rebuilds and redeploys the site. There is no admin dashboard in this version |

### 2.2 Functional requirements

**A. Catalog**

- Multi-level categories (main and sub), and a main category page also shows the products of its subcategories.
- A product with several images, a formatted description, specifications, a price and a pre-discount price, and an availability status.
- Variants (size, color...), each with its own price and stock, and choosing a color moves the gallery to that color's image.
- The newest products, the best sellers and the deals on the home page.

**B. Search and filtering**

- Search that tolerates Arabic spelling variations: أ and ا, ة and ه, ى and ي, and diacritics.
- Instant suggestions while typing, with the product image and price.
- Filters: price range, options (size, color), in stock only, deals only.
- Sorting: best selling, newest, price low to high and high to low.
- The filter state is kept in the URL, so a results link can be shared.

**C. Cart and wishlist**

- Add, remove and change quantities instantly, without exceeding the stock written in the data.
- Saved in the browser, even after it is closed.
- A notice if the price of a product in the cart changes, or the product sells out, after the site data is updated.

**D. Checkout (demo)**

- One page: contact details, address, shipping method, payment method (cash on delivery), order summary.
- Instant field validation, with Arabic messages under each field.
- Shipping by city, and a discount coupon from the store settings.
- A confirmation page with a demo order number, or sending the order over WhatsApp (section 8).

**E. Content**

- Static pages written in easy-to-edit text files.
- Contact through WhatsApp, email and phone links, with no forms that need a server.

### 2.3 Non-functional requirements

| Requirement | Standard |
| --- | --- |
| **Ease of use** | Any visitor completes an order without explanation; buttons are at least 44 px tall; messages are clear and in Arabic |
| **Mobile first** | The design starts at a width of 375 px, then expands for desktop |
| **RTL direction** | The whole interface is correct right to left: alignment, icons, numbers, forms |
| **Performance** | Lighthouse 90+ on mobile, WebP images in several sizes, as little JavaScript as possible |
| **SEO** | Every product and category is a ready HTML page with a title, a description and structured data |
| **Privacy** | No visitor data is sent to any server; everything stays in the visitor's browser |
| **Portability** | The site is a folder of static files that runs on any host |
| **Scalability** | Data reading is isolated in one place, so the files can later be replaced by a real server without rebuilding the interface |

### 2.4 Example user stories

- **As a visitor**, I want to search with one word and see suggestions right away, so I find what I want quickly.
- **As a visitor**, I want to filter a category by size and color and share the link with a friend.
- **As a visitor**, I want to choose a color and see the product photo in that color.
- **As a visitor**, I want my cart to still be there if I come back two days later.
- **As a store owner**, I want to add a product by editing one file and putting its photos in a folder, then have the site deploy automatically.

---

## 3. Technology choices

### 3.1 Why a static site built with Next.js?

> Since phase 12 the same Next.js code runs on a server: the pages that were static are still prepared at build time, and a server now answers the API and the orders. The comparison below is the reasoning of the first version.

| Option | Pros | Cons | Decision |
| --- | --- | --- | --- |
| **Next.js with static export** | A ready HTML page for every product (great for search engines), nearly free hosting, no server to manage, and a server can be added later with the same code | Data changes require a rebuild | **Chosen** |
| A single-page app (Vite + React) | Simple | Pages are empty for search engines until JavaScript runs | Not suitable for a store |
| A hosted platform (Salla, Zid, Shopify) | Fast to launch | A monthly subscription, limited control, not a custom interface | Outside the goal |

### 3.2 The tech stack

| Layer | Tool | Role |
| --- | --- | --- |
| **Framework** | Next.js 16 with `output: "export"` + TypeScript | Generates every page as a static HTML file at build time |
| **Styling and components** | Tailwind CSS 4 + shadcn/ui (Base UI) with RTL support | Consistent components whose code we own and edit freely |
| **Font** | IBM Plex Sans Arabic, self-hosted in the project | The build does not depend on reaching Google Fonts |
| **Data** | TypeScript files in `src/data` + validation with Zod | Products, categories and settings; the build stops on any error |
| **Cart and wishlist state** | Zustand, saved to localStorage | Lightweight, and works without a server |
| **Forms** | React Hook Form + Zod | The checkout form with instant validation |
| **Images** | A sharp script that runs before dev and build | Converts the original images to WebP in three sizes |
| **Icons** | Lucide | Arrows mirror automatically in RTL |
| **Hosting** | Any static host (section 12) | Netlify, Cloudflare Pages, GitHub Pages or regular hosting |

### 3.3 Development tools

- **pnpm** for package management.
- **ESLint + Prettier** for code quality and formatting, and **Husky + lint-staged** for checks before every Git commit.
- **Vitest** for testing the logic, and **Playwright** for end-to-end tests in the browser.
- **GitHub Actions** to check and build on every change.
- **Google's DESIGN.md** (`@google/design.md`): one file that describes the visual identity for coding agents, checked with `pnpm design:lint` (added on October 30, 2026).

### 3.4 What was removed from the previous plan, and why

| Removed | Reason | Replacement in this version |
| --- | --- | --- |
| PostgreSQL and Prisma | No server | Data files inside the project |
| Auth.js and accounts | No server | No accounts; the cart and the wishlist live in the browser |
| Payment gateways | No server | Cash on delivery, shown for display only |
| Resend for email | No server | Direct WhatsApp and email links |
| Cloudinary for image uploads | No uploads from the site | Images inside the project, processed at build time |
| Admin dashboard | No server | Editing the data files directly |

The server code from phase 1 is kept in the Git history (commit `81cef22`) for anyone who wants to return to it later.

---

## 4. User experience and interface design (UX/UI)

### 4.1 Guiding design principles

1. **Fewest clicks to buy:** from the product page to order confirmation in 3 steps.
2. **No surprises:** the shipping cost and the final total are visible before pressing "Place order".
3. **Mobile first:** every page is designed at a width of 375 px first, then expands.
4. **Clarity before beauty:** a readable 16 px font, high color contrast, 44 px tall buttons.
5. **Instant feedback:** every action (adding to the cart, applying a filter) gets an immediate confirmation.
6. **Complete interface states:** every section has a loading state (a gray skeleton), an empty state and an error state.

### 4.2 Site map

```
/                          Home page
/products/                 All products (filters and sorting in the URL: ?sort=newest&sale=1)
/category/[slug]/          A category page
/product/[slug]/           A product page
/search/?q=                Search results
/cart/                     Cart
/checkout/                 Checkout (demo)
/checkout/success/         Order confirmation
/wishlist/                 Wishlist
/pages/[slug]/             About us, Contact us, Shipping, Returns, Privacy, Terms, FAQ

/sitemap.xml  /robots.txt  Generated at build time
/search-index.json         The search index, generated at build time
/cart-catalog.json         Prices and stock for checking the cart, generated at build time
```

### 4.3 The main purchase journey

```
Home / Search / Category
         ↓
   Product page ──(choose variant and quantity)──► Add to cart
                                                        ↓
                                         Side cart panel + cart counter
                                                        ↓
                                                    Cart page
                                                        ↓
                                               Checkout (one page)
                              ┌──────────────────────────────────────────────────┐
                              │ 1. Contact details (name, mobile, email)         │
                              │ 2. Delivery address (city sets shipping cost)    │
                              │ 3. Shipping method                               │
                              │ 4. Cash on delivery                              │
                              │ 5. Summary, final total and confirm button       │
                              └──────────────────────────────────────────────────┘
                                                        ↓
                    A demo confirmation page, or sending the order over WhatsApp (section 8)
```

### 4.4 What each main page contains

**Home page**

- The sticky dark header: the logo, a wide search field with suggestions that show the image and the price, the wishlist and cart icons with orange counters, and a "Shop now" button.
- The navigation row on desktop: an "All categories" button with a mega menu, and shopping links. On mobile, a sliding side menu and a fixed bottom navigation bar.
- The hero slides (swiped by touch, with no autoplay), then a trust strip: fast shipping, cash on delivery, easy returns, WhatsApp support, hand-picked products and ongoing deals.
- The promo grid (two image tiles, a tall tile, and a discount card whose percentage is computed from the real deals), then "Best sellers".
- Two featured category cards with photos, then "New arrivals" with a large banner, a row of products and a button, then "Trending now" with a tab for each category.
- "Limited-time deals" with a real countdown to the deal's end date in the data, then a wide photo banner, then the category tiles with photos, then customer reviews (shown only once real reviews are added).
- The "Contact us" section with a card for each channel, then the dark footer: the logo, the store's tagline, the contact button and the link columns, ending in an orange bar.

**Category, all-products and search results pages**

- The title, the number of results and the breadcrumb (Home ‹ Category).
- Subcategories as quick buttons.
- Filters: price (a two-handle slider), options (buttons for sizes and colored circles for colors), in stock only, deals only. On desktop they sit in a sidebar, and on mobile in a panel that slides up from the bottom.
- Sorting: best selling, newest, price low to high and high to low.
- The product card: image, name, price (with the old price struck through), and a discount or "Sold out" badge.
- Pagination, and a friendly empty state when there are no results, with a button to clear the filters.

**Product page**

- An image gallery that can be swiped, with thumbnails and a zoom view.
- The name, the price and the availability ("In stock", "Only 3 left", "Sold out").
- Options as clear buttons, with unavailable ones disabled, and colored circles for colors.
- A quantity selector and a large "Add to cart" button.
- Tabs: Description, Specifications, Shipping and returns.
- Similar products.

**Cart, checkout, confirmation and wishlist**

- Cart: the items with their images and variants, a quantity selector, removal, the summary, an empty state.
- Checkout: one page without distractions, instant validation, a summary that is sticky on desktop and collapsible on mobile, and the total shown on the confirm button.
- Confirmation: the demo order number, the summary and a continue-shopping button.
- Wishlist: a grid of cards with a move-to-cart button.

The labels above are described in English; on the site they are in Arabic.

### 4.5 Design system (the "Spotlight" identity, approved on November 6, 2026; the full reference is DESIGN.md)

| Element | Decision |
| --- | --- |
| **Font** | IBM Plex Sans Arabic in three weights (400, 500 and 700), self-hosted and subset |
| **Colors** | A dark background with a blue tint in three shades, white text, a single electric blue for buttons, prices and badges, a light red for errors, and behind every product photo a light in the product's own color |
| **Corners** | Buttons, tabs, chips and the search field fully rounded (pill), fields 8 px, photo boxes 12, cards and dialogs 16, badges 4 |
| **Photos** | Cut-outs on a transparent background, floating on the light of their color, which turn in 3D as they move |
| **Spacing** | A 4 px scale (4, 8, 12, 16, 24, 32, 48) |
| **Icons** | Lucide, with arrows mirrored in RTL |
| **Numerals** | Western digits (0-9) for prices, to avoid confusion |
| **Dark mode** | The store is always dark, with no light mode |

The whole system is documented in `DESIGN.md` at the project root, which is the reference for any new design.

Phase 10 replaced the "Warm Night" identity (dark with orange, November 4, 2026) with "Spotlight": a blue-tinted dark stage, one electric blue instead of the orange, a light behind each product that takes its color, and a 3D turn between photos. The earlier identity is in the Git history.

### 4.6 Accessibility

- Alt text for every image, and a label for every field.
- Keyboard navigation across the whole site, and a "Skip to content" link.
- Color contrast meets at least the AA standard, and touch targets are 44×44 px.

---

## 5. Technical architecture

### 5.1 Overview

> This diagram shows the static version of phases 1 to 11. Phase 12 adds a running Next.js server in front of the same build: it sends the prepared pages and files, answers `/api/products/`, and saves the orders in PostgreSQL (see phase 12 and the README).

```
      Data files (src/data)             Original images (assets/images)
                │                                      │
                ▼                                      ▼
  Zod validation at build time     pnpm images: WebP at 400, 800 and 1200 px
                │                                      │
                └──────────────────┬───────────────────┘
                                   ▼
                     next build (output: "export")
                                   │
                                   ▼
   out/ folder: HTML pages, CSS, JavaScript, images and sitemap.xml
                                   │
                                   ▼
    Static hosting with a CDN (Netlify / Cloudflare Pages / others)
                                   │
                                   ▼
The browser: search, filtering, cart, wishlist and checkout run locally
```

### 5.2 How pages are generated

| Page | Method |
| --- | --- |
| Home, categories, products, content pages | Ready HTML at build time for every URL |
| Filters, sorting and pagination | Applied instantly in the browser. The unfiltered first page exists in the HTML for search engines |
| Search and its suggestions | A JSON search index generated at build time and loaded on the first use of search |
| Cart, wishlist, checkout | Components that run in the browser and save to localStorage |

### 5.3 Project folder structure

```
متجر الكتروني/
├── assets/images/              Original images (products/ and categories/) and sources.json
├── assets/fonts/               Original font files
├── public/images/              Processed WebP images (generated automatically, not kept in Git)
├── public/_headers             Security and caching headers for the host
├── scripts/                    Images, fonts, demo images, and fixes to the build output
├── tests/unit/  tests/e2e/     Unit tests and browser tests
├── .github/workflows/ci.yml    Automated checks on every push and pull request
├── src/
│   ├── app/
│   │   ├── (store)/            Store pages (home, categories, products, search, cart, checkout, pages)
│   │   ├── og/                 Share images (generated at build time)
│   │   ├── search-index.json/  cart-catalog.json/  Static data files for the browser
│   │   └── sitemap.ts  robots.ts  not-found.tsx  layout.tsx  globals.css  icon.svg
│   ├── components/
│   │   ├── layout/             The store shell, header, footer, menus and search
│   │   ├── home/               Home page sections, one file per section
│   │   ├── product/            The product card, the gallery and the variant picker
│   │   ├── listing/            Filters, sorting and pagination
│   │   ├── search/  cart/  checkout/  content/
│   │   ├── store/              Shared components (product rows, headings, empty states...)
│   │   └── ui/                 Base interface components
│   ├── config/site.ts          Store name, currency, contact details and links
│   ├── content/pages/          Text of the static pages
│   ├── data/                   Categories, products, home page, shipping, coupons and reviews
│   ├── fonts/                  Subset font files and their license
│   └── lib/
│       ├── catalog/            The data layer (schema, validate, build, cards, catalog, home), search, filters and prices
│       ├── store/              The cart, the wishlist and their safe storage
│       ├── checkout/           Shipping, coupons, totals and the order
│       ├── content/  og/       Static pages and share images
│       └── seo.ts  image-loader.ts
└── out/                        The site, ready to deploy (after pnpm build)
```

### 5.4 Code principles

- All data reading goes through `src/lib/catalog` only, so replacing the files with a real server later touches one place.
- Prices are written in the data in riyals and converted internally to the smallest unit (halalas), to avoid rounding errors in calculations.
- The data is checked with Zod at build time, and any error stops the build with an Arabic message naming the product and the field.
- No secret keys or sensitive data in the code, because everything in the project reaches the browser.
- The cart data saved in the browser has a version number, so changing its shape later does not break visitors' carts.

---

## 6. The data files (instead of a database)

The store's data stays in Arabic, because it is what customers see.

### 6.1 Categories: `src/data/categories.ts`

```ts
export const categories = [
  {
    slug: "clothing",
    name: "ملابس",
    description: "أزياء يومية مريحة",
    image: "/images/products/floral-summer-dress-2",
  },
  { slug: "men", name: "رجالي", parent: "clothing" },
]
```

### 6.2 Products: `src/data/products.ts`

```ts
{
  slug: "classic-cotton-shirt",     // the URL: short English, no spaces
  name: "قميص قطني كلاسيكي",
  category: "men",
  description: "فقرة أولى.\n\n- ميزة أولى\n- ميزة ثانية",
  specs: [{ label: "الخامة", value: "قطن 100%" }],
  images: [
    { src: "/images/products/classic-cotton-shirt-1", color: "أبيض" },
    { src: "/images/products/classic-cotton-shirt-2", color: "أزرق" },
  ],
  // every size and color combination is a variant with its own price and stock
  variants: optionMatrix(
    { المقاس: ["S", "M", "L", "XL"], اللون: ["أبيض", "أزرق"] },
    { sku: "SHIRT", price: 129, compareAtPrice: 159, stock: 8 }
  ),
  popularity: 120,          // for sorting by best selling
  createdAt: "2026-10-12",  // for sorting by newest
}
```

### 6.3 Images

- Put the original image (JPG, PNG or WebP, preferably square and at least 1200 px wide) in `assets/images/products/`, with a name like `classic-cotton-shirt-1.jpg`.
- In the data, write the path without an extension: `/images/products/classic-cotton-shirt-1`.
- `pnpm images` (which runs automatically before dev and build) creates three WebP copies, 400, 800 and 1200 px wide, and the browser picks the best one for the visitor's screen.

### 6.4 Automatic validation rules

- Every `slug` and `sku` is unique.
- The category named in a product exists.
- The price is greater than zero, and the pre-discount price is greater than the price.
- Every product has at least one image and one variant.
- All variants of one product have the same option names.

---

## 7. Implementation phases, step by step

> Each phase has a goal, an estimated duration, a task list, and a definition of done to meet before moving on to the next phase.

### Phase 0: Preparation

**Duration:** 2 to 3 days, in parallel with development
**Goal:** have the content and the decisions ready, so the work never stalls.

- [ ] The product list in an Excel sheet: name, category, description, price, pre-discount price, options, approximate stock.
- [ ] Product photos on a consistent background, named after the product and the photo number.
- [ ] Identity: the store name, and the logo as SVG. (The colors and the font are approved; see `DESIGN.md`.)
- [ ] Page copy: About us, Shipping, Returns, Privacy, Terms, FAQ.
- [ ] Answers to the decisions in section 17.
- [ ] Choose a host, and make sure its website opens from your network.

### Phase 1: The foundation ✅

**Actual duration:** one day

- [x] Create a Next.js project with TypeScript, Tailwind and ESLint.
- [x] The root layout: `lang="ar"` and `dir="rtl"`, and the Cairo font self-hosted in the project (later replaced by IBM Plex Sans Arabic).
- [x] shadcn/ui with RTL support and the temporary brand colors.
- [x] The header, the footer and the sliding mobile menu.
- [x] A first home page and an Arabic 404 page.
- [x] Prettier, ESLint, Husky and a GitHub Actions check.
- [x] Turn the project into a static site and remove the database, after plan 2.0 was approved.
- [x] Push the project to GitHub (`Kais-elm07/matjar`).

### Phase 2: The catalog from data files ✅

**Actual duration:** one day
**Goal:** a fully browsable store with realistic demo data.

**Data and images:**

- [x] Category and product files, validated with Zod, with Arabic error messages.
- [x] 20 demo products in 5 categories, with sizes, colors, deals and a sold-out product.
- [x] The image script: generated demo images, and converting the original photos to WebP in three sizes.

**Interface:**

- [x] The product card: image, name, price, pre-discount price, and discount and sold-out badges.
- [x] The all-products and category pages: the product grid, subcategories, pagination.
- [x] Filters (price, options, availability, deals) and sorting, kept in the URL, in a sidebar on desktop and a bottom sheet on mobile.
- [x] The product page: an image gallery with swipe and zoom, variant selection, quantity, the description and specifications in tabs, similar products.
- [x] Search: instant suggestions in the header, and a results page with filters.
- [x] The home page: categories, new arrivals, best sellers, deals.
- [x] The header: category links from the data, on desktop and mobile.
- [x] Loading states and empty states.

**SEO:**

- [x] A title and a description for every product and category, and a share image.
- [x] Product and BreadcrumbList structured data.
- [x] sitemap.xml and robots.txt generated at build time.

**Output:** a fully browsable static site in the `out/` folder.
**Definition of done:** any product reachable within 3 clicks or one search, and a Lighthouse mobile performance score of 85 or more for the product page.
**Result:** Lighthouse on mobile: performance 90 to 100 for the home, category and product pages, and 100 for accessibility, best practices and SEO.

### Phase 3: Cart and wishlist, and the new interface ✅

**Duration:** 4 to 5 days

- [x] A Zustand cart store saved to localStorage, with a version number for the data.
- [x] "Add to cart" and "Buy now" buttons on the product page, quick add from the card for products without options, and "Choose options" for the others.
- [x] A side cart panel that opens on add, and a counter in the header and in the bottom bar.
- [x] The cart page: change the quantity, remove, the totals summary, an empty state.
- [x] Never exceeding the stock written in the data, and a maximum of 10 items per variant.
- [x] Matching the cart against the site data after every deployment through `/cart-catalog.json`: a notice when a price changes or a product sells out.
- [x] The wishlist: a heart button on the card and on the product page, a wishlist page, and a counter in the header.
- [x] The new interface inspired by the Webishop template: the navy header, the mega menu, the bottom bar, the new home sections, and the share button on the product page.

**Definition of done:** closing the browser and coming back a day later shows the cart and the wishlist as they were, and no quantity above the stock can be added.

### Phase 4: The demo checkout ✅

**Duration:** 4 to 5 days

- [x] Shipping settings (the cities and prices, the delivery time, the free-shipping threshold and express delivery) and coupons in `src/data/shipping.ts` and `src/data/coupons.ts`, validated at build time.
- [x] The checkout page: contact details, address, shipping, cash on delivery, and the summary (sticky on desktop, collapsible on mobile).
- [x] Instant validation with React Hook Form and Zod, with Arabic messages, and moving to the first field with an error.
- [x] Applying a coupon and updating the total instantly, and a hint with the amount left for free shipping.
- [x] A confirmation page with a demo order number and a summary, emptying the cart, and a clear notice that the order is for display only.
- [—] A "Send the order over WhatsApp" button: not chosen, since decision 3 was the demo confirmation.

**Definition of done:** a full order, from the product page to the confirmation, in under a minute on mobile.

### Phase 5: Static pages and content ✅

**Duration:** 2 to 3 days

- [x] About us, Contact us, Shipping, Returns, Privacy, Terms and FAQ pages from text files in `src/content/pages`, with a shipping table built from the shipping file, and FAQ answers that open and close, with FAQPage data for search engines.
- [x] Contact through WhatsApp, email and phone links, and a Google Maps link once an address is added. The current details are placeholders, deliberately invalid.
- [x] A floating WhatsApp button, shown only when the number is set.
- [x] An announcement bar at the top of the site, editable in `src/config/site.ts`.

### Phase 6: Improvements and polish (complete except a real phone)

**Duration:** 4 to 5 days

- [ ] Review every page on a real phone (iPhone and Android). The pages were reviewed at phone sizes in the browser; the owner's own test on a phone remains.
- [x] Performance: the code for the cart, the menu, zoom, filtering and notifications loads after the page appears, tabs are lightweight and need no library, and only the Arabic font is preloaded. Page JavaScript dropped by about 15%, and Lighthouse on mobile is 91 to 100 for the main pages.
- [x] Share images (Open Graph) at 1200×630 for every product (image, name, price and discount) and every category, and a general image for the store, generated at build time with the store's font and colors.
- [x] Privacy-friendly analytics: Plausible or Umami with one line in the settings, currently off, and the privacy page updates itself when it is turned on. Google Analytics is ruled out because it needs cookies and consent.
- [x] A review of the Arabic copy (spelling, hamzas, punctuation and Modern Standard Arabic) and of accessibility (headings, button and link names, a skip-to-content link as the first element, and keyboard navigation in tabs and dialogs).
- [x] Light motion: a heartbeat when saving to the wishlist, FAQ answers that open smoothly, and all motion stops for anyone who asked for reduced motion in their device settings.

**Definition of done:** Lighthouse 90 or more for performance, SEO and accessibility on mobile.

### Phase 7: Testing and quality assurance (complete except the items that need the owner)

**Duration:** 4 to 5 days

- [x] Vitest tests in `tests/unit` (121 at the end of this phase, 152 after the November 4 review) for price formatting, Arabic search, plural forms, filters and their URLs, the cart and its matching, shipping and coupons, the order form, and validating the data files with Arabic messages.
- [x] Playwright tests on the static build in `tests/e2e`: browsing, search, filtering and sorting, the cart, checkout, the wishlist, the mobile menu and the 404 page, at mobile and desktop sizes. They do not depend on specific product names.
- [x] Testing on Chrome, Safari, Samsung Internet and Firefox: the tests pass on the Chrome engine (desktop and Galaxy S24, which is the Samsung Internet engine) and on the Safari engine (iPhone 15). Firefox runs in GitHub Actions, because the test tool's build of Firefox does not start on our Windows machine, and it passes there since the project was pushed to GitHub.
- [ ] Testing with 3 to 5 real people without help, noting where they got confused. The tasks and the feedback table are ready in `USER-TESTING.md`.

**Definition of done:** all automated tests pass in GitHub Actions, and the test users complete an order without help.

### Phase 8: Deployment and launch

**Duration:** one to two days

> **November 4, 2026:** the deployment files (`public/_headers` and `netlify.toml`) and the step-by-step guide `DEPLOYMENT.md` were prepared, and the owner postponed connecting the hosting and the domain.

- [ ] Choose a host and connect it to GitHub for automatic deployment, or upload the contents of the `out` folder by hand.
- [ ] Connect the domain and enable HTTPS.
- [x] Set up the 404 page and the security headers (ready in `out/404.html` and `public/_headers`, and checked locally with a server that applies the headers).
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain and rebuild.
- [ ] Submit the sitemap to Google Search Console.
- [ ] A full test on the real URL from a phone.

### Phase 9: After launch

- [ ] A fixed routine for updating products: edit the file, add the images, push the change to GitHub, then automatic deployment.
- [ ] Review the analytics monthly.
- [ ] Update the packages monthly.
- [ ] Evaluate: is it time to add a server? (section 16)

### Phase 10: Design evolution: the "Spotlight" identity ✅ (built November 6, 2026)

**Status:** proposed on November 6, 2026, and decisions 9 to 11 in section 17 were taken the same day: the electric blue accent, five demo cut-outs and pill buttons. Before any code is touched, the owner asked for an interactive prototype of the hero (the tinted backdrop and the 3D turn), which is kept outside the project. The owner reviewed it the same day and asked for three changes, which are now part of this phase: every product photo is a cut-out, the backdrop changes the moment the photo does, and the category tiles and the product page use the same stage, so the whole site has one look. The phase was built the same day on the Git branch `phase-10-spotlight`, in four commits that each pass `pnpm verify` (`DESIGN.md`, the code and its tests, the cut-out photos, and the documentation) instead of one per step, because the steps share files; what remains is the owner's look on a real phone and merging the branch.

**Scope:** design only. No new pages, no new features, and no change to the site map, the purchase journey, the folder structure or the shape of the data files (except one optional field, see 10.3). Every component keeps its name, its file and its props; only its look changes.

**Duration:** 6 to 8 days

#### 10.1 The references

Two concept designs the owner found, described here so they can be rebuilt in Arabic without copying anything from them:

1. **A one-product store page (a puffer jacket).** One product at a time fills the screen, and the whole page background takes the product's color as a soft gradient (orange for an orange jacket). A dark card in the middle holds a slim navigation row, a two-line headline with a short paragraph, the product floating in front of the card with a soft shadow, the price with the old price struck through, three size circles and one button. Two arrows move to the next product, and the background changes color with it.
2. **A tech gadget storefront.** A near-black page with a blue tint, one electric blue for buttons, links and glows, a hero with a large product standing on a glowing round platform beside a large headline and two buttons, a row of four trust cards right under the hero, "Shop by category" as square dark tiles with the product's photo on them, "Featured products" as dark cards with a New, Best seller or Sale badge, the price and a cart icon in the corner, a wide blue gradient banner, and a final row of perks.

The store keeps everything that already works in its structure and takes three things from the references: the colors and depth of the second, the **changing background** of the first, and a **3D movement between photos** that both suggest.

#### 10.2 The identity: "Spotlight" (بقعة ضوء)

The idea in one sentence: the store is a dark stage, every product stands in a spotlight, and the stage lights take the product's own color.

- **Colors.** A near-black background with a blue tint in three shades, white text, one electric blue for actions and prices, and a fourth color that is never fixed: the **tone** of the product on screen, which tints the backdrop behind it. The proposed values, to be confirmed by `pnpm design:lint`: background `#0b0e14`, surface `#141821`, light surface `#1e2430`, border `#2a3344`, secondary text `#a3adbf`, primary `#4f8cff` with dark text on it (`#0b0e14`, a contrast of 6:1), and the same red, yellow, green and WhatsApp green as today. The blue replaces the orange everywhere the orange is used now (buttons, prices, badges, counters, the active tab, the announcement bar, hover links and the footer bar), so the "one accent color" rule stays. Decision 9 keeps the orange instead if the owner prefers it.
- **The tone.** Each product photo gets a tone at build time: the average direction of the hue of its colorful pixels, weighted by how colorful each one is, with transparent pixels ignored, and a strength that says how colorful the photo is. A photo with no clear color (a white shirt, a black speaker) gets no tone, and the backdrop stays neutral. The tone is always drawn at a fixed lightness in the `oklch` color space, so white text on a tinted backdrop keeps a contrast of at least 4.5:1 whatever the product's color; a unit test checks the worst case across every hue. The owner can override the tone of any photo in the data file.
- **Shapes.** Buttons, the search field, chips and tabs become pills (fully rounded); cards, tiles and dialogs grow to 16 px corners; fields keep 8 px and image boxes 12 px; badges keep 4 px.
- **Depth.** Still no shadows on cards. Depth comes from the background shades, from thin borders that are slightly lighter on cards, and from **one light source per screen**: a glowing ellipse (the "platform") under the product on the stage, drawn as a radial gradient in the product's tone. A card lifts by 2 px and its border takes a hint of blue on hover. No blur filters anywhere, because they are slow on phones.
- **Typography.** Unchanged: IBM Plex Sans Arabic in three weights, at the same sizes. A small blue label (the "eyebrow") above the hero headline replaces today's pill badge.
- **Motion.** Short and purposeful, as today, plus the two movements in 10.4. Everything is still off for anyone who asked for reduced motion.

#### 10.3 The stage: a backdrop that follows the product

The stage is built from small shared parts in `src/components/shared`: `StageBackdrop` (the light), `StageVisual` (the photo on its platform) and `PhotoBox` (the small version in cards and tiles). Its styles are utilities in `globals.css` (`stage-backdrop`, `stage-platform`, `stage-photo` and `tone-wash`), which read the tone from two CSS variables that `toneStyle()` in `src/lib/tone.ts` sets, and its motion is the hook `useStageMotion` in `src/hooks`. The hero and the product gallery use it:

- A backdrop in two layers that cross-fade: the page background, and a radial gradient in the product's tone from the middle of the stage. The backdrop follows the swipe itself: as the next slide moves toward the middle, its tone blends in by the same fraction, so the color changes the moment the photo does, with no delay and no fade after the swipe settles.
- The platform under the product: an ellipse in the tone, brighter in the middle, drawn as a radial gradient.
- The product photo in front of it. A **cut-out photo** (transparent background) floats directly on the backdrop above the platform. A **regular photo** sits in a 16 px frame with a thin border, and the platform glows around the frame's bottom edge, so the stage works with the current Pexels photos and with the owner's future photos alike.
- **On the home page:** every hero slide is a stage. The eyebrow, the headline, the text, the price and the blue button sit beside the product on desktop and under it on phones. The text stays white and readable because of the fixed lightness.
- **On the product page:** the gallery is a stage. Choosing a color moves the gallery to that color's photo, as today, and shifts the backdrop to that photo's tone. The purchase panel beside it keeps its layout.
- **Where the tone comes from:** `pnpm images`, which already runs before `dev` and `build`, writes `public/images/image-meta.json`: for each photo, its main color (the average of its colorful pixels around their most common hue) and whether it has a transparent background. The site turns the color into a hue and a strength in OKLCH (`src/lib/tone.ts`). The catalog reads the file at build time with a guard (`src/lib/catalog/image-meta.ts`), and a missing file means no tones, so the unit tests and a fresh clone still work. `ProductImageInput` gets one optional field, `tone`, for the owner to override a photo's tone with a hex color. `ProductImage` carries the tone to the hero, the promo tiles, the wide banner, the gallery and the share images, and the card image carries it too (two short numbers per product in the search index) for the wash behind the cut-out on the cards and the category tiles.

#### 10.4 Moving between photos in 3D

- **Turning photos.** The hero slides and the gallery photos already swipe with scroll-snap. On every frame of a swipe, each photo's distance from the middle of the track sets its turn: the photo that leaves rotates away by about 35 degrees around its vertical axis, moves back, shrinks and fades out, and the one that arrives turns into place. The turn is tied to the swipe itself, so it works with a finger, the arrows, the thumbnails and the keyboard, and mirrors itself in the Arabic direction. It is a few lines of JavaScript on the scroll event (scroll-driven CSS animations were tried first in the prototype, but Chromium computes horizontal view timelines wrongly in the right-to-left direction), so it works the same in every browser.
- **Tilt on desktop.** The same hook tilts the photo on a stage by a few degrees toward the mouse, on the hero and the product page, so the product reads as an object with depth. It runs only on devices with a mouse, and never with reduced motion.
- **The platform follows the turn:** it narrows and dims as a photo leaves, and widens as the next one arrives.
- **Reduced motion:** the turn and the tilt are off, and photos and backdrops change with a plain fade.

#### 10.5 Every component in the new identity

Only looks change here; names, files, props and order stay.

- **Announcement bar:** a thin blue bar with dark text, as today's orange one.
- **Header:** the surface color with a 1 px bottom border; the logo mark becomes a blue rounded square with the dark bag icon; the search pill in the light surface with a blue focus ring; links turn blue on hover; the "تسوّق الآن" (Shop now) button becomes a pill with a trailing arrow.
- **Hero:** the stage (10.3 and 10.4), the eyebrow, the headline, the text, the price and one blue pill button. Dots and arrows stay, and there is still no autoplay.
- **Trust strip:** six cards with a thin border and the icon in a blue-tinted circle, inside the page container and pulled up into the hero's bottom edge on desktop; two columns on phones, three on tablets and six on wide screens.
- **Promo grid, spotlight cards and the wide banner:** 16 px corners, the photo on a tone-tinted backdrop with the platform glow (cut-outs float, photos are framed), and the text over the dark side of the gradient as today.
- **Category tiles:** square dark tiles. In the 12 px box on each tile, a cut-out of one product of the category floats on a wash of that product's tone (the small glow under it included), and the name and count sit under the box instead of over a photo. The category's own photo is no longer shown there.
- **Product card:** 16 px corners, a 1 px border that lightens on hover, the lift on hover, the cut-out in its 12 px box on a wash of its tone, the discount badge in blue with dark text, the price in blue, and the round blue cart button in the corner with its ring in the background color, as today.
- **Tabs, chips and the countdown:** pills, with the active tab in blue with dark text.
- **Product page:** the same stage as the hero (the cut-out on its platform, the turn between photos, and the backdrop that takes the chosen color's tone the moment the photo changes), with the thumbnails as a row of 12 px boxes (the active one with a blue border), the purchase panel unchanged in layout, option pills, the trust card and the tabs in the new surfaces, and the zoom dialog with 16 px corners.
- **Cart panel, checkout, listings and filters, static pages, empty states, skeletons, notifications and the 404 page:** colors and corners only.
- **Mobile bottom bar:** the surface color, with the active item in blue.
- **Footer:** the surface color, blue hover links, and the 12 px orange bar becomes a 3 px blue line that fades toward the edges.
- **Share images:** the new colors in `OG_COLORS`, and a product's share image takes its photo's tone as the backdrop, at the fixed lightness.
- **Icon and theme color:** `src/app/icon.svg` in blue, and `themeColor` in the new background.

#### 10.6 Photos

The floating product in both references is a **cut-out**: a photo with a transparent background, the normal result of product photography. After the prototype, the owner decided that **every product photo is a cut-out** (decision 10): a regular photo is still framed, as a fallback, but the demo data gets cut-outs for all of its product photos, made once with an open-source segmentation model that runs locally (the prototype used it on 13 photos, about 4 seconds each, with no manual work), and the category tiles show a product cut-out instead of the category photo. The stage detects a cut-out by its transparent pixels (`pnpm images` records it in `image-meta.json`, and the WebP copies keep the transparency). The guidelines for the owner's photos go in `DESIGN.md` and the README: a PNG with a transparent background, at least 1200 px on the long side, the product centered with about 10% of empty space around it, and no text on the photo.

**Result:** all 42 demo photos are cut-outs. Where the model could not separate the product cleanly (a black headset on a black mat, a white power bank in a hand) or the product was too small in its photo, another Pexels photo was used; the black headset is the red one with its red parts recolored; and the color options of the prayer rug, the speaker, the backpack and the hair dryer were adjusted to the photos that exist. The pink dress and the green rug set their tone in the data, because the color measured from their photos is brownish.

#### 10.7 What does not change

- The rules in `DESIGN.md` that are not about colors and shapes: right to left with logical properties, mobile first from 375 px, 44 px touch targets, AA contrast checked by `pnpm design:lint`, Arabic plural forms, Western digits in prices, no fake numbers, no autoplay, no content revealed by motion on scroll, no hover-only information, and text on photos only over a darkening layer.
- The code rules in `AGENTS.md` and the project skills: one component per file, typed props, keys from the data, no `any`, `as` or `!`, server components by default with the smallest client parts only, and the deferred loading of panels and far-down sections.
- **Performance budget:** no new dependency (no 3D or animation library; everything is CSS plus one small hook). At most 3 KB (gzipped) more JavaScript and 6 KB more CSS on the home page. The hero photo stays the first-screen image with high priority, the backdrop is CSS, and the stage has a fixed aspect ratio, so there is no layout shift. Lighthouse on mobile stays at 90 or more on the home page, a product page and a listing.
- **Tests:** the unit tests gain the tone computation, the guard of `image-meta.json` and the contrast check across hues. The browser tests keep passing because they rely on text and roles, and gain two: the backdrop's tone changes when a color is chosen, and the gallery's arrows and thumbnails move between photos.

#### 10.8 Steps, in order

Each step is one commit that passes `pnpm verify`, and the site is reviewed at 375 px and 1280 px after each.

- [x] **Decisions 9 to 11** from the owner (section 17): taken on November 6, 2026.
- [x] **A prototype of the hero** outside the project (a single page with the new colors, the tinted backdrop and the 3D turn), for the owner to see and adjust before the code changes: made and reviewed on November 6, 2026, then extended with the product page and the category tiles at the owner's request.
- [x] **The identity on paper:** rewrite `DESIGN.md` (the values in the front matter, then Overview, Colors, Shapes, Elevation, Components and Do's and Don'ts) and the mapping table in the design skill; `pnpm design:lint` passes with no warnings.
- [x] **The tokens in code:** `globals.css`, the pill buttons in `ui/button.tsx`, `OG_COLORS`, `icon.svg` and `themeColor`. The whole site switches color in this step and still looks right.
- [x] **The image meta pipeline:** the tone and transparency computation in `scripts/images.mjs`, `public/images/image-meta.json`, the guard and reader in `src/lib/catalog`, the optional `tone` field in the data, and the unit tests.
- [x] **The stage and the hero:** `StageBackdrop`, `StageVisual` and `useStageMotion`, the light that blends during the swipe and the platform, the turn on swipe, and the restyled hero.
- [x] **The product page:** the gallery on the stage, the tone that follows the chosen color, the desktop tilt, the thumbnails and the zoom dialog.
- [x] **The home sections:** the trust strip, the promo grid, the spotlight cards, the category tiles, the wide banner, the deals countdown, the tabs, the reviews and the contact cards.
- [x] **The shell and the rest:** the announcement bar, the header, the mobile bar, the footer, the cart panel, checkout, the listings and filters, the static pages, empty states, skeletons, notifications and the 404 page.
- [x] **Photos:** every demo product photo cut out with the local model, the product cut-outs of the category tiles, and the photo guidelines in `DESIGN.md` and the README.
- [x] **Verification on the development machine:** every check and the unit tests (`pnpm verify`), the production build, and the browser tests on Chrome, an Android phone and an iPhone (Safari's engine), with the two new tests; the pages reviewed at phone, tablet and desktop widths; the README status, this plan's changelog and section 4.5 brought up to date.
- [ ] **Verification by the owner:** a look on a real phone, then GitHub Actions (with Firefox) once the branch is pushed, and Lighthouse on mobile after the deployment.

**Definition of done:** the owner approves the look on their phone, the GitHub Actions checks pass, Lighthouse on mobile is 90 or more on the three page types, and every rule in 10.7 still holds.

#### 10.9 Risks

| Risk | How it is avoided |
| --- | --- |
| An older browser without registered CSS properties (Safari before 16.4, Firefox before 128) | The photos still turn, and only the tilt toward the mouse moves without easing; nothing breaks and nothing is hidden. |
| The tone of a lifestyle photo is its background, not the product (a watch on a wooden table gives brown) | That is usually pleasant, because the backdrop matches the photo; otherwise the owner overrides the tone in the data. Cut-outs always give the product's own color. |
| White text on a tinted backdrop loses contrast on light products (yellow, beige) | The fixed lightness in `oklch` keeps the backdrop dark whatever the hue, and a unit test checks every hue. |
| Too many glows make the page busy and slow | One light source per screen (the stage), low-alpha washes elsewhere, radial gradients only, and no blur filters or card shadows. |
| The redesign quietly changes behavior | Each step touches styles and the two new visual behaviors only, and the browser tests of every flow must stay green at each commit. |

### Phase 11: Najm, the 3D mascot ✅ (built November 7, 2026)

**Status:** asked for by the owner on November 6, 2026: a 3D character that follows the visitor and carries the products they add into a cart. The owner chose a reference (a glossy blue 3D dog mascot on Dribbble, "toto" by Samuel Briskar) and asked for a character in the same style. Two interactive prototypes, kept outside the project, settled the details the same day: the first was too big, so the character shrank to a corner; then the owner asked for a different behavior on each page and for similar-product suggestions after an add, and for no background behind him. The phase was built on November 7, 2026 on the branch `phase-11-mascot`.

**Scope:** one new feature, in its own folders (`src/components/mascot` and `src/lib/mascot`), with small changes where it plugs in: the add-to-cart buttons, the store shell, the footer, and one new static file. No change to the pages, the data files or the purchase journey.

#### 11.1 Decisions

- **The look:** a small round blue dog with a big head, pointy ears with pink insides, his tongue out and a gold heart tag, in the style of the reference but not a copy of it, in a deeper shade of the store's blue. He is built in code from simple shapes (spheres, cones, capsules), so there is no model file to download, and his colors are in `DESIGN.md`.
- **The library:** three.js, in one class (`MascotScene`) that queues his moves. React Three Fiber was considered and left out: the scene is one character with timed moves, and it would add a second renderer that must match the exact React version, for no gain.
- **No background:** a transparent canvas that lets every tap through, with only a soft shadow under him that fades before its edge, so he never covers the page and adds no second light to the screen.
- **Size and place:** 200×208 px on a tablet or desktop and 136×144 px on a phone, in the corner on the start side, above the mobile bottom bar; the WhatsApp button keeps the other corner.
- **A behavior per page:** a greeting on the home page; his cart on the shopping pages, where he catches every added product and suggests two similar ones; a count on the cart page, where he takes out deleted products; silence on the checkout form; a celebration on the order confirmation.
- **He replaces the cart panel** as the add confirmation while he is on screen, because the panel would cover him and his suggestions; his bubble opens the panel with "View cart". Without him (hidden, not loaded yet, or no WebGL 2), the panel opens as before.
- **Hiding him:** a button in his greeting and in the footer, saved in the browser.
- **Performance:** his code loads only after the page has loaded and the visitor first moves, touches or scrolls, and drawing stops a few seconds after the visitor stops moving. With reduced motion he stands still.

#### 11.2 Steps

- [x] **Data:** `getSimilarProducts()` and the static file `/similar-products.json` (up to four in-stock similar products per product), with its type guard.
- [x] **The scene:** his body, his cart, his poses, his moves (catch, throw, take out, celebrate, wave), following the pointer, and a drawing loop that stops when nothing moves.
- [x] **The React side:** `LazyMascot` in the store shell, his canvas and speech bubble, the suggestions, the footer button, and the hooks that tie him to the cart and the pages.
- [x] **Plugging in:** `useAddToCart` tells him about an add (with the pressed button, so the photo flies from there) and opens the cart panel when he isn't listening.
- [x] **Tests:** unit tests for his logic and the new data file, and two browser tests on Chrome, an Android phone and an iPhone; every other browser test starts with him hidden.
- [x] **Documentation:** `DESIGN.md` (Mascot, his colors and his motion rules), the README and this plan.
- [ ] **Verification by the owner:** a look on a real phone, GitHub Actions once the branch is pushed, and Lighthouse on mobile after the deployment.

#### 11.3 Risks

| Risk | How it is avoided |
| --- | --- |
| He slows the first screen on phones | His code is a separate file that loads only after the visitor's first move, and never for a visitor who hid him or a browser without WebGL 2. |
| He covers products or buttons | He is small, in a corner, and lets every tap through; only his bubble takes clicks, and it closes by itself and on every page change. The visitor can hide him for good. |
| He drains the battery | Drawing stops a few seconds after the visitor stops moving, and while the tab is hidden. |
| Moving too much for some visitors | With reduced motion he stands still and products appear in his basket at once. |
| The browser tests expect the cart panel after an add | Every test except his own starts with him hidden, through a saved choice in `playwright.config.ts`. |

### Phase 12: Running on a Next.js server ✅ (built November 7, 2026)

**Status:** asked for by the owner on November 7, 2026: run the store on a Next.js server and continue the project from there. The store was already built with Next.js (App Router); what changed is how it runs: instead of a static export (`output: "export"`), `pnpm build` prepares the site and `pnpm start` runs the server. Built on the branch `server-mode`, which starts from phase 11.

**Scope:** the way the site is built and served, a products API, a database for orders, and the checkout's last step. The design, the catalog pages, the cart, the wishlist, search, Najm and the static pages stay as they were.

#### 12.1 Decisions

- **Hosting:** Netlify, with its own Next.js integration (`@netlify/plugin-nextjs`), which runs the server on Netlify's functions. The code doesn't depend on it: a Node.js server (`next start`, or Docker) works the same.
- **Database:** PostgreSQL through Prisma 7, for the orders only. Products and categories stay in `src/data`, built into the catalog in memory.
- **Rendering:** the classic model of Next.js. The catalog and help pages are still prepared at build time (`generateStaticParams` with `dynamicParams = false`), and the data files, share images, sitemap and robots.txt are route handlers marked `force-static`. Cache Components is not turned on: the upgrade guide warns that it is not a rename-only change, and the catalog in memory needs no cache.
- **Addresses:** they keep their trailing slash (`trailingSlash`), so links and search engine entries don't change. The server redirects an address without it with a 308, the API included.
- **Security headers:** in `next.config.ts` (`headers()`), so every host sends the same ones. The content security policy keeps `'unsafe-inline'`, because a nonce would make every page render on each request.
- **Orders:** a Server Action checks the form again, rebuilds the lines from the catalog (the server's prices and stock, never the browser's), and saves the order; each order has its own page. The coupons stay on the server.

#### 12.2 Steps

- [x] **The server instead of the static export:** `headers()` instead of `public/_headers`, no build output fixes for `out/`, `sharp` as a runtime dependency, the browser tests against `next start`, and Netlify's plugin.
- [x] **Products API:** `GET /api/products/` (with `q` and `category`) and `GET /api/products/<slug>/`; search and the wishlist load it instead of `search-index.json`. The server's file tracing no longer takes the whole project.
- [x] **Database:** `prisma/schema.prisma` with the orders and their lines, the first migration, `pnpm db:start` for a local PostgreSQL, `GET /api/health/`, and a PostgreSQL service in GitHub Actions.
- [x] **Orders on the server:** the `placeOrder` and `lookupCoupon` Server Actions, the order page `/orders/<id>/` with its error view, and the privacy, about and terms texts updated.
- [x] **Documentation:** the README, `DEPLOYMENT.md`, `AGENTS.md` and this plan.
- [x] **Deployment by the owner:** done on November 7, 2026: Netlify (`https://matjrii.netlify.app`) with a Supabase database through its session pooler. The lessons (the connection string, the secret variables, the project's visibility, the Prisma client in the build, Netlify's line break in `<head>`) are in `DEPLOYMENT.md`.

#### 12.3 Risks

| Risk | How it is avoided |
| --- | --- |
| Netlify's integration is not yet a verified adapter for this version of Next.js | The features it needs are few (a Server Action, one dynamic page, route handlers, headers); they are checked on the first deploy preview. A Node.js server or Docker is the fallback, with no code change. |
| The database is out of reach | Every page except an order's works without it; the order page shows a message with a retry button, and placing an order shows a clear message. `/api/health/` tells the owner. |
| A visitor's browser sends changed prices | The server ignores them: it prices the order from the catalog and refuses a total other than the one the visitor saw. |
| A deal ends while the server runs | The catalog is built when the server starts, as the pages are built at build time; as before, the site is rebuilt after a deal ends. |

### Phase 13: The products in the database ✅ (built November 7 and 8, 2026, live November 8)

**Status:** asked for by the owner on November 7, 2026: keep the products the way large stores do. The plan was written in a separate session and reviewed before the work started.

**Goal:** the store owner adds a product or changes a price or a stock count from an admin panel, and the change shows on the site within seconds, with no code change and no new deployment. Every confirmed order lowers the stock.

**What must not break:** the pages are not built from the database on every visit (the live mobile Lighthouse scores: home 95–96, product 90–94, list 93–94, and the free Supabase project has few connections); the site keeps working while the database is down (a free Supabase project pauses after a week without activity), and only placing an order and the admin panel stop; the classic rendering model stays; prices, stock and coupons come from the server; `/api/products/` keeps its shape.

#### 13.1 Decisions

- **Where the catalog lives:** PostgreSQL (the same Supabase database), read through one cached function tagged `catalog` (`unstable_cache`, revalidated daily so ended deals reprice). The pages stay prepared at build time and are refreshed on demand (`revalidateTag("catalog", "max")` after every change and every order, replaced on November 10, 2026 by `updateTag("catalog")`, which expires the copies at once: with the first form a page reached by a link kept its old copy); the product and category pages switch to `dynamicParams = true`, so a new product renders on its first visit. Rebuilding the whole site on each change (a Netlify build hook) is the fallback if on-demand refresh fails on Netlify.
- **The cache holds the rows, not the built catalog:** `unstable_cache` stores its result as JSON, and the built catalog has `Map`s (`categoryBySlug`, `productBySlug`) that JSON drops. The cached value is the plain rows of `src/lib/catalog/rows.ts`; the catalog is built from them after reading.
- **Stock:** lowered inside the order's transaction (`updateMany` where the stock is still enough), so the last piece can't be sold twice. The order is priced from the database rows with the same rule for ended deals as the catalog.
- **Admin panel:** under `/admin/`, behind one password (a scrypt hash and a signed cookie in environment variables), decided by the owner. The session is checked in every admin page and every admin Server Action (Next.js recommends checks next to the data over `proxy.ts`).
- **Uploaded photos:** Supabase Storage, in a public bucket, decided by the owner; sharp makes the five sizes and measures the tone, with the measuring moved out of `scripts/images.mjs` into a shared module.
- **Seeding:** `pnpm db:seed` fills an empty catalog from `src/data` and does nothing once products exist; the Netlify build runs it, so the owner never handles the production database address. `--force` rewrites the `src/data` products for the local database and the tests, whose orders lower the stock.
- **Kept in the code for now:** the home page content, the coupons, shipping and testimonials.

#### 13.2 Steps

Each step is merged into `main` and deployed on its own, once the checks and the browser tests pass (each production deploy costs 15 of the free plan's 300 monthly Netlify credits).

- [x] **The tables and the seed:** categories, products, product photos and variants in `prisma/schema.prisma` (dates as `@db.Date`, prices in halalas, unique slugs, SKUs and option combinations), `prisma/seed.ts` run through `tsx`, the rows in `src/lib/catalog/rows.ts` with their unit test, and the seed in GitHub Actions and the Netlify build. The site doesn't read the tables yet.
- [x] **The catalog read from the database:** `src/lib/catalog/load.ts` caches the rows (tag `catalog`, one day) and `build.ts` builds the catalog from them; the catalog functions are `async`; the product and category pages take `dynamicParams = true`; two connections per server process. Locally, with the database stopped, every page, file and API answer still came from the cache. The check that a tag refresh reaches the pages on Netlify comes with the next step, whose orders revalidate the tag.
- [x] **Stock lowered by orders:** the order is priced from the database at that moment, its stock goes down in the order's transaction (`updateMany` while the stock covers the quantity, SKUs in a fixed order), and the catalog tag is revalidated after it. A database test (`pnpm test:db`, also in GitHub Actions) shows two orders for the last piece leave one refused; the browser tests reseed before they run and check the stock the store shows going down. A real order on the live site (November 7, 2026) lowered the stock and refreshed the pages and the products API, but not `/cart-catalog.json`: on Netlify the tag doesn't refresh a route handler prepared at build time, so the data files and the sitemap are now computed on every request from the cached catalog.
- [x] **The admin panel:** `/admin/` behind one password (`pnpm admin:password` prints `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET`; a signed `httpOnly` cookie for seven days; the session checked in every page and Server Action), the products list with quick stock edits and hiding, the product form (photos and variants as rows, checked with the data files' rules), and the categories. Every save revalidates the catalog's tag; a browser test adds a product, changes its price and hides it, and follows each change in the store.
- [x] **Uploading photos** to Supabase Storage: "رفع" (Upload) next to each photo in the product form sends a PNG, WebP or JPEG of up to 4 MB to a Server Action (`bodySizeLimit` 5 MB), which checks the session and the file, makes the five WebP copies and measures the tone with `src/lib/images/prepare.ts` (moved out of the images script, which is now `scripts/images.ts` through `tsx`, with byte-identical output), saves the copies under a new name in the public bucket `product-images` with the secret key in the `apikey` header, and keeps the measured look in a new `uploaded_images` table for the product's save. The image loader treats an address without an extension, local or uploaded, as prepared in five sizes; `SUPABASE_URL` joins the CSP's `img-src` at build time; `/api/health/` reports whether sharp works in the server and whether the bucket is public, so the risk below is checked on the next deploy. Unit tests with a mocked Supabase; a database test (`tests/db/uploaded-images.test.ts`) that a saved product's photo takes the look measured on upload; and a browser test that uploads to a fake storage (`tests/e2e/fake-storage.ts`) and saves a hidden product with the photo's address. Its product stays hidden because the test server is built without `SUPABASE_URL`, so the store's pages, which other tests open at the same time, would block the fake storage's photo. Deployed together with the next step, at the owner's request (November 8, 2026), to save Netlify credits.
- [x] **The prepared files and the documentation:** `cart-catalog.json`, `similar-products.json` and the sitemap were already computed on every request (step 13.3). The share images stay drawn by `next build` only: their routes take `dynamicParams = true`, and a product or category added after the deploy gets a redirect to the site's image until the next deploy draws its own, checked by the admin panel's browser test; an uploaded photo is downloaded from Supabase Storage for its share image, with the logo if it can't be. The README, `DEPLOYMENT.md` (the two Supabase variables, the bucket, the health check) and `.env.example` cover the uploads. Deployed with step 13.5.
- [x] **Live check (November 8, 2026):** the first deploy answered `"storage":"off"` and its content security policy had no Supabase address, because `SUPABASE_URL` was missing from Netlify's variables (Netlify had flagged it as sensitive, and a variable that isn't secret must keep all scopes on the free plan; the lesson is in `DEPLOYMENT.md`). After it was added and the site deployed again, `/api/health/` answered `database`, `photos` and `storage` all `up`, the policy's `img-src` names the Supabase project, `/admin/` leads to its sign-in page, and a share image for an unknown product redirects to the site's image. Uploading a real photo from the live admin panel is the owner's to try, with their password.

#### 13.3 Risks

| Risk | How it is avoided |
| --- | --- |
| On-demand refresh by tag doesn't reach the pages on Netlify | Checked on the live site right after the catalog step, before anything builds on it; the fallback is a build hook called by the admin actions. |
| sharp or the share-image fonts don't work inside a Netlify function | `/api/health/` reports whether sharp makes a WebP copy in the server: it answered `"photos":"up"` on the live site (November 8, 2026). The share images are drawn only by `next build`, and products added later take the site's share image. |
| Supabase's connections run out | A pool of one or two connections per function; the transaction pooler is the next step. |
| Deploy previews share the production database | Their builds run the migrations too, so migrations only add, and previews are not used to test writes. |

---

## 8. Checkout without a server

| Option | How it works | When it fits |
| --- | --- | --- |
| **A. Demo confirmation (phases 4 to 11)** | Validate the details, then show a confirmation page with an order number generated in the browser, then empty the cart. Nothing is sent anywhere | A showcase site, or a prototype shown to clients |
| **B. Send over WhatsApp** | A button opens WhatsApp with a ready message containing the products, the total and the customer's details, and the customer sends it to the store's number | Receiving real orders without a server |
| **C. A real server (phase 12, stored orders)** | The server checks and stores the order, and the order has its own page. Online payment and notifications are still for later | When it becomes a full, real store |

- **Shipping:** zones with a fixed price per zone, and free shipping above a set amount, written in the settings file.
- **Payment:** "Cash on delivery" is the only method shown. Any online payment needs a server.
- **Coupons:** demo codes and discounts in the settings file. Since phase 12 the codes stay on the server, which checks a code when the visitor applies it.

---

## 9. Security and privacy

- No secret keys in the code. The database address lives only in the host's environment variables, and variables starting with `NEXT_PUBLIC_` (which reach the browser) never hold a secret.
- Since phase 12 the order form data is sent to the server and stored with the order; the privacy page says so. An order's page opens only with its long, unguessable id.
- The Server Actions check every argument again, and price the order from the server's own data. Placing an order is bounded: 10 orders an hour from one address, 50 products an order, a maximum length for every text field, and one saved order for a request that is sent twice.
- localStorage holds only the cart and the wishlist, with no sensitive data.
- HTTPS is enforced in the hosting settings.
- Security headers (such as CSP) are set in `next.config.ts` (`headers()`).
- Update the packages regularly, and check for vulnerabilities with `pnpm audit`.

---

## 10. Performance and SEO

**Performance:**

- Every page is ready HTML served from a CDN.
- WebP images in three sizes, lazy loaded, with the main image at high priority.
- The font is self-hosted and subset: three weights, in Arabic and Latin files, and only the Arabic files are preloaded.
- The search index loads only on the first use of search.
- Only interactive components send JavaScript to the browser.

**SEO:**

- Short English URLs for products and categories, because they work on every host.
- A unique title and description for every page, and a share image.
- Structured data: Product, BreadcrumbList, Organization and WebSite.
- sitemap.xml and robots.txt generated at build time.
- The displayed data updates only after a rebuild and a redeploy.

---

## 11. Testing strategy

| Type | Tool | What is covered | When it runs |
| --- | --- | --- | --- |
| Unit | Vitest | Prices, Arabic search, filters, cart and shipping calculations, data validation | With `pnpm test` or `pnpm verify`, and in GitHub Actions on every push and pull request |
| End-to-end (E2E) | Playwright | User journeys on the production server (with a PostgreSQL database), at mobile and desktop sizes | In GitHub Actions on every push and pull request |
| Manual | A checklist | The look, the copy, real devices | Before every deployment |
| Users | Observation | Ease of use | Before launch |

---

## 12. Deployment and hosting

### 12.1 Build output

Since phase 12, `pnpm build` prepares the site in `.next/` and `pnpm start` runs the Next.js server. The host runs that server; on Netlify its integration does it. Until phase 12, the build was an `out/` folder of static files.

### 12.2 Hosting options

Since phase 12 the host must run a Node.js server, so file-only hosts (GitHub Pages, cPanel uploads, Cloudflare Pages without a Workers adapter) no longer fit. The owner chose **Netlify** (decision 7).

| Host | Cost | Automatic deployment from GitHub | Notes |
| --- | --- | --- | --- |
| **Netlify (chosen)** | Free to start | Yes | Runs Next.js through its own integration; the database is created separately (Netlify DB or another PostgreSQL host) |
| A Node.js server (VPS) or Docker | Depends on the server | Through Actions | The fallback with no code change: `pnpm build` then `pnpm start`, or `output: "standalone"` in a container |
| Vercel | Free to start | Yes | The verified Next.js platform, but connections from the owner's network to it failed during the work |

> **Important:** during the work, connections from your network to some services were intermittent. Before choosing, open the host's website in your browser and make sure it works, and make sure visitors in your country can open the deployed site.

The steps for each host are in `DEPLOYMENT.md`.

### 12.3 Day-to-day workflow

1. Each feature goes in its own Git branch, then a pull request that GitHub Actions checks and builds.
2. Merging into the main branch means an automatic deployment.
3. Since phase 13, the store owner updates products, prices, stock and photos from the admin panel (`/admin/`), and the change shows on the site from the next request on, with no deploy. The data files in `src/data` only fill an empty database.

---

## 13. Estimated timeline

| Week | Phase | Main deliverable |
| --- | --- | --- |
| 1 | 0 + 1 ✅ | The foundation |
| 2 | 2 ✅ | The full catalog |
| 4 | 3 ✅ | Cart and wishlist |
| 5 | 4 + 5 ✅ | Checkout and content |
| 6 | 6 + 7 | Improvements and testing |
| 7 | 8 ✅ | Deployment (on Netlify, with phase 12) |
| 8 | 10 ✅ | The "Spotlight" design evolution |
| 8 | 11 ✅ | Najm, the 3D mascot |
| 8 | 12 ✅ | Running on a Next.js server, with stored orders |
| 8 | 13 ✅ | The products in the database and the admin panel |

**Total: about 7 weeks**, instead of 12 in the previous plan, because the server and the admin dashboard were removed, plus phases 10 and 11, which were built in a day each.

---

## 14. Risks and how to avoid them

| Risk | Impact | Prevention |
| --- | --- | --- |
| Mistakes when editing the data files by hand | Missing or broken pages | Zod validation stops the build with an Arabic message that pinpoints the problem |
| Large images | A slow site | The image script compresses them and generates suitable sizes automatically |
| A visitor thinks the order was really sent | Misunderstanding | Clear text on the confirmation page, or enabling sending over WhatsApp |
| A host cannot be reached from your country | Delayed deployment | The site is static and can move to any host in minutes |
| Needing real orders and payment later | Rework | The data layer is isolated, so adding a server does not require rebuilding the interface |
| Late RTL bugs | Rework | Logical CSS properties (start/end), and testing every component in Arabic from the start |

---

## 15. Final pre-launch checklist

**Functionality**

- [ ] Browsing, search, filtering, the cart, the wishlist and checkout work on the real URL.
- [ ] The 404 page appears for wrong links.

**Content**

- [ ] Every product has correct images, descriptions and prices, and no demo data is left.
- [ ] The static pages are complete, and the contact details, the logo and the icon are correct.

**Technical**

- [ ] The domain and HTTPS work, and `NEXT_PUBLIC_SITE_URL` is set to the real domain.
- [ ] Lighthouse 90 or more for the main pages.
- [ ] The sitemap is submitted to Google Search Console.

**Legal**

- [ ] The privacy policy and the terms are published.
- [ ] If the store is for display only, this is clear to visitors on the confirmation page.

---

## 16. Roadmap after the first version

Ordered by expected impact:

1. **An Excel/CSV import tool** that turns the product sheet into the data file automatically.
2. **Sending orders over WhatsApp**, if it was not enabled in phase 4.
3. **English for the store**, with an easy language switch.
4. **An installable web app (PWA)** that works offline for pages already visited.
5. **Building on the server (phases 12 and 13):** the server, stored orders, the products in the database, the admin panel and stock that goes down with every order are done. Next could come the orders in the admin panel, online payment and accounts.

---

## 17. Decisions needed from you

| # | Question | Why it matters |
| --- | --- | --- |
| 1 | Which country is the target, and which currency? (currently a placeholder: the Saudi riyal) | The currency, the cities and shipping prices, the mobile number format |
| 2 | What kind of products, and with which options (size, color, volume)? | The shape of the data and the filters |
| 3 | On "Place order": ✅ demo confirmation (October 31, 2026) | Phase 4 |
| 4 | Should visitors see that the store is for display only? | The text on the confirmation page and in the footer |
| 5 | Are the store name and the logo ready? (The colors and the font are approved.) | Replacing the placeholder name «متجري» (Matjari) |
| 6 | Should the store be in Arabic only, or in English too? | Translating from the start is easier |
| 7 | Which host and which domain? ✅ The host: Netlify (November 7, 2026). The domain is still open | Phase 8, phase 12 |
| 8 | Who will edit the product data? Do you want an Excel import tool? | The priority of the import tool in the roadmap |
| 9 | The accent color of phase 10: ✅ the electric blue of the second reference (November 6, 2026) | Phase 10, before any code is written |
| 10 | Product photos: ✅ every product photo is a cut-out (November 6, 2026, after the prototype): the demo photos are cut out once with a segmentation model run locally, and the owner's real photos must come as cut-outs | Phase 10 (10.6) |
| 11 | Buttons: ✅ pills, as in both references (November 6, 2026) | Phase 10 (10.2) |
| 12 | A server and a database: ✅ a Next.js server and PostgreSQL through Prisma, with the orders stored (November 7, 2026) | Phase 12 |

---

## Next step

The store is live at `https://matjrii.netlify.app` with phases 10 to 13. Sign in to the admin panel (`/admin/`) and upload a real photo to a product, then check it on the product's page. Review the site on your phone, including Najm and the new design, and test it with 3 to 5 people following `USER-TESTING.md`. At any time: choose the domain (decision 7), send the real contact details to replace the placeholders, answer decision 4 (keep or remove the "demo version" notice on the About us and Terms pages), and answer decisions 1 and 2 so the demo data can be replaced, now from the admin panel.
