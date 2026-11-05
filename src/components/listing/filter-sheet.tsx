"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface FilterSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  total: number
  /** The "مسح الكل" (Clear all) button, shown only when filters are active */
  onClear?: () => void
  children: React.ReactNode
}

/** The mobile filter panel: slides up from the bottom, with the same filters as the sidebar. */
export function FilterSheet({
  open,
  onOpenChange,
  total,
  onClear,
  children,
}: FilterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[88svh] gap-0 rounded-t-2xl p-0"
      >
        <SheetHeader className="border-b pe-14">
          <SheetTitle className="text-lg font-bold">تصفية النتائج</SheetTitle>
        </SheetHeader>
        {/* The sheet header already draws a line, so the first section of FilterPanel (a div of sections) drops its own */}
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
            variant="cta"
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
