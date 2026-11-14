/** Class strings shared by the admin panel's pages (DESIGN.md: Admin panel). */

/** A section, a product or a form: a surface card with 16 px corners and a thin border */
export const ADMIN_CARD = "rounded-2xl border bg-card p-4 md:p-6"

/** A section heading inside a card */
export const ADMIN_SECTION_TITLE = "mb-4 text-lg font-bold"

/** A link in the panel's header, 44 px tall */
export const ADMIN_NAV_LINK =
  "inline-flex h-11 items-center rounded-full px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"

/** A grid of fields: one column on phones, two from tablets */
export const ADMIN_FIELDS = "grid gap-4 md:grid-cols-2"

/** A repeated row of fields (a photo, a variant), separated from the next by a border */
export const ADMIN_ROW =
  "grid gap-3 border-b pb-4 last:border-b-0 last:pb-0 md:items-end"

/** A product photo's small thumbnail on the light surface, without a tone (DESIGN.md: Admin panel) */
export const ADMIN_THUMB =
  "relative size-16 shrink-0 rounded-xl border bg-muted"

/** The photo inside ADMIN_THUMB, whole and with a little padding */
export const ADMIN_THUMB_IMAGE = "rounded-xl object-contain p-1"
