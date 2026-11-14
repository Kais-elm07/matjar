"use client"

import { useRouter } from "next/navigation"
import { BanknoteIcon, RotateCcwIcon, TruckIcon } from "lucide-react"

import { useAddToCart } from "@/components/cart/use-add-to-cart"
import { DiscountBadge } from "@/modules/catalog/components/discount-badge"
import { Price } from "@/modules/catalog/components/price"
import { ProductGallery } from "@/modules/catalog/components/product-gallery"
import { PurchaseActions } from "@/modules/catalog/components/purchase-actions"
import { StockStatus } from "@/modules/catalog/components/stock-status"
import { TrustItem } from "@/modules/catalog/components/trust-item"
import { useVariantSelection } from "@/modules/catalog/components/use-variant-selection"
import { VariantPicker } from "@/modules/catalog/components/variant-picker"
import type { PurchasableProduct } from "@/modules/catalog/variant-selection"

interface ProductDetailsProps {
  product: PurchasableProduct
}

/**
 * The top of the product page: the photo gallery and the purchase panel. Choosing options changes the
 * price, the stock and the photo (useVariantSelection); the description and specs are in ProductTabs.
 */
export function ProductDetails({ product }: ProductDetailsProps) {
  const choice = useVariantSelection(product)
  const { variant, stock } = choice
  const router = useRouter()
  const addToCart = useAddToCart()
  const price = variant?.price ?? product.price
  const compareAtPrice = variant
    ? variant.compareAtPrice
    : product.compareAtPrice

  /**
   * Adds the chosen variant in the chosen quantity and returns the number of items added. `confirm` shows
   * Najm catching it, or the cart panel; `origin` is the pressed button.
   */
  function add(confirm: boolean, origin?: Element) {
    if (!variant || stock === 0) return 0
    const image = product.images[choice.imageIndex] ?? product.images[0]
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
      choice.quantity,
      { confirm, origin }
    )
  }

  /** "اشترِ الآن" (Buy now): adds to the cart and goes straight to it. */
  function buyNow() {
    if (add(false) > 0) router.push("/cart")
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-10 lg:gap-14">
      <ProductGallery
        images={product.images}
        activeIndex={choice.imageIndex}
        onActiveIndexChange={choice.setImageIndex}
      />

      <div className="flex flex-col gap-5">
        <div className="space-y-3">
          <h1 className="text-2xl leading-snug font-bold md:text-3xl">
            {product.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <Price price={price} compareAtPrice={compareAtPrice} size="lg" />
            <DiscountBadge price={price} compareAtPrice={compareAtPrice} />
          </div>
          <StockStatus stock={stock} />
        </div>

        <VariantPicker
          groups={product.optionGroups}
          selected={choice.selected}
          stateOf={choice.stateOf}
          onSelect={choice.select}
        />

        <PurchaseActions
          slug={product.slug}
          name={product.name}
          canBuy={choice.canBuy}
          quantity={choice.quantity}
          maxQuantity={choice.maxQuantity}
          onQuantityChange={choice.setQuantity}
          onAddToCart={(origin) => add(true, origin)}
          onBuyNow={buyNow}
        />

        <ul className="grid gap-3 rounded-2xl border bg-card p-4 text-sm sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
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
