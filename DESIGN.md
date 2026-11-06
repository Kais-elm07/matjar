---
version: alpha
name: متجري
description: >-
  The visual identity of a demo Arabic online store in a "Warm Night" style: a
  dark background with a single orange for actions and prices, real product
  photos on dark cards with rounded corners and a round cart button in the
  corner, a dark header with a wide search field and a row of links, and a
  footer that ends in an orange bar. The store name is a placeholder until the
  final name is approved.
colors:
  primary: "#ffa629"
  on-primary: "#111111"
  primary-soft: "color-mix(in srgb, #ffa629 10%, #121214)"
  ring: "#ffa629"
  background: "#121214"
  foreground: "#ffffff"
  surface: "#1c1c1f"
  surface-muted: "#2a2a2e"
  muted-foreground: "#a1a1a6"
  border: "#333338"
  error: "#f87171"
  warning: "#fbbf24"
  success: "#4ade80"
  whatsapp: "#15803d"
typography:
  headline-display:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 60px
    fontWeight: 700
    lineHeight: 1.2
  headline-display-mobile:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.3
  headline-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.3
  headline-lg-mobile:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.375
  headline-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.35
  headline-md-mobile:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.4
  body-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.75
  body-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.75
  body-sm:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
  label-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.5
  label-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.5
  label-sm:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.4
  price-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.2
  price-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.5
rounded:
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  2xl: 16px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  gutter-mobile: 16px
  gutter-desktop: 24px
  container-max: 1280px
  touch-target: 44px
  header-height: 64px
  header-nav-height: 44px
  tab-bar-height: 64px
components:
  button-cta:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.lg}"
    height: 44px
    padding: 24px
  button-cta-hover:
    backgroundColor: "color-mix(in srgb, #ffa629 88%, #ffffff)"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.lg}"
    height: 44px
    padding: 24px
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.lg}"
    height: 44px
    padding: 24px
  site-header:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    height: 64px
  header-nav:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    height: 44px
  header-link-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
  search-input:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    height: 44px
  counter-badge:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    size: 18px
  announcement-bar:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    height: 32px
  whatsapp-button:
    backgroundColor: "{colors.whatsapp}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    size: 56px
  hero-banner:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.headline-display}"
    padding: 24px
  trust-strip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    padding: 20px
  promo-tag:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 6px
  category-tile:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.xl}"
  section-tab:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 36px
    padding: 16px
  section-tab-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 36px
    padding: 16px
  carousel-arrow:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    size: 44px
  filter-chip:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 36px
    padding: 14px
  filter-chip-selected:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
  product-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.xl}"
    padding: 12px
  product-card-image:
    backgroundColor: "{colors.surface-muted}"
    rounded: "{rounded.lg}"
  product-card-meta:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-sm}"
  card-cart-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    size: 48px
  wishlist-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    size: 36px
  price-current:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.price-md}"
  price-old:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-sm}"
  badge-discount:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    padding: 6px
  stock-in:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.success}"
    typography: "{typography.label-md}"
  stock-low:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.warning}"
    typography: "{typography.label-md}"
  stock-out:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.error}"
    typography: "{typography.label-md}"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    height: 44px
  dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
  site-footer:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-sm}"
  footer-statement:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-lg}"
  footer-link:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-sm}"
  footer-bar:
    backgroundColor: "{colors.primary}"
    height: 12px
  tab-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.label-sm}"
    height: 64px
  tab-bar-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
  focus-ring:
    backgroundColor: "{colors.ring}"
    size: 3px
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  share-image:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.headline-display}"
    padding: 48px
  share-image-meta:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-lg}"
  share-image-price:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    typography: "{typography.headline-display}"
---

# Matjari (متجري) visual identity

This file is the single reference for how the store looks. Every new page or component follows the values and rules here.
The colors are applied in the code in `src/app/globals.css` with the same hex values written here, and the corner radius through the `--radius` variable.
To change the identity: edit this file first, check it with `pnpm design:lint`, then copy the values into `globals.css`.
The storefront is in Arabic; the interface labels quoted here are English translations of its Arabic text.

## Overview

An Arabic store in a **Warm Night** style: dark pages that make the real product photos stand out, and a single orange that leads the eye to the price and the buy button, so visitors find a product, understand its price and add it to the cart without distraction.

- **Inspiration:** a concept design for a furniture store ("Luxe Living") that the owner found, and whose colors the owner liked: black and dark gray surfaces, orange for buttons and prices, product cards with a round cart button in the corner, photo category tiles, and a footer that ends in an orange bar. The ideas were rebuilt in Arabic, right to left, with free photos from Pexels; no code and no image was copied from the original design.
- **Personality:** warm, confident and modern, like today's electronics and furniture stores rather than crowded marketplaces.
- **Audience:** Arab shoppers who mostly browse on their phones, some of them with little online shopping experience.
- **Intended feel:** a large photo with darkened edges greets the visitor with a headline in its middle, a sticky dark header holds a wide search field, dark cards lift the photos off the background, and orange alone means "press here" or "this is the price".
- **Direction:** the whole interface is right to left. Alignment, arrows and sliding menus start from the right.
- **Mobile first:** every design starts at a width of 375 px, with a navigation bar fixed to the bottom of the screen.

## Colors

A dark background in three shades, white text, and a single brand color: orange. No navy, no blue and no other decorative color.

- **Orange (primary, #ffa629):** primary buttons, prices, links on hover, the active tab, counters, discount badges, the announcement bar and the footer's bottom bar. Text on it is always dark (on-primary, #111111), at a contrast of 9.6:1, and white text never goes on it.
- **Soft orange (primary-soft):** the background of the selected option in the filters, with orange text.
- **Background (background, #121214):** the base of every page, and the darkest shade. White text on it has a contrast of 18:1.
- **Surface (surface, #1c1c1f):** the header, the footer, product cards, sliding panels and notifications. One shade lighter than the background, so the cards rise above it without a shadow.
- **Light surface (surface-muted, #2a2a2e):** the search field, the image box inside a card before the image loads, icon circles, scroll buttons and loading skeletons.
- **Primary text (foreground, #ffffff):** headings, product names and header links.
- **Secondary text (muted-foreground, #a1a1a6):** descriptions, category names on cards, the pre-discount price and footer links, at a contrast of 6.4:1 on the surface and 7.3:1 on the background.
- **Borders (border, #333338):** the borders of fields and photo cards, and dividers. Thin and faint, because the difference between the background shades usually separates the parts.
- **Focus ring (ring, #ffa629):** orange on dark surfaces. On an orange button it turns white, so it stays visible.
- **Red (error, #f87171):** only error messages and "Out of stock". It is a light red that reads on dark at a contrast of 6:1.
- **Yellow (warning, #fbbf24):** the "Only a few left" notice.
- **Green (success, #4ade80):** the "In stock" status. The floating WhatsApp button uses WhatsApp's darker green (whatsapp, #15803d), because the white icon on it needs a contrast of 5:1.
- **Text on photos:** always white, over a darkening layer in the background color (45%) and a darker gradient from the bottom, so it stays readable whatever the photo.

## Typography

There is only one font across the whole site: **IBM Plex Sans Arabic**, self-hosted in `src/fonts`, with files for the Arabic letters and files for digits and Latin letters.
The files are subsets that contain only the characters the store uses, generated by `pnpm fonts` from the sources in `assets/fonts`, so the whole font weighs 66 KB.
The reference design uses Segoe UI, a Windows system font that cannot be embedded in a website, so IBM Plex Sans Arabic stayed; it is close to Segoe UI in clarity.
The font has static weights, and only three are available: 400 for text, 500 for names and buttons, and 700 for headings and prices.

- **Hero headline (headline-display):** 60 px on desktop and 36 on mobile, white, in the middle of the photo, in two lines at most.
- **Headings (headline):** bold (700), with comfortable line spacing for Arabic letters. Every heading has a mobile value and a desktop value, and the heading of the centered "Contact us" section is centered.
- **Body text (body):** at least 16 px for the main text, with a line height of 1.75, because Arabic letters need more vertical space than Latin ones.
- **Names and buttons (label):** medium weight (500), and small badges at 12 px in weight 700.
- **Prices (price):** always bold and orange, with Western digits (0-9) to avoid confusion, and the currency after the number: "129 ر.س" (129 SAR).
- **Fields:** 16 px on mobile, so the browser does not zoom the page in automatically while typing.
- **No letter spacing:** Arabic letters are joined, and any spacing breaks them apart. Large headings grow in size, not in spacing.

## Layout

- **Grid:** a container with a maximum width of 1280 px in the middle, and a side margin of 16 px on mobile and 24 on desktop (`page-container`). Only the hero, the trust strip under it and the footer span the full screen width.
- **Header on desktop:** two rows fixed to the top of the screen. The first, 64 px tall, has the logo at the start, a wide search field in the middle, and the wishlist, the cart and the orange "Shop now" button at the end. The second, 44 px tall, has the shopping and help links in the middle, and "Categories" opens a large panel with columns.
- **Header on mobile:** one row, 64 px tall: the menu button at the start, the logo, and the search button and the cart at the end. The search button opens the search field in a row under the header.
- **Bottom navigation bar on mobile:** fixed and 64 px tall: Home, Categories, Search, Wishlist, Cart. Every page leaves room for it at the bottom.
- **Home page order:** the full-width hero, then the dark trust strip directly under it, then the promo grid (two image tiles, a tall tile and the discount card), then best sellers, then the two category spotlight cards, then new arrivals with a large banner, a row of products and a centered button, then trending with category tabs, then deals with a countdown, then the wide banner, then the category tiles, then customer reviews if there are any, then Contact us, then the footer.
- **Product rows:** swiped horizontally on every screen, with a gap of 12 to 16 px, and two round scroll buttons in the section heading on desktop.
- **Product grid in listings:** two columns on mobile, 3 on tablets and 4 on desktop (3 when the filter sidebar is shown), with separate cards and gaps between them.
- **Spacing scale:** multiples of 4 px. The space between page sections is 56 to 80 px, and inside cards 10 to 16 px.
- **Touch:** every clickable element is at least 44 px tall, and small chips are 36 px with space between them. A control that must look smaller (the search button, the steppers in the cart panel) gets an invisible area around it (`after:-inset-1`), and a text link inside a row (breadcrumbs, "View all") gets vertical padding with a matching negative margin, so the target reaches 44 px without changing the layout. The one exception is the link in the 32 px announcement bar, which fills the whole bar.
- **Direction:** always use logical properties (`ms`, `me`, `ps`, `pe`, `start` and `end`) instead of left and right.

## Elevation & Depth

Depth comes from **background shades**, not from shadows: the background is the darkest, the cards, the header and the footer are one shade lighter, and image boxes and fields are one shade lighter still.

- No shadows on cards or buttons. A shadow is allowed only on floating elements: the categories panel, the search suggestions, the cart panel and notifications, which use the surface color, with a black overlay (60%) behind dialogs.
- The round cart button in the corner of the card is surrounded by a ring in the background color (6 px), so the card looks cut out around it.
- Photos grow slightly (3%) when the mouse passes over a card or a photo tile, and that is the only motion on them.
- Fields and photo cards have a thin border in the border color, so their edges show against the dark background.

## Shapes

- **Buttons:** 8 px corners (`lg`), and the same for fields and for the image boxes inside cards.
- **Cards, photo tiles and dialogs:** 12 px (`xl`).
- **Pills (full):** the search field, tabs, filter chips, section badges and the deals countdown.
- **Circles stay circles:** the cart button on the card, the wishlist button on the photo, scroll buttons, counters, the contact circles, and the color swatches in filters and variants.
- **Small badges, such as the discount:** 4 px (`sm`).
- **The hero, the trust strip and the footer:** no corners, because they span the full screen width.

## Components

- **Primary button (button-cta):** orange with dark text, 8 px corners and 44 px tall, for the most important action in an area: "Add to cart", "Checkout", "Shop now", "Show results". It is also used on photos, because it reads on any image.
- **Secondary button (button-secondary):** transparent, with a white border and white text, for the second action: "Buy now", "View cart".
- **Light button (button-outline):** transparent with a gray border, for alternative actions such as "Clear filters", "Continue shopping" and "Share".
- **Header:** dark (surface), fixed to the top of the screen, with a thin bottom border. The logo is an orange square with a dark bag icon, followed by the store name in white. The search field is a pill in the light surface color, 36 rem wide. The wishlist and cart counters are small orange circles that are hidden at zero. The links in the second row are white and turn orange on hover.
- **Announcement bar:** a thin orange line at the top of every page, above the header, that disappears on scroll, with short dark text and an optional link.
- **Hero:** a full-width photo, 72% of the screen height on desktop and 32 rem on mobile, under a darkening layer in the background color and a darker gradient from the bottom. In its middle: a small orange badge, a large headline, a line of description, the price and one orange button. Several slides are swiped by touch, with dots (the active one orange) and arrows, and no autoplay.
- **Trust strip (trust-strip):** a full-width strip in the surface color directly under the hero: six reasons to shop here, each with an orange icon, a short title and a gray description, in two columns on mobile, three on tablets and six on wide screens. Each description is balanced across its lines, so no word is left alone on the second line. It is the only list of these reasons on the site, so no other section, such as a "Why choose us?", repeats them.
- **Promo grid:** two image tiles stacked on top of each other and a tall tile next to them. Each tile is a product photo with 12 px corners and a thin border, with an orange badge, a title and a price at its bottom over a dark gradient. Next to them, a card in the surface color with "Discounts up to N%" in orange and a "Shop the deals" button. The discount percentage is computed from the products that have real deals.
- **Category tiles (category-tile):** the category photo at a 4:5 ratio, with 12 px corners and a thin border, and the category name and product count in white at its bottom over a dark gradient.
- **Product card (product-card):** the surface color, 12 px corners and no shadow. Inside it, the image box has 8 px corners, with the orange discount badge in its start corner and the round orange heart button in its end corner. Under the image: the category name in gray, then the product name in bold, then the price in orange. In the card's bottom corner on the end side sits a round orange cart button (48 px) surrounded by a ring in the background color: it adds a single-option product directly, and opens the product page to choose a size or color for a product with several options. A sold-out product has no button and carries an "Out of stock" badge.
- **Tabs and chips:** pills with a gray border and white text; the active one is orange with dark text.
- **Countdown:** an orange pill above the card, shown only for a product with a real deal end date in the data. It shows whole days while a day or more is left, so it fits on one line on a phone, and a ticking clock in the last day; the product leaves the section when its deal ends.
- **Product page:** the gallery sits in a light-surface box with 12 px corners and a thin border, and the active thumbnail has an orange border. The name is white and the large price orange. The size and color options are pills with a gray border, and the selected one is orange. The orange "Add to cart" button sits next to the quantity selector, with "Buy now" under it with a white border. The purchase benefits are in a surface-colored card, followed by the tabs, then similar products.
- **Cart panel:** slides in from the end side in the surface color, with the products and their images and options, the quantity selector, removal, the subtotal, and two buttons: the orange "Checkout" and "View cart".
- **Checkout:** one page with steps numbered in orange circles, each step in a card with a thin border. Fields are 44 px tall, with a gray border and the page background; the label sits above the field and the error message under it in light red. The summary is in a surface-colored card, sticky on desktop and collapsible on mobile, and the orange confirm button carries the total. A "demo store" notice shows before and after confirming.
- **Contact us:** a centered heading, then a surface-colored card for each channel: a light-surface circle with an orange icon, the channel's name in gray and its value in white. It appears on the home page and on the "Contact us" page.
- **WhatsApp button:** a green circle with a white icon in the corner of the screen on the end side, above the mobile bottom bar. It shows only when a WhatsApp number is set.
- **Static pages:** a text column at most 768 px wide with bold headings, and a side list of the pages in a surface-colored card on desktop. FAQ answers open and close, and the shipping table is built from the shipping file.
- **Footer:** full width in the surface color: the logo, the store's tagline in gray and the orange "Contact us" button on the start side, and the link columns in gray (orange on hover) on the end side, then the copyright line with a thin top border, and at the very end a 12 px orange bar (footer-bar).
- **Share images (share-image):** they appear when a link is shared on WhatsApp and social networks, and are generated at build time at 1200×630: one image per product, one per category, and a general image for the store. A dark background, the square photo on the left with rounded corners, and the text column on the right: the logo and the store name, then the category name in gray, then the product name in bold white, with the price in orange at the bottom and the pre-discount price struck through next to it. The discount badge is orange, over the photo. The category images and the general image show only two facts from the store data: cash on delivery and the free-shipping threshold.
- **Empty states:** a dashed frame, an icon in a light-surface circle, a sentence that explains what happened, and a button for what can be done next.
- **Loading:** pulsing skeletons in the light surface color, shaped like the content, instead of spinners.
- **Icons:** the Lucide library with thin strokes; arrows mirror automatically in the Arabic direction.

## Do's and Don'ts

- Do: start every design from the phone screen, then expand it.
- Do: use orange for one prominent action in each area, and the white-bordered button for the second action.
- Do: keep a contrast of at least 4.5:1 for all text, and check it with `pnpm design:lint`.
- Do: write counts with the correct Arabic plural forms: "منتج واحد" (one product), "منتجان" (two products), "5 منتجات" (5 products), "20 منتجاً" (20 products).
- Do: show shipping and the total before any confirmation, and never surprise the visitor with an amount.
- Do: keep motion short (300 ms or less) and purposeful, such as panels sliding in, the heartbeat when saving to the wishlist, and FAQ answers opening. Anyone who asked for reduced motion in their device settings sees no motion at all.
- Do: use real product photos with calm backgrounds, which the dark design makes stand out. The current demo photos come from Pexels, are licensed for free use, and will be replaced by the store's actual photos.
- Don't: put white text on orange, or orange text on orange. Text on orange is always dark.
- Don't: use orange for large backgrounds other than the announcement bar and the footer bar, and don't put two orange cards next to each other.
- Don't: put a shadow around the product card; its shade already separates it from the background.
- Don't: show fake numbers such as "25 people are viewing this now" or "someone just bought this", a countdown without a real date, or ratings and stars without real reviews.
- Don't: hide the add-to-cart button or any important information behind a mouse hover, because phones have no hover.
- Don't: autoplay sliders; the visitor decides when to move on.
- Don't: reveal content with motion as it scrolls into view; it delays reading and makes the page heavier on mobile.
- Don't: use more than one font, weights other than 400, 500 and 700, or letter spacing on Arabic text.
- Don't: use red except for errors and sold-out items.
- Don't: use left and right in styles; use start and end.
- Don't: put important text over a photo without a darkening layer and a dark gradient that keep it readable.
