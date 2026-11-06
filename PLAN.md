# Online Store Plan (Frontend-Only Showcase)

**Version:** 2.9
**Date:** November 5, 2026
**Status:** Approved. Phases 1 to 7 are complete except the items that need the owner (a review on a real phone and testing with real people). The phase 8 files are ready, and the owner postponed the deployment itself. A full review of code quality, performance and load capacity has been carried out. The project is on GitHub and the GitHub Actions checks pass.

---

## Changelog

| Version | Date | Change |
| --- | --- | --- |
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
> 1. The site is a frontend-only showcase: every page is prepared in advance as a static HTML file, and no server handles requests.
> 2. Product and category data is written in files inside the project, and any change to it requires rebuilding and redeploying the site.
> 3. The cart and the wishlist are saved only in the visitor's browser.
> 4. "Place order" is a demo: it validates the details and shows a confirmation page, with no payment and no stored order. Sending the order over WhatsApp is an option (section 8).
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

### 4.5 Design system (the "Warm Night" identity, approved on November 4, 2026; the full reference is DESIGN.md)

| Element | Decision |
| --- | --- |
| **Font** | IBM Plex Sans Arabic in three weights (400, 500 and 700), self-hosted and subset |
| **Colors** | A dark background in three shades with white text, a single orange for buttons, prices and badges, and a light red for errors |
| **Corners** | Buttons and fields 8 px, cards 12, badges 4, and tabs, chips and the search field fully rounded (pill) |
| **Spacing** | A 4 px scale (4, 8, 12, 16, 24, 32, 48) |
| **Icons** | Lucide, with arrows mirrored in RTL |
| **Numerals** | Western digits (0-9) for prices, to avoid confusion |
| **Dark mode** | The store is always dark, with no light mode |

The whole system is documented in `DESIGN.md` at the project root, which is the reference for any new design.

### 4.6 Accessibility

- Alt text for every image, and a label for every field.
- Keyboard navigation across the whole site, and a "Skip to content" link.
- Color contrast meets at least the AA standard, and touch targets are 44×44 px.

---

## 5. Technical architecture

### 5.1 Overview

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
    image: "/images/categories/clothing",
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

---

## 8. Checkout without a server

| Option | How it works | When it fits |
| --- | --- | --- |
| **A. Demo confirmation (default)** | Validate the details, then show a confirmation page with an order number generated in the browser, then empty the cart. Nothing is sent anywhere | A showcase site, or a prototype shown to clients |
| **B. Send over WhatsApp** | A button opens WhatsApp with a ready message containing the products, the total and the customer's details, and the customer sends it to the store's number | Receiving real orders without a server |
| C. A real server (later) | Stored orders, online payment, notifications | When it becomes a full, real store |

- **Shipping:** zones with a fixed price per zone, and free shipping above a set amount, written in the settings file.
- **Payment:** "Cash on delivery" is the only method shown. Any online payment needs a server.
- **Coupons:** demo codes and discounts in the settings file. Note: on a static site anyone can see the codes in the code, so they are for display only.

---

## 9. Security and privacy

- No secret keys in the code, because everything in the project reaches the visitor's browser.
- With option A, the order form data is not sent to any server; it stays in the visitor's browser.
- localStorage holds only the cart and the wishlist, with no sensitive data.
- HTTPS is enforced in the hosting settings.
- Security headers (such as CSP) are set for the host in `public/_headers`, since the site is static.
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
| End-to-end (E2E) | Playwright | User journeys on the static build, at mobile and desktop sizes | In GitHub Actions on every push and pull request |
| Manual | A checklist | The look, the copy, real devices | Before every deployment |
| Users | Observation | Ease of use | Before launch |

---

## 12. Deployment and hosting

### 12.1 Build output

`pnpm build` creates the `out/` folder, which contains the whole site: HTML pages, images, and CSS and JavaScript files. This folder is all that gets uploaded to the host.

### 12.2 Hosting options

| Host | Cost | Automatic deployment from GitHub | Notes |
| --- | --- | --- | --- |
| Netlify | Free to start | Yes | Easy, and the 404 page works automatically |
| Cloudflare Pages | Free | Yes | A very large CDN |
| GitHub Pages | Free | Yes, through Actions | Suits a repository on GitHub, but does not support custom headers |
| Regular hosting (cPanel) | Depends on the plan | No, manual upload | Uploading the contents of the `out` folder is enough |

> **Important:** during the work, connections from your network to some services were intermittent. Before choosing, open the host's website in your browser and make sure it works, and make sure visitors in your country can open the deployed site.

The steps for each host are in `DEPLOYMENT.md`.

### 12.3 Day-to-day workflow

1. Each feature goes in its own Git branch, then a pull request that GitHub Actions checks and builds.
2. Merging into the main branch means an automatic deployment.
3. Updating products means editing the data files and the images and pushing them; the site is then rebuilt and redeployed automatically.

---

## 13. Estimated timeline

| Week | Phase | Main deliverable |
| --- | --- | --- |
| 1 | 0 + 1 ✅ | The foundation |
| 2 | 2 ✅ | The full catalog |
| 4 | 3 ✅ | Cart and wishlist |
| 5 | 4 + 5 ✅ | Checkout and content |
| 6 | 6 + 7 | Improvements and testing |
| 7 | 8 | Deployment |

**Total: about 7 weeks**, instead of 12 in the previous plan, because the server and the admin dashboard were removed.

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
5. **Adding a server when needed:** a database, stored orders, online payment, accounts, an admin dashboard. The current architecture allows it, because data reading is isolated in `src/lib/catalog`, and the earlier server code is kept in the Git history.

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
| 7 | Which host and which domain? | Phase 8 |
| 8 | Who will edit the product data? Do you want an Excel import tool? | The priority of the import tool in the roadmap |

---

## Next step

Review the site on your phone, and test it with 3 to 5 people following `USER-TESTING.md`. Then, when you decide to go ahead, start **phase 8**: deployment, which needs decision 7 (the host and the domain); the steps are in `DEPLOYMENT.md`. At any time: send the real contact details to replace the placeholders, answer decision 4 (keep or remove the "demo version" notice on the About us and Terms pages), and answer decisions 1 and 2 so the demo data can be replaced.
