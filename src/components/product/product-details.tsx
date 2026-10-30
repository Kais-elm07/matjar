"use client"

import { useState } from "react"
import {
  BanknoteIcon,
  MinusIcon,
  PlusIcon,
  RotateCcwIcon,
  ShoppingCartIcon,
  TruckIcon,
} from "lucide-react"
import { toast } from "sonner"

import { DiscountBadge, Price } from "@/components/product/price"
import { ProductGallery } from "@/components/product/product-gallery"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { pluralize } from "@/lib/arabic-plural"
import { getColorHex, type VariantOptions } from "@/lib/catalog/options"
import type { Product, Variant } from "@/lib/catalog/types"
import { cn } from "@/lib/utils"

const MAX_QUANTITY = 10

const LOW_STOCK_FORMS = {
  zero: "نفد من المخزون",
  one: "بقيت قطعة واحدة فقط",
  two: "بقيت قطعتان فقط",
  few: "بقي {n} قطع فقط",
  many: "بقي {n} قطعة فقط",
  other: "بقي {n} قطعة فقط",
}

type ValueState = "available" | "sold-out" | "unavailable"

/** معرض الصور ولوحة الشراء: اختيار المتغير يغيّر السعر والمخزون وصورة اللون. */
export function ProductDetails({ product }: { product: Product }) {
  const groups = product.optionGroups
  const firstAvailable =
    product.variants.find((variant) => variant.stock > 0) ?? product.variants[0]

  const [selected, setSelected] = useState<VariantOptions>(
    firstAvailable.options
  )
  const [imageIndex, setImageIndex] = useState(() =>
    imageIndexForOptions(product, firstAvailable.options, 0)
  )
  const [quantity, setQuantity] = useState(1)

  const variant: Variant | undefined = product.variants.find((candidate) =>
    groups.every(
      (group) => candidate.options[group.name] === selected[group.name]
    )
  )
  const stock = variant?.stock ?? 0
  const maxQuantity = Math.max(1, Math.min(stock, MAX_QUANTITY))
  const currentQuantity = Math.min(quantity, maxQuantity)

  function valueState(groupName: string, value: string): ValueState {
    const candidates = product.variants.filter(
      (candidate) =>
        candidate.options[groupName] === value &&
        groups.every(
          (group) =>
            group.name === groupName ||
            candidate.options[group.name] === selected[group.name]
        )
    )
    if (candidates.length === 0) return "unavailable"
    return candidates.some((candidate) => candidate.stock > 0)
      ? "available"
      : "sold-out"
  }

  function selectValue(groupName: string, value: string) {
    let next = { ...selected, [groupName]: value }
    const exact = product.variants.some((candidate) =>
      groups.every(
        (group) => candidate.options[group.name] === next[group.name]
      )
    )
    if (!exact) {
      // التركيبة غير موجودة: نختار أقرب متغير بهذه القيمة (المتوفر أولاً)
      const fallback =
        product.variants.find(
          (c) => c.options[groupName] === value && c.stock > 0
        ) ?? product.variants.find((c) => c.options[groupName] === value)
      if (fallback) next = fallback.options
    }
    setSelected(next)
    setQuantity(1)
    setImageIndex((current) => imageIndexForOptions(product, next, current))
  }

  function addToCart() {
    toast("السلة قيد التجهيز", {
      description: "ستتمكن قريباً من إضافة المنتجات إلى السلة وإتمام الطلب.",
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-10 lg:gap-14">
      <ProductGallery
        images={product.images}
        activeIndex={imageIndex}
        onActiveIndexChange={setImageIndex}
      />

      <div className="flex flex-col gap-5">
        <div className="space-y-3">
          <h1 className="text-2xl leading-snug font-bold md:text-3xl">
            {product.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <Price
              price={variant?.price ?? product.price}
              compareAtPrice={
                variant ? variant.compareAtPrice : product.compareAtPrice
              }
              size="lg"
            />
            <DiscountBadge
              price={variant?.price ?? product.price}
              compareAtPrice={
                variant ? variant.compareAtPrice : product.compareAtPrice
              }
            />
          </div>
          <StockStatus stock={stock} />
        </div>

        {groups.map((group) => (
          <fieldset key={group.name} className="space-y-3">
            <legend className="mb-3 text-sm font-bold">
              {group.name}:{" "}
              <span className="font-normal text-muted-foreground">
                {selected[group.name]}
              </span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {group.values.map((value) => {
                const state = valueState(group.name, value)
                const isSelected = selected[group.name] === value
                const color = group.isColor ? getColorHex(value) : null
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={isSelected}
                    disabled={state === "unavailable"}
                    onClick={() => selectValue(group.name, value)}
                    className={cn(
                      "relative inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors hover:border-foreground/50 disabled:cursor-not-allowed disabled:opacity-40",
                      isSelected &&
                        "border-primary bg-primary/10 text-primary ring-1 ring-primary hover:border-primary",
                      state === "sold-out" &&
                        "text-muted-foreground line-through decoration-1"
                    )}
                  >
                    {color && (
                      <span
                        aria-hidden
                        className="size-5 rounded-full border border-black/15"
                        style={{ backgroundColor: color }}
                      />
                    )}
                    {value}
                    {state === "sold-out" && (
                      <span className="sr-only">(نفد)</span>
                    )}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}

        <div className="flex items-stretch gap-3">
          <QuantityInput
            value={currentQuantity}
            max={maxQuantity}
            disabled={stock === 0}
            onChange={setQuantity}
          />
          <Button
            size="xl"
            className="flex-1"
            disabled={!variant || stock === 0}
            onClick={addToCart}
          >
            <ShoppingCartIcon data-icon="inline-start" aria-hidden />
            {stock === 0 ? "غير متوفر حالياً" : "أضف للسلة"}
          </Button>
        </div>

        <ul className="grid gap-3 rounded-xl bg-muted/60 p-4 text-sm sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
          <TrustItem icon={BanknoteIcon} text="الدفع عند الاستلام" />
          <TrustItem icon={TruckIcon} text="توصيل إلى باب بيتك" />
          <TrustItem icon={RotateCcwIcon} text="إرجاع واستبدال بسهولة" />
        </ul>

        {variant && (
          <p className="text-xs text-muted-foreground">
            رمز المنتج: <span dir="ltr">{variant.sku}</span>
          </p>
        )}
      </div>
    </div>
  )
}

/** صورة اللون المختار إن وُجدت، وإلا تبقى الصورة الحالية. */
function imageIndexForOptions(
  product: Product,
  options: VariantOptions,
  current: number
) {
  const colorGroup = product.optionGroups.find((group) => group.isColor)
  if (!colorGroup) return current
  const index = product.images.findIndex(
    (image) => image.color === options[colorGroup.name]
  )
  return index >= 0 ? index : current
}

function StockStatus({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <p className="text-sm font-semibold text-destructive">نفد من المخزون</p>
    )
  }
  if (stock <= siteConfig.lowStockThreshold) {
    return (
      <p className="text-sm font-semibold text-amber-700">
        {pluralize(stock, LOW_STOCK_FORMS)}
      </p>
    )
  }
  return <p className="text-sm font-semibold text-primary">متوفر</p>
}

function QuantityInput({
  value,
  max,
  disabled,
  onChange,
}: {
  value: number
  max: number
  disabled: boolean
  onChange: (value: number) => void
}) {
  return (
    <div
      role="group"
      aria-label="الكمية"
      className="flex h-11 items-center rounded-lg border"
    >
      <Button
        variant="ghost"
        size="icon-xl"
        className="h-full rounded-e-none"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        aria-label="زيادة الكمية"
      >
        <PlusIcon aria-hidden />
      </Button>
      <output
        aria-live="polite"
        className="w-8 text-center text-base font-semibold tabular-nums"
      >
        {value}
      </output>
      <Button
        variant="ghost"
        size="icon-xl"
        className="h-full rounded-s-none"
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
        aria-label="إنقاص الكمية"
      >
        <MinusIcon aria-hidden />
      </Button>
    </div>
  )
}

function TrustItem({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
  text: string
}) {
  return (
    <li className="flex items-center gap-2">
      <Icon className="size-4 shrink-0 text-primary" aria-hidden />
      {text}
    </li>
  )
}
