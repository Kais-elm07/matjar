import Link from "next/link"

import { RichText } from "@/components/store/rich-text"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Product } from "@/lib/catalog/types"

/** Product page tabs are slightly larger than the default look */
const TAB = "h-10 px-5 text-base"

interface ProductTabsProps {
  product: Product
}

/** The info tabs at the bottom of the product page: description, specs, and shipping and returns. */
export function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="gap-6 border-t pt-8">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="description" className={TAB}>
          الوصف
        </TabsTrigger>
        {product.specs.length > 0 && (
          <TabsTrigger value="specs" className={TAB}>
            المواصفات
          </TabsTrigger>
        )}
        <TabsTrigger value="shipping" className={TAB}>
          الشحن والإرجاع
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="max-w-3xl">
        <RichText text={product.description} />
      </TabsContent>

      {product.specs.length > 0 && (
        <TabsContent value="specs" className="max-w-2xl">
          <dl className="divide-y rounded-xl border">
            {product.specs.map((spec) => (
              <div
                key={spec.label}
                className="grid grid-cols-[minmax(7rem,35%)_1fr] gap-4 px-4 py-3 text-sm"
              >
                <dt className="font-bold">{spec.label}</dt>
                <dd className="text-foreground/80">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </TabsContent>
      )}

      <TabsContent
        value="shipping"
        className="max-w-3xl space-y-3 leading-8 text-foreground/90"
      >
        <p>
          نوصل الطلبات إلى باب بيتك، وتظهر تكلفة الشحن بحسب مدينتك قبل تأكيد
          الطلب، والدفع عند الاستلام متاح لكل الطلبات.
        </p>
        <p>
          يمكنك إرجاع المنتج أو استبداله إذا وصلك بحالة غير مناسبة، وفق سياسة
          الإرجاع.
        </p>
        <p className="flex flex-wrap gap-x-4 gap-y-1">
          <Link
            href="/pages/shipping"
            className="font-medium text-primary hover:underline"
          >
            تفاصيل الشحن والتوصيل
          </Link>
          <Link
            href="/pages/returns"
            className="font-medium text-primary hover:underline"
          >
            سياسة الإرجاع والاستبدال
          </Link>
        </p>
      </TabsContent>
    </Tabs>
  )
}
