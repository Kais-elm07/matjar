"use client"

import Image from "next/image"
import Link from "next/link"
import { ImageOffIcon, Trash2Icon } from "lucide-react"

import { QuantityStepper } from "@/components/cart/quantity-stepper"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/catalog/money"
import { lineLimit, useCartStore, type CartLine } from "@/lib/store/cart"
import { cn } from "@/lib/utils"

/** سطر منتج في السلة: الصورة والاسم والخيارات والسعر، مع الكمية والحذف. */
export function CartLineItem({
  line,
  onNavigate,
  className,
}: {
  line: CartLine
  /** يُستدعى عند فتح صفحة المنتج، مثلاً لإغلاق نافذة السلة */
  onNavigate?: () => void
  className?: string
}) {
  const setQuantity = useCartStore((state) => state.setQuantity)
  const remove = useCartStore((state) => state.remove)
  const href = `/product/${line.slug}`
  const options = Object.entries(line.options)

  return (
    <li className={cn("flex gap-3 py-4", className)}>
      <Link
        href={href}
        onClick={onNavigate}
        tabIndex={-1}
        aria-hidden
        className="relative size-20 shrink-0 overflow-hidden rounded-lg border bg-background"
      >
        {line.image ? (
          <Image
            src={line.image.src}
            alt=""
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <ImageOffIcon className="absolute inset-0 m-auto size-6 text-muted-foreground/50" />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          href={href}
          onClick={onNavigate}
          className="line-clamp-2 text-sm leading-6 font-medium hover:underline"
        >
          {line.name}
        </Link>
        {options.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {options.map(([name, value]) => `${name}: ${value}`).join("، ")}
          </p>
        )}
        <p className="text-sm">
          <span className="font-bold text-primary">
            {formatPrice(line.price * line.quantity)}
          </span>
          {line.quantity > 1 && (
            <span className="ms-1.5 text-xs text-muted-foreground">
              ({formatPrice(line.price)} للقطعة)
            </span>
          )}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <QuantityStepper
            size="sm"
            value={line.quantity}
            max={lineLimit(line.stock)}
            label={`كمية ${line.name}`}
            onChange={(quantity) => setQuantity(line.sku, quantity)}
          />
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label={`حذف ${line.name} من السلة`}
            onClick={() => remove(line.sku)}
          >
            <Trash2Icon aria-hidden />
          </Button>
        </div>
      </div>
    </li>
  )
}
