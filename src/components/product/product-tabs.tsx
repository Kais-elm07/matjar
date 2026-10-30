import Link from "next/link"

import { RichText } from "@/components/product/rich-text"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Product } from "@/lib/catalog/types"

/** التبويب النشط حبة كهرمانية، كما في DESIGN.md (section-tab-active). */
const TAB =
  "h-10 flex-none rounded-full px-5 text-base text-foreground data-active:bg-highlight data-active:text-highlight-foreground data-active:shadow-none"

/** تبويبات المعلومات أسفل صفحة المنتج: الوصف، والمواصفات، والشحن والإرجاع. */
export function ProductTabs({ product }: { product: Product }) {
  return (
    <Tabs
      defaultValue="description"
      className="gap-5 rounded-lg border p-4 md:p-6"
    >
      <TabsList className="h-auto w-full [scrollbar-width:none] justify-start gap-2 overflow-x-auto bg-transparent p-0">
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
