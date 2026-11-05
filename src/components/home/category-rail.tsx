import { CategoryTile } from "@/components/home/category-tile"
import { Carousel } from "@/components/shared/carousel"
import { SectionHeading } from "@/components/shared/section-heading"
import type { Category } from "@/lib/catalog/types"

interface CategoryRailProps {
  categories: Category[]
}

/** "تسوّق حسب الفئة" (Shop by category): a row of category tiles swiped horizontally. */
export function CategoryRail({ categories }: CategoryRailProps) {
  if (categories.length === 0) return null
  return (
    <section aria-labelledby="categories-heading">
      <Carousel
        label="الفئات"
        header={
          <SectionHeading
            id="categories-heading"
            title="تسوّق حسب الفئة"
            href="/products"
            linkLabel="كل المنتجات"
          />
        }
      >
        {categories.map((category) => (
          <li
            key={category.slug}
            className="w-[44%] shrink-0 snap-start sm:w-[31%] md:w-[23.5%] lg:w-[18.8%]"
          >
            <CategoryTile category={category} />
          </li>
        ))}
      </Carousel>
    </section>
  )
}
