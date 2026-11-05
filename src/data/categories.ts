import type { CategoryInput } from "@/lib/catalog/types"

/**
 * The store's categories. Their order here is the order they appear on the site.
 * A subcategory gives its parent category's slug in parent.
 *
 * The current data is demo data: replace it with your store's categories.
 */
export const categories: CategoryInput[] = [
  {
    slug: "clothing",
    name: "ملابس",
    description: "ملابس يومية مريحة بخامات مختارة وقصّات عصرية للرجال والنساء.",
    image: "/images/categories/clothing",
  },
  {
    slug: "men",
    name: "رجالي",
    parent: "clothing",
    image: "/images/categories/men",
  },
  {
    slug: "women",
    name: "نسائي",
    parent: "clothing",
    image: "/images/categories/women",
  },
  {
    slug: "electronics",
    name: "إلكترونيات",
    description: "سماعات وشواحن وإكسسوارات ذكية تسهّل يومك.",
    image: "/images/categories/electronics",
  },
  {
    slug: "audio",
    name: "سماعات وصوتيات",
    parent: "electronics",
    image: "/images/categories/audio",
  },
  {
    slug: "phone-accessories",
    name: "إكسسوارات الجوال",
    parent: "electronics",
    image: "/images/categories/phone-accessories",
  },
  {
    slug: "home-kitchen",
    name: "المنزل والمطبخ",
    description: "أدوات مطبخ وقطع ديكور تضيف الراحة والدفء إلى بيتك.",
    image: "/images/categories/home-kitchen",
  },
  {
    slug: "beauty",
    name: "العناية والجمال",
    description: "عطور ومستحضرات عناية وأجهزة تصفيف بجودة عالية.",
    image: "/images/categories/beauty",
  },
  {
    slug: "bags-accessories",
    name: "حقائب وإكسسوارات",
    description: "حقائب وساعات ومحافظ تجمع بين الأناقة والعملية.",
    image: "/images/categories/bags-accessories",
  },
]
