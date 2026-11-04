import Image from "next/image"
import Link from "next/link"

import { Carousel } from "@/components/store/carousel"
import { SectionHeading } from "@/components/store/section-heading"
import { PRODUCT_FORMS, pluralize } from "@/lib/arabic-plural"
import type { Category } from "@/lib/catalog/types"

/** مربع فئة مصوّر بنسبة 4:5، واسم الفئة وعدد منتجاتها فوق تدرج داكن (DESIGN.md: category-tile). */
function CategoryTile({ category }: { category: Category }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-xl border bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring"
    >
      {category.image && (
        <Image
          src={category.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 240px, (min-width: 640px) 31vw, 44vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      )}
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/35 to-transparent"
      />
      <span className="absolute inset-x-0 bottom-0 p-3 md:p-4">
        <span className="block text-base font-bold">{category.name}</span>
        <span className="block text-xs text-foreground/75">
          {pluralize(category.productCount, PRODUCT_FORMS)}
        </span>
      </span>
    </Link>
  )
}

/** "تسوّق حسب الفئة": صف مربعات الفئات يُسحب أفقياً. */
export function CategoryRail({ categories }: { categories: Category[] }) {
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
