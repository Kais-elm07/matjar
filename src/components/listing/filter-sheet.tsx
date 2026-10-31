"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

/** لوحة التصفية على الجوال: تنزلق من الأسفل، وفيها نفس فلاتر الشريط الجانبي. */
export function FilterSheet({
  open,
  onOpenChange,
  total,
  onClear,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  total: number
  /** زر "مسح الكل"، يظهر فقط عند وجود فلاتر مفعّلة */
  onClear?: () => void
  children: React.ReactNode
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[88svh] gap-0 rounded-t-2xl p-0"
      >
        <SheetHeader className="border-b pe-14">
          <SheetTitle className="text-lg font-bold">تصفية النتائج</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-4 pb-4 [&>div>section:first-child]:border-t-0 [&>div>section:first-child]:pt-4">
          {children}
        </div>
        <SheetFooter className="flex-row border-t">
          {onClear && (
            <Button variant="outline" size="xl" onClick={onClear}>
              مسح الكل
            </Button>
          )}
          <Button
            size="xl"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            عرض النتائج ({total})
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
