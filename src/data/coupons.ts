import type { CouponInput } from "@/lib/checkout/types"

/**
 * Demo discount coupons. Amounts are in riyals.
 * Note: on a static site any visitor can see these codes in the page's code,
 * so they are for demonstration only, not for real secret offers.
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
