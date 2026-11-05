"use client"

import Link from "next/link"
import { SearchXIcon } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Button, buttonVariants } from "@/components/ui/button"
import { countActiveFilters, type ListingParams } from "@/lib/listing/params"

interface ListingEmptyProps {
  params: ListingParams
  search: boolean
  /** There are no products at all, so clearing the filters won't help */
  ignoreFilters?: boolean
  onClear: () => void
}

/**
 * No results: a message that explains why, and a button for what can be done
 * (clear the filters or browse all products).
 */
export function ListingEmpty({
  params,
  search,
  ignoreFilters = false,
  onClear,
}: ListingEmptyProps) {
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
