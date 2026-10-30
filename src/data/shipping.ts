import type { ShippingInput } from "@/lib/checkout/types"

/**
 * إعدادات الشحن: المدن وسعر التوصيل ومدته، وحد الشحن المجاني. المبالغ بالريال.
 * "مدينة أخرى" تظهر آخر القائمة لأي مدينة غير مذكورة.
 * مؤقتاً مدن السعودية حتى تحديد الدولة (القرار 1 في الخطة).
 */
export const shipping: ShippingInput = {
  freeShippingFrom: 300,
  cities: [
    { name: "الرياض", fee: 25, days: [1, 2], express: true },
    { name: "جدة", fee: 25, days: [1, 2], express: true },
    { name: "الدمام", fee: 25, days: [1, 2], express: true },
    { name: "مكة المكرمة", fee: 30, days: [2, 3] },
    { name: "المدينة المنورة", fee: 30, days: [2, 3] },
    { name: "الخبر", fee: 30, days: [2, 3] },
    { name: "الطائف", fee: 30, days: [2, 4] },
    { name: "تبوك", fee: 35, days: [3, 5] },
    { name: "أبها", fee: 35, days: [3, 5] },
    { name: "بريدة", fee: 35, days: [3, 5] },
    { name: "مدينة أخرى", fee: 40, days: [4, 7] },
  ],
  express: { extraFee: 20, label: "في اليوم التالي" },
}
