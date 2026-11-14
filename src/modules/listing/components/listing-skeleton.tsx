import { ProductGridSkeleton } from "@/modules/catalog/components/product-grid-skeleton"

/** Listing page layout: the filter bar on the start side on desktop, and the results beside it. */
export const LISTING_LAYOUT =
  "lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8"

/** The same results grid in every listing */
export const LISTING_GRID = "lg:grid-cols-3 xl:grid-cols-4"

/** Listing page skeleton while results load (search, for example), keeping the filter bar's space. */
export function ListingSkeleton() {
  return (
    <div className={LISTING_LAYOUT} aria-hidden>
      <div className="hidden lg:block" />
      <ProductGridSkeleton className={LISTING_GRID} />
    </div>
  )
}
