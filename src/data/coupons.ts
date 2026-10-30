import type { CouponInput } from "@/lib/checkout/types"

/**
 * كوبونات الخصم التجريبية. المبالغ بالريال.
 * تنبيه: في موقع ثابت يستطيع أي زائر رؤية هذه الرموز في كود الصفحة،
 * لذلك هي للعرض فقط وليست لعروض حقيقية سرية.
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
