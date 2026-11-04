import { ProductMiniCard } from "@/components/product/product-mini-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { CategoryLink, ProductCardData } from "@/lib/catalog/types"

/**
 * "الرائج الآن": تبويب لكل فئة رئيسية، فيه أكثر منتجاتها مبيعاً ببطاقات أفقية صغيرة.
 * مكوّن خادم: البطاقات تُبنى مسبقاً في HTML، والتبويبات وحدها تعمل في المتصفح.
 */
export function TrendingTabs({
  groups,
}: {
  groups: { category: CategoryLink; products: ProductCardData[] }[]
}) {
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
