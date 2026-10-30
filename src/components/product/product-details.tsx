"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  BanknoteIcon,
  RotateCcwIcon,
  ShoppingCartIcon,
  TruckIcon,
  ZapIcon,
} from "lucide-react"

import { QuantityStepper } from "@/components/cart/quantity-stepper"
import { useAddToCart } from "@/components/cart/use-add-to-cart"
import { DiscountBadge, Price } from "@/components/product/price"
import { ProductGallery } from "@/components/product/product-gallery"
import { ShareButton } from "@/components/product/share-button"
import { WishlistButton } from "@/components/product/wishlist-button"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { pluralize } from "@/lib/arabic-plural"
import { getColorHex, type VariantOptions } from "@/lib/catalog/options"
import type { Product, Variant } from "@/lib/catalog/types"
import { lineLimit } from "@/lib/store/cart"
import { cn } from "@/lib/utils"

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
  const router = useRouter()
  const addToCart = useAddToCart()

  const variant: Variant | undefined = product.variants.find((candidate) =>
    groups.every(
      (group) => candidate.options[group.name] === selected[group.name]
    )
  )
  const stock = variant?.stock ?? 0
  const maxQuantity = Math.max(1, lineLimit(stock))
  const currentQuantity = Math.min(quantity, maxQuantity)
  const canBuy = Boolean(variant) && stock > 0

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

  /** يضيف المتغير المختار بالكمية المختارة، ويعيد عدد القطع المضافة. */
  function add(openCart: boolean) {
    if (!variant || stock === 0) return 0
    const image = product.images[imageIndex] ?? product.images[0]
    return addToCart(
      {
        sku: variant.sku,
        slug: product.slug,
        name: product.name,
        image: image ? { src: image.src, alt: image.alt } : null,
        options: variant.options,
        price: variant.price,
        compareAtPrice: variant.compareAtPrice,
        stock: variant.stock,
      },
      currentQuantity,
      { openCart }
    )
  }

  /** "اشترِ الآن": يضيف للسلة وينتقل إليها مباشرة. */
  function buyNow() {
    if (add(false) > 0) router.push("/cart")
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
                      "relative inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors hover:border-foreground/50 disabled:cursor-not-allowed disabled:opacity-40",
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

        <div className="space-y-3">
          <div className="flex items-stretch gap-3">
            <QuantityStepper
              value={currentQuantity}
              max={maxQuantity}
              disabled={!canBuy}
              onChange={setQuantity}
            />
            <Button
              variant="cta"
              size="xl"
              className="flex-1"
              disabled={!canBuy}
              onClick={() => add(true)}
            >
              <ShoppingCartIcon data-icon="inline-start" aria-hidden />
              {canBuy ? "أضف للسلة" : "غير متوفر حالياً"}
            </Button>
          </div>
          <Button
            size="xl"
            className="w-full"
            disabled={!canBuy}
            onClick={buyNow}
          >
            <ZapIcon data-icon="inline-start" aria-hidden />
            اشترِ الآن
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <WishlistButton
              slug={product.slug}
              name={product.name}
              variant="labeled"
            />
            <ShareButton title={product.name} />
          </div>
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

/** حالة التوفر بنقطة ملونة: أخضر للمتوفر، وكهرماني داكن للكمية القليلة، وأحمر للنفاد. */
function StockStatus({ stock }: { stock: number }) {
  const [tone, text] =
    stock === 0
      ? ["text-destructive", "نفد من المخزون"]
      : stock <= siteConfig.lowStockThreshold
        ? ["text-warning", pluralize(stock, LOW_STOCK_FORMS)]
        : ["text-success", "متوفر"]
  return (
    <p className={cn("flex items-center gap-2 text-sm font-bold", tone)}>
      <span aria-hidden className="size-2 rounded-full bg-current" />
      {text}
    </p>
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
