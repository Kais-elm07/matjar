import { ProductMiniCard } from "@/modules/catalog/components/product-mini-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { CategoryLink, ProductCardData } from "@/modules/catalog/types"

interface TrendingTabsProps {
  groups: { category: CategoryLink; products: ProductCardData[] }[]
}

/**
 * "الرائج الآن" (Trending now): a tab for each main category, with its best sellers as small horizontal cards.
 * A server component: the cards are prebuilt in the HTML, and only the tabs run in the browser.
 */
export function TrendingTabs({ groups }: TrendingTabsProps) {
  if (groups.length === 0) return null

  return (
    <section aria-labelledby="trending-heading">
      <Tabs defaultValue={groups[0].category.slug} className="gap-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 id="trending-heading" className="text-2xl font-bold md:text-3xl">
            الرائج الآن
          </h2>
          <TabsList className="w-full justify-start md:w-auto">
            {groups.map(({ category }) => (
              <TabsTrigger key={category.slug} value={category.slug}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {groups.map(({ category, products }) => (
          <TabsContent key={category.slug} value={category.slug}>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <li key={product.slug}>
                  <ProductMiniCard product={product} />
                </li>
              ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
