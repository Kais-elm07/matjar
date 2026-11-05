---
name: design-system
description: The store's visual identity, defined in DESIGN.md (Google's DESIGN.md format). Use it before any work on the interface, such as a new page or component, changing colors, fonts, spacing or buttons, or changing the store's identity, name or colors.
---

# The store's design system

The single reference for how the store looks is `DESIGN.md` at the project root. It follows [Google's DESIGN.md format](https://github.com/google-labs-code/design.md): exact values in the file's front matter (YAML), and an explanation of each section below it.

## Before any work on the interface

1. Read all of `DESIGN.md`: the values in the front matter, then the Overview, Components and Do's and Don'ts sections.
2. Use the classes in the table below, and don't write new colors or sizes directly in the code.
3. Look in `src/components` for a similar component before creating a new one, and match its look.
4. If you need a value that is not in DESIGN.md, add it to the file first with the reason for it, then use it.

The interface text stays in Arabic, written in correct Modern Standard Arabic; only the documentation is in English.

## Mapping the values to Tailwind classes

The values are applied in `src/app/globals.css` as shadcn variables with the same hex values, and are used through these classes:

| DESIGN.md value                           | Class in the code                                                                             |
| ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| `colors.primary` (orange)                 | `bg-primary` / `text-primary` / `border-primary`                                              |
| `colors.on-primary` (dark text on orange) | `text-primary-foreground`                                                                     |
| `colors.primary-soft`                     | `bg-primary/10` (the background of the selected option, with `text-primary` text)             |
| `colors.ring`                             | `ring-ring/50` (built into the ui components). On an orange button: `ring-foreground`         |
| `colors.background`                       | `bg-background` (the page base, and the ring around the round cart button: `ring-background`) |
| `colors.surface`                          | `bg-card` / `bg-popover` (the header, the footer, cards and panels)                           |
| `colors.surface-muted`                    | `bg-muted` (image boxes, the search field, icon circles and skeletons)                        |
| `colors.foreground`                       | `text-foreground`                                                                             |
| `colors.muted-foreground`                 | `text-muted-foreground`                                                                       |
| `colors.border`                           | `border` / `border-border`                                                                    |
| `colors.error` / `warning` / `success`    | `text-destructive` / `text-warning` / `text-success`                                          |
| `colors.whatsapp`                         | `bg-whatsapp` (the floating WhatsApp button only)                                             |
| `button-cta` (orange)                     | `<Button variant="cta">`                                                                      |
| `button-secondary` (white border)         | `<Button>` (the default)                                                                      |
| `button-outline` (gray border)            | `<Button variant="outline">`                                                                  |
| `rounded.sm` / `lg` / `xl` / `full`       | `rounded-sm` (4px) / `rounded-lg` (8px) / `rounded-xl` (12px) / `rounded-full`                |
| `typography.headline-display`             | `text-4xl md:text-6xl font-bold`                                                              |
| `typography.headline-lg`                  | `text-2xl md:text-3xl font-bold`                                                              |
| `typography.headline-md`                  | `text-xl md:text-2xl font-bold`                                                               |
| `typography.body-md`                      | `text-base leading-7` (long text: `leading-8`)                                                |
| `typography.body-sm`                      | `text-sm`                                                                                     |
| `typography.label-md`                     | `text-sm font-medium`                                                                         |
| `typography.label-sm`                     | `text-xs font-bold`                                                                           |
| `typography.price-lg` / `price-md`        | `text-2xl md:text-3xl font-bold text-primary` / `text-base font-bold text-primary`            |
| `spacing.gutter-*` and `container-max`    | `page-container`                                                                              |
| `spacing.touch-target`                    | A button with `size="xl"` or `size="icon-xl"`, or `h-11`                                      |

## Rules that are never broken

- The interface is right to left: use `ms-`, `me-`, `ps-`, `pe-`, `start-` and `end-`, never `ml-`, `mr-`, `left-` or `right-`. Arrows that mean "next" get `rtl:rotate-180`.
- Mobile first: unprefixed classes are for mobile, then `sm:`, `md:` and `lg:` for larger screens.
- Every clickable element is at least 44 px tall.
- Only one font (IBM Plex Sans Arabic) in three weights: `font-normal`, `font-medium` and `font-bold`. Don't use `font-semibold` or `font-extrabold`, because the font doesn't have them, and no `tracking-*` on Arabic text, because it breaks the joined letters apart.
- Prices use the digits 0-9 through `formatPrice`, always in orange (`Price`).
- Counts use the correct Arabic plural forms through `pluralize` in `src/lib/arabic-plural.ts`.
- The store is always dark: no light mode and no `.dark` class. Don't write `bg-white`, `text-white` or `bg-black`; use `bg-background`, `text-foreground` and `bg-card`.
- Orange (`variant="cta"`) is for one prominent action in each area, the default button (transparent with a white border) for the second action, and `variant="outline"` for alternative actions. On photos, also use a `cta` button.
- Text on orange is always dark (`text-primary-foreground`), never white or orange. No large orange backgrounds other than the announcement bar and the footer bar.
- Red is for errors and sold-out items only.
- Buttons, fields and image boxes are `rounded-lg` (8 px); cards, dialogs and photo tiles are `rounded-xl` (12 px); and tabs, chips, the search field and badges are pills (`rounded-full`). The hero, the trust strip and the footer have no corners.
- Product cards are `rounded-xl bg-card` with no border and no shadow, separated by gaps in the grid (`grid gap-3 md:gap-4`; see `ProductGrid`). The round cart button in their corner (`QuickAddButton`) is surrounded by `ring-[6px] ring-background`, so leave room for it with `pe-12` in the text column.
- The header is dark and sticky (`sticky top-0 bg-card`), 64 px tall, with a 40 px row of links on desktop. Elements pinned under it start at `top-32`.
- Text on photos is white, over a darkening layer in the background color (`bg-background/45`) and a dark gradient (`bg-gradient-to-t from-background/95`), never directly on the photo.
- The add-to-cart button is always visible on the card, and nothing important appears only on mouse hover.
- No fake numbers ("viewing now"), no countdown without a real date in the data, and no made-up customer reviews or rating stars.
- A `grid` that contains a horizontally swiped row needs `grid-cols-1` on mobile, or the page widens to the row's width.
- Motion is short (300 ms or less) and purposeful, and smooth scrolling goes through `scrollBehavior()` in `src/lib/motion.ts` so that it respects the "reduce motion" setting. No motion to reveal content on scroll.
- Any dialog or panel that only appears on a click is loaded with `next/dynamic` when it opens or once the browser is idle (`useIdle` in `src/lib/use-idle.ts`), as in `LazyCartSheet` and `MobileNav`, so it does not delay the page on mobile.
- A component is a server component unless it needs state or events. Put `"use client"` on the smallest interactive part only (a button or a tab), and pass it the static parts as children, as in `TrendingTabs` and `Carousel`.
- Don't pass whole data objects to a client component: every prop is written a second time into the page HTML so the component can hydrate in the browser. Pass only the fields it uses, as in `QuickAddButton` (`QuickAddProduct`) and `ProductDetails` (`PurchasableProduct`).
- Buttons are a native `<button>` element through `Button`, with no library, and their default type is `button`, so write `type="submit"` explicitly for a form's submit button.
- A page outside the `(store)` group (such as the 404 page) is wrapped in `StoreShell`, so the cart, the wishlist and the menus work on it.

## Ready-made components to check before creating a new one

- `ProductCard`, `ProductGrid` and `ProductRail` in `src/components/product`: the dark product card with the round cart button, its grid and its horizontal row. Their data has the type `ProductCardData`, and the search index uses `SearchCardData` (the card plus the search text).
- The home page sections in `src/components/home`, each one a separate component: `TrustStrip`, `WhyUs`, `PromoGrid`, `NewArrivals`, `TrendingTabs`, `DealsRail`, `CategoryRail`, `Testimonials` and `ContactSection`. The page itself only puts them in order.
- `Carousel` and `SectionHeading` in `src/components/store`: a swiped row with round scroll buttons, and a section heading with an orange "View all" link and an optional description.
- `PromoTile`, `DiscountCard`, `SpotlightCard` and `WideBanner` in `src/components/home`, one file each: the photo deal tiles, the discount card, the category cards and the wide banner. Their shared dark gradient over photos is `IMAGE_SHADE` in `banner-styles.ts`.
- `HeroSlider` in `src/components/home`: the full-width hero, with centered text over a darkening layer and a gradient.
- `ContactCards` in `src/components/content`: the contact cards with orange circles, for the home page and the "Contact us" page.
- `useAddToCart` and `QuantityStepper` in `src/components/cart`: adding to the cart while opening its panel, and the quantity selector.
- `Tabs` in `src/components/ui/tabs.tsx`: lightweight tabs with the shadcn API but without Base UI, with every panel in the HTML. Their default look is a pill with a gray border, orange when active, so don't repeat their classes.
- `StoreShell` in `src/components/layout`: the whole store shell (the header, the footer, the cart and the bottom bar).
- `SearchBox variant="header"` in `src/components/layout`: the wide search field in the middle of the header.
- `toast` in `src/lib/toast.ts`: short notifications, whose library loads with the first message. Don't import from `sonner` directly.
- `openGraph` and `shareImages` in `src/lib/seo.ts`: the share data, with its image, for any new page.

## After a change

- If you edited `DESIGN.md`, run `pnpm design:lint`; it must finish with no errors and no warnings. The check also verifies color contrast (WCAG AA).
- Run `pnpm verify` (formatting, ESLint with zero warnings, types, the design file and the unit tests).
- Review the page at mobile size (375 px) and on desktop.

## Changing the store's identity (name, colors and font)

1. Edit `DESIGN.md`: the values in the front matter, and the explanation in the Overview and Colors sections.
2. Run `pnpm design:lint` until it reports no errors and no warnings.
3. Copy the colors, with the same hex values, into `src/app/globals.css` in the `:root` block (the variables `--primary`, `--ring`, `--card` and the others), and the corner radius into `--radius` (the value of `rounded.lg`).
4. Copy the same colors into `OG_COLORS` in `src/lib/og/render.ts` for the share images, then build the site more than once to make sure they render consistently.
5. Update `themeColor` in `src/app/layout.tsx`, the color in `src/app/icon.svg`, and the store name in `src/config/site.ts`.
6. To change the font: put the original woff2 files from Fontsource, with their license, in `assets/fonts/<font-name>`, and run `pnpm fonts` to generate the subset copies in `src/fonts/<font-name>`, then update `localFont` in `src/app/layout.tsx`. There is one file for the Arabic letters and another for Latin, and one file per weight unless the font has a variable weight. Delete the old font's folder from both places.
7. To see the full file format: `pnpm exec designmd spec`.
