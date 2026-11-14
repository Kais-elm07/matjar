import { ShoppingCartIcon, ZapIcon } from "lucide-react"

import { QuantityStepper } from "@/components/cart/quantity-stepper"
import { ShareButton } from "@/modules/catalog/components/share-button"
import { WishlistButton } from "@/components/product/wishlist-button"
import { Button } from "@/components/ui/button"

interface PurchaseActionsProps {
  slug: string
  name: string
  canBuy: boolean
  quantity: number
  maxQuantity: number
  onQuantityChange: (quantity: number) => void
  /** Gets the pressed button, so the product's photo flies to Najm from there */
  onAddToCart: (origin: HTMLButtonElement) => void
  onBuyNow: () => void
}

/** The quantity, "أضف للسلة" (Add to cart), "اشترِ الآن" (Buy now), and the wishlist and share buttons. */
export function PurchaseActions({
  slug,
  name,
  canBuy,
  quantity,
  maxQuantity,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
}: PurchaseActionsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-stretch gap-3">
        <QuantityStepper
          value={quantity}
          max={maxQuantity}
          disabled={!canBuy}
          onChange={onQuantityChange}
        />
        <Button
          variant="cta"
          size="xl"
          className="flex-1"
          disabled={!canBuy}
          onClick={(event) => onAddToCart(event.currentTarget)}
        >
          <ShoppingCartIcon data-icon="inline-start" aria-hidden />
          {canBuy ? "أضف للسلة" : "غير متوفر حالياً"}
        </Button>
      </div>
      <Button
        size="xl"
        className="w-full"
        disabled={!canBuy}
        onClick={onBuyNow}
      >
        <ZapIcon data-icon="inline-start" aria-hidden />
        اشترِ الآن
      </Button>
      <div className="grid grid-cols-2 gap-3">
        <WishlistButton slug={slug} name={name} variant="labeled" />
        <ShareButton title={name} />
      </div>
    </div>
  )
}
