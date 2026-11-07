import type { CouponInput } from "@/lib/checkout/types"

/**
 * Demo discount coupons. Amounts are in riyals.
 * The codes stay on the server: the checkout asks the server about a code (lookupCoupon in
 * src/lib/checkout/actions.ts), so visitors can't read the list in the page's code.
 */
export const coupons: CouponInput[] = [
  {
    code: "WELCOME10",
    type: "percent",
    value: 10,
    maxDiscount: 100,
    description: "خصم 10% حتى 100 ر.س",
  },
  {
    code: "SAVE50",
    type: "fixed",
    value: 50,
    minSubtotal: 400,
    description: "خصم 50 ر.س للطلبات من 400 ر.س",
  },
  {
    code: "FREESHIP",
    type: "free-shipping",
    description: "شحن مجاني لأي طلب",
  },
]
