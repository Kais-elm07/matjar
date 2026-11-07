---
version: alpha
name: متجري
description: >-
  The visual identity of a demo Arabic online store in a "Spotlight" style: a
  dark stage with a blue tint and a single electric blue for actions and
  prices. Every product is a cut-out photo standing in a spotlight whose light
  takes the product's own color, and photos turn in 3D as they move. Cards are
  dark with 16 px corners and a thin border, buttons are pills, and the footer
  ends in a thin blue line. The store name is a placeholder until the final
  name is approved.
colors:
  primary: "#4f8cff"
  on-primary: "#0b0e14"
  primary-soft: "color-mix(in srgb, #4f8cff 12%, #0b0e14)"
  ring: "#4f8cff"
  background: "#0b0e14"
  foreground: "#ffffff"
  surface: "#141821"
  surface-muted: "#1e2430"
  muted-foreground: "#a3adbf"
  border: "#2a3344"
  error: "#f87171"
  warning: "#fbbf24"
  success: "#4ade80"
  whatsapp: "#15803d"
  stage-tone: "oklch(0.4 0.1 262)"
  stage-glow: "oklch(0.78 0.1 262)"
  mascot-fur: "#3572f5"
  mascot-tag: "#f6c343"
  mascot-ear: "#ff7fa8"
typography:
  headline-display:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 60px
    fontWeight: 700
    lineHeight: 1.15
  headline-display-mobile:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.25
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
  eyebrow:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.5
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
  stage-max: 480px
components:
  button-cta:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 44px
    padding: 24px
  button-cta-hover:
    backgroundColor: "color-mix(in srgb, #4f8cff 88%, #ffffff)"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 44px
    padding: 24px
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
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
  mascot:
    backgroundColor: "{colors.mascot-fur}"
    width: 200px
    height: 208px
  mascot-mobile:
    backgroundColor: "{colors.mascot-fur}"
    width: 136px
    height: 144px
  mascot-tag:
    backgroundColor: "{colors.mascot-tag}"
  mascot-ear:
    backgroundColor: "{colors.mascot-ear}"
  mascot-bubble:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.2xl}"
    padding: 12px
  stage:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.headline-display}"
    padding: 24px
  stage-backdrop:
    backgroundColor: "{colors.stage-tone}"
    textColor: "{colors.foreground}"
  stage-platform:
    backgroundColor: "{colors.stage-glow}"
    rounded: "{rounded.full}"
  stage-eyebrow:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.eyebrow}"
  trust-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.2xl}"
    padding: 14px
  trust-icon:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    size: 40px
  promo-tag:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 6px
  photo-box:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
  category-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.2xl}"
    padding: 8px
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
    rounded: "{rounded.2xl}"
    padding: 10px
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
    rounded: "{rounded.2xl}"
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
  footer-line:
    backgroundColor: "{colors.primary}"
    height: 3px
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
The colors are applied in the code in `src/app/globals.css` with the same values written here, and the corner radius through the `--radius` variable.
To change the identity: edit this file first, check it with `pnpm design:lint`, then copy the values into `globals.css`.
The storefront is in Arabic; the interface labels quoted here are English translations of its Arabic text.

## Overview

An Arabic store in a **Spotlight** style: the store is a dark stage, every product stands in a spotlight, and the light takes the product's own color. Real product photos with their backgrounds removed float in that light, and a single electric blue leads the eye to the price and the buy button, so visitors find a product, understand its price and add it to the cart without distraction.

- **Inspiration:** two concept designs the owner chose: a one-product store page whose whole background takes the color of the product on screen, and a dark tech storefront with one electric blue, a product standing on a glowing round platform, a row of trust cards and dark product cards. The ideas were rebuilt in Arabic, right to left; no code and no image was copied from them. The identity before this one, "Warm Night" (dark with orange), is in the Git history.
- **Personality:** confident, modern and a little theatrical, like today's electronics stores, while staying calm enough for clothes, perfume and home goods.
- **Audience:** Arab shoppers who mostly browse on their phones, some of them with little online shopping experience.
- **Intended feel:** the hero shows one product at a time on a stage whose light takes its color. Swiping turns the photo away in 3D and brings the next one in, and the light changes color with it at the same moment. Dark cards with a thin border hold the products, and blue alone means "press here" or "this is the price".
- **Mascot:** Najm (نجم, "star", for the spotlight), a small glossy blue dog in 3D who stands in the corner of every page, follows the visitor with his eyes and carries what they buy (see Mascot under Components).
- **Direction:** the whole interface is right to left. Alignment, arrows, sliding menus and the 3D turn start from the right.
- **Mobile first:** every design starts at a width of 375 px, with a navigation bar fixed to the bottom of the screen.

## Colors

A dark background with a blue tint in three shades, white text, a single brand color (electric blue), and one color that is never fixed: the tone of the product on screen.

- **Blue (primary, #4f8cff):** primary buttons, prices, links on hover, the active tab, counters, discount badges, the announcement bar and the line at the bottom of the footer. Text on it is always dark (on-primary, #0b0e14), at a contrast of 6:1, and white text never goes on it.
- **Soft blue (primary-soft):** the background of the selected option in the filters, with blue text, and the circles behind the icons of the trust cards.
- **Background (background, #0b0e14):** the base of every page and the darkest shade: almost black, with a hint of blue. White text on it has a contrast of 19:1.
- **Surface (surface, #141821):** the header, the footer, cards, sliding panels and notifications. One shade lighter than the background.
- **Light surface (surface-muted, #1e2430):** the search field, photo boxes before their photo loads, icon circles, scroll buttons and loading skeletons.
- **Primary text (foreground, #ffffff):** headings, product names and header links.
- **Secondary text (muted-foreground, #a3adbf):** descriptions, category names on cards, the pre-discount price and footer links, at a contrast of 7.8:1 on the surface and 8.5:1 on the background.
- **Borders (border, #2a3344):** the thin borders of cards, fields and photo boxes, and dividers.
- **Focus ring (ring, #4f8cff):** blue on dark surfaces. On a blue button it turns white, so it stays visible.
- **Red (error, #f87171):** only error messages and "Out of stock", at a contrast of 6:1 on the surface.
- **Yellow (warning, #fbbf24):** the "Only a few left" notice.
- **Green (success, #4ade80):** the "In stock" status. The floating WhatsApp button uses WhatsApp's darker green (whatsapp, #15803d), because the white icon on it needs a contrast of 5:1.
- **The product's tone (stage-tone and stage-glow):** the light behind a product photo. `pnpm images` measures the main color of every photo, and the site turns it into a hue and a strength (chroma) in the OKLCH color space. The light behind the product is always drawn at the same lightness (0.40), so white text on it keeps a contrast of at least 7:1 whatever the hue, and the glowing platform under the product at a lightness of 0.78. A photo without a clear color, such as a black speaker, takes the store's blue (hue 262, the values in the tokens), and the owner can set the tone of any photo in the products file. Text never sits on the bright middle of the light: it sits on the dark side of a stage, or under a dark gradient.
- **Najm's colors (mascot-fur, mascot-tag, mascot-ear):** only on the mascot, drawn in 3D: his fur is a deeper shade of the store's blue (#3572f5), so it keeps its color under the lights, with a gold heart tag (#f6c343) and pink inside his ears (#ff7fa8). The rim of his basket is the store's blue, and its wheels and handle the gray of secondary text. No interface element uses these three colors.

## Typography

There is only one font across the whole site: **IBM Plex Sans Arabic**, self-hosted in `src/fonts`, with files for the Arabic letters and files for digits and Latin letters.
The files are subsets that contain only the characters the store uses, generated by `pnpm fonts` from the sources in `assets/fonts`, so the whole font weighs 66 KB.
The font has static weights, and only three are available: 400 for text, 500 for names and buttons, and 700 for headings and prices.

- **Hero headline (headline-display):** 60 px on desktop and 36 on mobile, white, in two lines at most.
- **Eyebrow (eyebrow):** a short line above a stage's headline, such as the discount or "New", white and bold at 14 px after a small glowing blue dot.
- **Headings (headline):** bold (700), with comfortable line spacing for Arabic letters. Every heading has a mobile value and a desktop value.
- **Body text (body):** at least 16 px for the main text, with a line height of 1.75, because Arabic letters need more vertical space than Latin ones.
- **Names and buttons (label):** medium weight (500), and small badges at 12 px in weight 700.
- **Prices (price):** always bold and blue, with Western digits (0-9) to avoid confusion, and the currency after the number: "129 ر.س" (129 SAR).
- **Fields:** 16 px on mobile, so the browser does not zoom the page in automatically while typing.
- **No letter spacing:** Arabic letters are joined, and any spacing breaks them apart. Large headings grow in size, not in spacing.

## Layout

- **Grid:** a container with a maximum width of 1280 px in the middle, and a side margin of 16 px on mobile and 24 on desktop (`page-container`). Only the hero and the footer span the full screen width.
- **Header on desktop:** two rows fixed to the top of the screen. The first, 64 px tall, has the logo at the start, a wide search field in the middle, and the wishlist, the cart and the blue "Shop now" pill at the end. The second, 44 px tall, has the shopping and help links in the middle, and "Categories" opens a large panel with columns.
- **Header on mobile:** one row, 64 px tall: the menu button at the start, the logo, and the search button and the cart at the end. The search button opens the search field in a row under the header.
- **Bottom navigation bar on mobile:** fixed and 64 px tall: Home, Categories, Search, Wishlist, Cart. Every page leaves room for it at the bottom.
- **The stage:** the hero is a full-width stage: on a phone the product (a square up to 480 px, and never taller than 46% of the screen) stands above its text, and on a tablet or desktop the text sits on the start side and the product on the end side, in a stage at least 72% of the screen tall, up to 42 rem. On the product page, the gallery is a square stage beside the purchase panel.
- **Home page order:** the full-width hero, then the six trust cards (pulled up into the hero's bottom edge from tablets up), then the promo grid (two product tiles, a tall tile and the discount card), then best sellers, then the two category spotlight cards, then new arrivals with its banner, a row of products and a centered button, then trending with category tabs, then deals with a countdown, then the wide banner, then the category tiles, then customer reviews if there are any, then Contact us, then the footer.
- **Product rows:** swiped horizontally on every screen, with a gap of 12 to 16 px, and two round scroll buttons in the section heading on desktop.
- **Product grid in listings:** two columns on mobile, 3 on tablets and 4 on desktop (3 when the filter sidebar is shown), with separate cards and gaps between them.
- **Spacing scale:** multiples of 4 px. The space between page sections is 56 to 80 px, and inside cards 10 to 16 px.
- **Touch:** every clickable element is at least 44 px tall, and small chips are 36 px with space between them. A control that must look smaller (the search button, the steppers in the cart panel) gets an invisible area around it (`after:-inset-1`), and a text link inside a row (breadcrumbs, "View all") gets vertical padding with a matching negative margin, so the target reaches 44 px without changing the layout. The one exception is the link in the 32 px announcement bar, which fills the whole bar.
- **Direction:** always use logical properties (`ms`, `me`, `ps`, `pe`, `start` and `end`) instead of left and right. Gradients, which have no logical form, are written for the right-to-left page and say so in a comment.

## Elevation & Depth

Depth comes from **background shades, thin borders and one light per screen**, not from shadows.

- The background is the darkest, the header, the footer and the cards are one shade lighter, and fields and photo boxes are one shade lighter still.
- Cards, tiles and photo boxes have a thin border in the border color. On hover a card rises by 2 px, its border takes a hint of blue, and its photo grows by 5%.
- **One light per screen:** the stage. Behind the product, a radial light in its tone; under it, a glowing ellipse (the platform) with a soft dark center where the product stands. Product cards and category tiles carry a small version of the same light: a wash of the product's tone in the photo box and a short glow under the product. No other glows.
- No shadows on cards or buttons, and no blur effects, because they are slow on phones. A shadow is allowed only on floating elements: the categories panel, the search suggestions, the cart panel, notifications, the WhatsApp button and Najm's speech bubble, with a black overlay (60%) behind dialogs.
- Najm adds no light and no background: his canvas is transparent, and only a soft round shadow under his feet and his cart, which fades before its edge, ties him to the ground.
- The round cart button in the corner of the card is surrounded by a ring in the background color (6 px), so the card looks cut out around it.
- **3D:** the photos on a stage turn as they move. The photo that leaves turns away by up to 34 degrees around its vertical axis, moves back, shrinks and fades, and the next one turns into place, with the platform narrowing and widening with them. The turn follows the swipe itself, so it works with a finger, the arrows, the thumbnails and the keyboard. On a computer with a mouse, the photo under the pointer also tilts a few degrees toward it. Anyone who asked for reduced motion in their device settings sees no turn and no tilt.

## Shapes

- **Buttons:** pills (`full`), every one of them; icon buttons are circles.
- **Fields:** 8 px corners (`lg`): text fields, select menus and text areas.
- **Photo boxes:** 12 px (`xl`): the photo box in cards, tiles and thumbnails, and a photo framed on a stage.
- **Cards, tiles, panels inside pages and dialogs:** 16 px (`2xl`).
- **Pills (full):** the search field, tabs, filter chips, tags and the deals countdown.
- **Circles stay circles:** the cart button on the card, the heart button, scroll buttons, counters, trust and contact icons, and the color swatches in filters and options.
- **Small badges, such as the discount:** 4 px (`sm`).
- **The hero and the footer:** no corners, because they span the full screen width.

## Components

- **Primary button (button-cta):** a blue pill with dark text, 44 px tall, for the most important action in an area: "Add to cart", "Checkout", "Shop now", "Show results". It is also used on stages and photo tiles, because it reads on any light.
- **Secondary button (button-secondary):** a transparent pill with a white border and white text, for the second action: "Buy now", "View cart".
- **Light button (button-outline):** a transparent pill with a gray border, for alternative actions such as "Clear filters", "Continue shopping" and "Share".
- **Header:** dark (surface), fixed to the top of the screen, with a thin bottom border. The logo is a blue square with 8 px corners and a dark bag icon, followed by the store name in white. The search field is a pill in the light surface color, 36 rem wide, with a blue ring when focused. The wishlist and cart counters are small blue circles that are hidden at zero. The links in the second row are white and turn blue on hover, and "Shop now" is a blue pill with an arrow pointing forward.
- **Announcement bar:** a thin blue line at the top of every page, above the header, that disappears on scroll, with short dark text and an optional link.
- **Product photos:** every product photo is a cut-out: the product alone on a transparent background, saved as PNG or WebP, at least 1200 px on its long side, with no text on it. The demo photos are Pexels photos whose backgrounds were removed with the open-source `@imgly/background-removal-node` model. A photo that is not a cut-out still works: on a stage it stands in a frame with 12 px corners and a thin border, and in a card it fills its box.
- **Hero (stage):** a full-width stage with one slide per product. Each slide shows the product's cut-out on its platform, and the eyebrow (the slide's tag, or the discount), the headline, a line of description, the price in blue with the pre-discount price struck through, and the blue "Shop now" button. The light behind the slides takes the tone of the slide on screen and blends into the next one during the swipe. The dots (the active one blue and wider) sit under the slides between two round arrows, which show from tablets up, and nothing moves on its own.
- **Trust cards (trust-card):** six cards inside the page container right under the hero, pulled up 40 px into its bottom edge from tablets up: each a surface card with 16 px corners and a thin border, the icon in a soft blue circle, a short title and a gray description balanced across its lines. Two columns on mobile, three on tablets and six on wide screens. It is the only list of these reasons on the site, so no other section, such as a "Why choose us?", repeats them.
- **Promo grid:** two product tiles stacked on top of each other and a tall tile next to them. Each tile is a photo box with 16 px corners and a thin border, washed with the product's tone, with the cut-out floating in its upper part, and a blue tag, the title and the price at its bottom over a dark gradient. Next to them, a surface card with "Discounts up to N%" in blue and a "Shop the deals" button. The discount percentage is computed from the products that have real deals.
- **Category spotlight cards:** two wide cards: the cut-out of the category's cover photo on the end side, in its tone, and the title, a line of description and a "Shop now" button on the start side, over a dark gradient that covers the text side.
- **New arrivals and the wide banner:** wide stages with 16 px corners and a thin border, in the tone of their product: the cut-out on its platform on the end side, and the heading, the text and, on the wide banner, the price and the button on the start side.
- **Category tiles (category-tile):** a square surface card with 16 px corners and a thin border. In its photo box (12 px corners) the cut-out of the category's cover photo floats on a wash of its tone, and the name and product count sit under the box. A category's cover is the photo set in the categories file, or else the first photo of its most popular product.
- **Product card (product-card):** the surface color, 16 px corners, a thin border and no shadow. Its photo box (12 px corners) is washed with the product's tone, with the cut-out inside it and a short glow under it, the blue discount badge in its start corner and the round blue heart button in its end corner. Under the photo box: the category name in gray, then the product name in bold, then the price in blue. In the card's bottom corner on the end side sits a round blue cart button (48 px) surrounded by a ring in the background color: it adds a single-option product directly, and opens the product page to choose a size or color for a product with several options. A sold-out product has no button and carries an "Out of stock" badge.
- **Tabs and chips:** pills with a gray border and white text; the active one is blue with dark text.
- **Countdown:** a blue pill above the card, shown only for a product with a real deal end date in the data. It shows whole days while a day or more is left, so it fits on one line on a phone, and a ticking clock in the last day; the product leaves the section when its deal ends.
- **Product page:** the gallery is a stage: a square box with 16 px corners and a thin border, whose light takes the tone of the photo on screen the moment the photo changes. Choosing a color moves the gallery to that color's photo and its tone. The photos turn in 3D as they move, round arrows show from tablets up, a counter shows on phones, and tapping the photo opens the zoom dialog. Under the stage, a row of thumbnails in photo boxes, the active one with a blue border. The name is white and the large price blue. The size and color options are pills with a gray border, and the selected one is blue. The blue "Add to cart" button sits next to the quantity selector, with "Buy now" under it with a white border. The purchase benefits are in a surface card, followed by the tabs, then similar products.
- **Cart panel:** slides in from the end side in the surface color, with the products and their photos and options, the quantity selector, removal, the subtotal, and two buttons: the blue "Checkout" and "View cart".
- **Checkout:** one page with steps numbered in blue circles, each step in a card with 16 px corners and a thin border. Fields are 44 px tall, with a gray border and the page background; the label sits above the field and the error message under it in light red. The summary is in a surface card, sticky on desktop and collapsible on mobile, and the blue confirm button carries the total. A "demo store" notice shows before and after confirming.
- **Contact us:** a centered heading, then a surface card for each channel: a light-surface circle with a blue icon, the channel's name in gray and its value in white. It appears on the home page and on the "Contact us" page.
- **WhatsApp button:** a green circle with a white icon in the corner of the screen on the end side, above the mobile bottom bar. It shows only when a WhatsApp number is set.
- **Mascot (mascot, mascot-bubble):** Najm stands in the corner of the screen on the start side, the opposite corner from the WhatsApp button: 200×208 px on a tablet or desktop and 136×144 px on a phone, just above the mobile bottom bar. His canvas has no background and lets every tap and click through, so he never blocks the page; only his speech bubble takes clicks. The bubble is a surface card with 16 px corners, a thin border and a shadow, with a tail that points at him, white text at 14 px and a close button; it closes by itself after a few seconds and when the visitor moves to another page, but stays open while the pointer or the keyboard focus is on it. He changes with the page:
  - **Home page:** without his cart, he waves and says hello once per visit, with a "Hide Najm" button in the greeting.
  - **Product lists, search, product pages and the wishlist:** his cart stands beside him, and he says once per visit that he will carry what the visitor picks. When a product is added, its photo flies in an arc from the pressed button into his paws, he turns and throws it into his basket, the cart bounces and he hops; then his bubble names the product, suggests two similar products that are not in the cart yet (with "Add" for a single-option product, which he catches too, and "Choose" for a product with options), and offers "View cart". While he is on screen he replaces the cart panel as the add confirmation; when he is hidden, not loaded yet, or the browser can't draw him, the cart panel opens as before.
  - **Cart page:** he says how many pieces the cart holds. When a product is deleted, he takes it out of his basket and throws it away.
  - **Checkout:** he stays quiet, so his bubble never covers the form.
  - **Order confirmation:** he cheers, his cart rolls off with the order and comes back empty, he waves, and he congratulates the visitor, once per order.
  - **Help pages and the 404 page:** he just keeps the visitor company, without his cart.
- **Hiding Najm:** "Hide Najm" in his greeting, and a button with a dog icon in the footer's bottom row ("Hide Najm" or "Show Najm"), save the visitor's choice in the browser.
- **Static pages:** a text column at most 768 px wide with bold headings, and a side list of the pages in a surface card on desktop. FAQ answers open and close, and the shipping table is built from the shipping file.
- **Footer:** full width in the surface color: the logo, the store's tagline in gray and the blue "Contact us" button on the start side, and the link columns in gray (blue on hover) on the end side, then the copyright line with a thin top border, and at the very end a 3 px blue line that fades toward both edges (footer-line).
- **Share images (share-image):** they appear when a link is shared on WhatsApp and social networks, and are generated at build time at 1200×630: one image per product, one per category, and a general image for the store. A dark background, the product on the left in a square with rounded corners, and the text column on the right: the logo and the store name, then the category name in gray, then the product name in bold white, with the price in blue at the bottom and the pre-discount price struck through next to it. A cut-out stands in the square on its tone and its platform glow, like on the stage. The discount badge is blue, over the photo. The category images and the general image show only two facts from the store data: cash on delivery and the free-shipping threshold.
- **Empty states:** a dashed frame with 16 px corners, an icon in a light-surface circle, a sentence that explains what happened, and a button for what can be done next.
- **Loading:** pulsing skeletons in the light surface color, shaped like the content, instead of spinners.
- **Icons:** the Lucide library with thin strokes; arrows mirror automatically in the Arabic direction.

## Do's and Don'ts

- Do: start every design from the phone screen, then expand it.
- Do: use blue for one prominent action in each area, and the white-bordered pill for the second action.
- Do: keep a contrast of at least 4.5:1 for all text, and check it with `pnpm design:lint`.
- Do: use cut-out product photos, and let the stage, the cards and the tiles take their tone from them.
- Do: write counts with the correct Arabic plural forms: "منتج واحد" (one product), "منتجان" (two products), "5 منتجات" (5 products), "20 منتجاً" (20 products).
- Do: show shipping and the total before any confirmation, and never surprise the visitor with an amount.
- Do: tie motion to what the visitor does (a swipe, the pointer) or keep it short (300 ms or less) and purposeful, such as panels sliding in, the heartbeat when saving to the wishlist, and FAQ answers opening. Anyone who asked for reduced motion in their device settings sees no motion at all.
- Do: let Najm move only in answer to the visitor: his catch, throw and celebration follow an add, a removal or an order, and his breathing, blinking and tail run only for a few seconds after the visitor moves, then he stands still and nothing is drawn. With reduced motion he stands still, doesn't follow the pointer, and products appear in his basket at once; his bubbles still speak.
- Do: load Najm's code (three.js) only after the page has loaded and the visitor first moves, touches or scrolls, so he never slows down the first screen.
- Don't: put white text on blue, or blue text on blue. Text on blue is always dark.
- Don't: use blue for large backgrounds other than the announcement bar, and don't put two blue cards next to each other.
- Don't: put text on the bright middle of a stage's light or of a photo box; text sits on the dark side, or under a dark gradient.
- Don't: add a second light to a screen, a shadow around a card, or a blur effect.
- Don't: show fake numbers such as "25 people are viewing this now" or "someone just bought this", a countdown without a real date, or ratings and stars without real reviews.
- Don't: hide the add-to-cart button or any important information behind a mouse hover, because phones have no hover.
- Don't: autoplay sliders; the visitor decides when to move on.
- Don't: reveal content with motion as it scrolls into view; it delays reading and makes the page heavier on mobile.
- Don't: use more than one font, weights other than 400, 500 and 700, or letter spacing on Arabic text.
- Don't: use red except for errors and sold-out items.
- Don't: use left and right in styles; use start and end.
