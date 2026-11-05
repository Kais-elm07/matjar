import { siteConfig } from "@/config/site"
import { pluralize } from "@/lib/arabic-plural"
import { cn } from "@/lib/utils"

const LOW_STOCK_FORMS = {
  zero: "نفد من المخزون",
  one: "بقيت قطعة واحدة فقط",
  two: "بقيت قطعتان فقط",
  few: "بقيت {n} قطع فقط",
  many: "بقيت {n} قطعة فقط",
  other: "بقيت {n} قطعة فقط",
}

interface StockStatusProps {
  stock: number
}

/** Availability with a colored dot: green for in stock, amber for low stock, red for sold out. */
export function StockStatus({ stock }: StockStatusProps) {
  const [color, text] =
    stock === 0
      ? ["text-destructive", "نفد من المخزون"]
      : stock <= siteConfig.lowStockThreshold
        ? ["text-warning", pluralize(stock, LOW_STOCK_FORMS)]
        : ["text-success", "متوفر"]
  return (
    <p className={cn("flex items-center gap-2 text-sm font-bold", color)}>
      <span aria-hidden className="size-2 rounded-full bg-current" />
      {text}
    </p>
  )
}
