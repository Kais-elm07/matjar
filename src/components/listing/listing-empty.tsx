"use client"

import Link from "next/link"
import { SearchXIcon } from "lucide-react"

import { EmptyState } from "@/components/store/empty-state"
import { Button, buttonVariants } from "@/components/ui/button"
import { countActiveFilters, type ListingParams } from "@/lib/catalog/listing"

/** لا توجد نتائج: رسالة تشرح السبب، وزر لما يمكن فعله (مسح الفلاتر أو تصفّح كل المنتجات). */
export function ListingEmpty({
  params,
  search,
  ignoreFilters = false,
  onClear,
}: {
  params: ListingParams
  search: boolean
  /** لا توجد منتجات أصلاً، فمسح الفلاتر لن يفيد */
  ignoreFilters?: boolean
  onClear: () => void
}) {
  if (!ignoreFilters && countActiveFilters(params) > 0) {
    return (
      <EmptyState
        icon={SearchXIcon}
        title="لا توجد منتجات تطابق اختيارك"
        description="جرّب إزالة بعض الفلاتر أو توسيع نطاق السعر."
      >
        <Button variant="outline" size="xl" onClick={onClear}>
          مسح الفلاتر
        </Button>
      </EmptyState>
    )
  }

  if (search) {
    return (
      <EmptyState
        icon={SearchXIcon}
        title={`لم نجد نتائج لـ «${params.q}»`}
        description="تأكد من كتابة الكلمة بشكل صحيح، أو جرّب كلمة أعم مثل اسم الفئة."
      >
        <Link
          href="/products"
          className={buttonVariants({ variant: "outline", size: "xl" })}
        >
          تصفّح كل المنتجات
        </Link>
      </EmptyState>
    )
  }

  return (
    <EmptyState
      icon={SearchXIcon}
      title="لا توجد منتجات هنا بعد"
      description="تصفّح الفئات الأخرى، فالمنتجات الجديدة تُضاف باستمرار."
    />
  )
}
