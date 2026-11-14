import type { CategoryInput } from "@/modules/catalog/types"

/**
 * The store's categories. Their order here is the order they appear on the site.
 * A subcategory gives its parent category's slug in parent.
 * image is the category's cover on its tile: one of the product photos, or leave it out to show the first
 * photo of the category's most popular product.
 *
 * The current data is demo data: replace it with your store's categories.
 */
export const categories: CategoryInput[] = [
  {
    slug: "clothing",
    name: "ملابس",
    description: "ملابس يومية مريحة بخامات مختارة وقصّات عصرية للرجال والنساء.",
    image: "/images/products/floral-summer-dress-2",
  },
  {
    slug: "men",
    name: "رجالي",
    parent: "clothing",
    image: "/images/products/classic-cotton-shirt-2",
  },
  {
    slug: "women",
    name: "نسائي",
    parent: "clothing",
    image: "/images/products/floral-summer-dress-1",
  },
  {
    slug: "electronics",
    name: "إلكترونيات",
    description: "سماعات وشواحن وإكسسوارات ذكية تسهّل يومك.",
    image: "/images/products/portable-speaker-2",
  },
  {
    slug: "audio",
    name: "سماعات وصوتيات",
    parent: "electronics",
    image: "/images/products/noise-cancelling-earbuds-1",
  },
  {
    slug: "phone-accessories",
    name: "إكسسوارات الجوال",
    parent: "electronics",
    image: "/images/products/fast-charger-65w-1",
  },
  {
    slug: "home-kitchen",
    name: "المنزل والمطبخ",
    description: "أدوات مطبخ وقطع ديكور تضيف الراحة والدفء إلى بيتك.",
    image: "/images/products/cookware-set-10-2",
  },
  {
    slug: "beauty",
    name: "العناية والجمال",
    description: "عطور ومستحضرات عناية وأجهزة تصفيف بجودة عالية.",
    image: "/images/products/oud-perfume-1",
  },
  {
    slug: "bags-accessories",
    name: "حقائب وإكسسوارات",
    description: "حقائب وساعات ومحافظ تجمع بين الأناقة والعملية.",
    image: "/images/products/travel-backpack-2",
  },
]
