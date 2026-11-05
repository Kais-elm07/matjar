import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton"

/** تخطيط صفحات القوائم: شريط الفلاتر في جهة البداية على الحاسوب، والنتائج بجانبه. */
export const LISTING_LAYOUT =
  "lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8"

/** شبكة النتائج نفسها في كل القوائم */
export const LISTING_GRID = "lg:grid-cols-3 xl:grid-cols-4"

/** هيكل صفحة القائمة أثناء تحميل النتائج (البحث مثلاً)، بمكان شريط الفلاتر نفسه. */
export function ListingSkeleton() {
  return (
    <div className={LISTING_LAYOUT} aria-hidden>
      <div className="hidden lg:block" />
      <ProductGridSkeleton className={LISTING_GRID} />
    </div>
  )
}
