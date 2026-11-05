import { CategoryTile } from "@/components/home/category-tile"
import { Carousel } from "@/components/store/carousel"
import { SectionHeading } from "@/components/store/section-heading"
import type { Category } from "@/lib/catalog/types"

interface CategoryRailProps {
  categories: Category[]
}

/** "تسوّق حسب الفئة": صف مربعات الفئات يُسحب أفقياً. */
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
